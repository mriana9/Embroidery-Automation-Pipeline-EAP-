import { eq } from "drizzle-orm";
import { db } from "../db";
import { jobs } from "../db/schema";

/* Action 1: Parse Message */
const parseMessage = (message: string) => {
  const nameMatch = message.match(/اسم\s+(\S+)/);
  const productMatch = message.match(/على\s+(\S+)/);
  const urgent = /بسرعة|اليوم|urgent|مستعجل/i.test(message);

  return {
    name: nameMatch ? nameMatch[1] : "غير معروف",
    product: productMatch ? productMatch[1] : "غير محدد",
    priority: urgent ? "urgent" : "normal",
  };
};

/*  Action 2:  Generate Auto Reply */
const autoReply = (parsed: any) =>
  `تم استلام طلبك لتطريز اسم ${parsed.name} على ${parsed.product} 💖، سيتم التواصل معك قريباً.`;

/* Core Logic: Process a Single Job */
const processJob = async (job: any) => {
  try {
    console.log(`⏳ Processing job #${job.id}...`);

    // "processing"
    await db
      .update(jobs)
      .set({ status: "processing" })
      .where(eq(jobs.id, job.id));

      const message = (job.payload as any)?.message || "";

    // Actions
    const parsed = parseMessage(message);
    const reply = autoReply(parsed);

    // payload -> "completed"
    await db
      .update(jobs)
      .set({
        payload: { ...(job.payload as object), parsed, reply },
        status: "completed",
      })
      .where(eq(jobs.id, job.id));

    console.log(`Job #${job.id} completed successfully!`);
  } catch (err) {
    console.error(`Job #${job.id} failed:`, err);

    await db.update(jobs).set({ status: "failed" }).where(eq(jobs.id, job.id));
  }
};

/* Worker Loop: Polling Mechanism */
export const workerLoop = async () => {
  try {
    const pendingJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "pending"));

    if (pendingJobs.length > 0) {
      for (const job of pendingJobs) {
        await processJob(job);
      }
    }
  } catch (err) {
    console.error(" Worker Loop Error:", err);
  }
};

/* Start Worker */
export const startWorker = () => {
  console.log("🚀 Background Worker is running...");
  setInterval(workerLoop, 2000);
};
