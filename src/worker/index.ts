import { db } from "../db";
import { jobs, subscribers, deliveries } from "../db/schema";
import { eq } from "drizzle-orm";
import { processJob } from "../services/processor";
import axios from "axios";

// Configuration for the background worker
const POLL_INTERVAL = 3000; // Time between each polling cycle (3 seconds)
const MAX_ATTEMPTS = 3; // Maximum number of delivery retries

const processJobs = async () => {
  // Select all jobs currently marked as 'pending'
  const pendingJobs = await db
    .update(jobs)
    .set({ status: "processing" })
    .where(eq(jobs.status, "pending"))
    .returning();

  if (pendingJobs.length > 0) {
    console.log(`[Worker] Found ${pendingJobs.length} jobs to process...`);
  }
  
  for (const job of pendingJobs) {
    try {
      // 1. Mark the job as 'processing' to prevent other worker instances from picking it up
      await db
        .update(jobs)
        .set({ status: "processing" })
        .where(eq(jobs.id, job.id));

      // 2. Execute core processing logic (Parser, Price Estimator, etc.)
      const result = await processJob(job.payload);

      // 3. Update the job record with the processed results and mark as 'completed'
      await db
        .update(jobs)
        .set({
          status: "completed",
          payload: {
            ...(job.payload as any),
            parsed: result,
            reply: result.reply,
          },
        })
        .where(eq(jobs.id, job.id));

      // 4. Retrieve all registered subscribers linked to this specific pipeline
      const pipelineSubscribers = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.pipelineId, job.pipelineId!));

      // Forward the processed data to each subscriber
      for (const sub of pipelineSubscribers) {
        await deliverToSubscriber(job.id, sub.targetUrl, result);
      }

      console.log(`✅ Job ${job.id} fully processed and delivered.`);
    } catch (error) {
      console.error(`❌ Error in Job ${job.id}:`, error);
      // In case of a critical failure, mark the job as 'failed'
      await db
        .update(jobs)
        .set({ status: "failed" })
        .where(eq(jobs.id, job.id));
    }
  }
};

/* Handles delivering the result to a specific subscriber URL with built-in retry logic */
const deliverToSubscriber = async (
  jobId: number,
  targetUrl: string,
  data: any,
) => {
  let attempts = 0;
  let success = false;

  // Retry loop: runs until the request succeeds or the maximum attempts are reached
  while (attempts < MAX_ATTEMPTS && !success) {
    attempts++;
    try {
      console.log(`🚀 Delivery Attempt ${attempts} to: ${targetUrl}`);

      // Send the POST request to the subscriber's target URL
      await axios.post(targetUrl, data);
      success = true;

      // Log a successful delivery attempt in the database
      await db.insert(deliveries).values({
        jobId,
        status: "sent",
        attempts,
      });
    } catch (error) {
      console.error(`⚠️ Attempt ${attempts} failed for URL: ${targetUrl}`);

      // If this was the final attempt, log the delivery as 'failed' in the database
      if (attempts === MAX_ATTEMPTS) {
        await db.insert(deliveries).values({
          jobId,
          status: "failed",
          attempts,
        });
      }

      // Simple Backoff Strategy: Wait for an increasing amount of time before retrying
      await new Promise((res) => setTimeout(res, attempts * 1000));
    }
  }
};

// Start the worker polling cycle
setInterval(processJobs, POLL_INTERVAL);
console.log("🚀 Worker started and watching for jobs...");
