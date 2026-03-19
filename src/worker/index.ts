import { db } from "../db";
import { jobs } from "../db/schema";
import { eq } from "drizzle-orm";
import { processJob } from "../services/processor";

const POLL_INTERVAL = 3000; 

const processJobs = async () => {
  const pendingJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "pending"));

  for (const job of pendingJobs) {
    console.log("Processing job:", job.id);

    await db
      .update(jobs)
      .set({ status: "processing" })
      .where(eq(jobs.id, job.id));

    // 👇 Processing Actions
    const result = await processJob(job.payload);

    // 👇 Mark as done
    await db.update(jobs).set({ status: "done" }).where(eq(jobs.id, job.id));

    console.log("Job processed:", job.id, result);
  }
};

// Polling loop
setInterval(processJobs, POLL_INTERVAL);

console.log("Worker started ✅");
