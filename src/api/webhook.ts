import { Request, Response } from "express";
import { db } from "../db";
import { jobs } from "../db/schema";

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { pipelineId } = req.params;

    const job = await db
      .insert(jobs)
      .values({
        pipelineId: Number(pipelineId),
        payload: req.body,
        status: "pending",
      })
      .returning();

    res.json({
      message: "Webhook received, job queued ✅",
      job,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to queue job" });
  }
};
