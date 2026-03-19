import { db } from "../db";
import { jobs } from "../db/schema";
import { eq } from "drizzle-orm";
import { processJob } from "../services/processor";

const POLL_INTERVAL = 3000;

const processJobs = async () => {
  // 1. pending
  const pendingJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "pending"));

  for (const job of pendingJobs) {
    console.log("⏳ Processing job:", job.id);

    try {
      // 2. "processing" 
      await db
        .update(jobs)
        .set({ status: "processing" })
        .where(eq(jobs.id, job.id));

      // 3. process Job
      const result = await processJob(job.payload);

      // 4. completed
      await db
        .update(jobs)
        .set({
          status: "completed",
          payload: {
            message: (job.payload as any).message, 
            parsed: {
              name: result.extractedName,
              product: result.product,
              priority: result.priority,
            },
            reply: result.reply,
          },
        })
        .where(eq(jobs.id, job.id));

      console.log("✅ Job processed successfully:", job.id);
    } catch (error) {
      console.error("❌ Error processing job:", job.id, error);
      await db
        .update(jobs)
        .set({ status: "failed" })
        .where(eq(jobs.id, job.id));
    }
  }
};

setInterval(processJobs, POLL_INTERVAL);
console.log("🚀 Worker started and watching for jobs...");
