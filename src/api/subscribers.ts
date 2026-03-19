import { Request, Response } from "express";
import { db } from "../db";
import { subscribers } from "../db/schema";

export const addSubscriber = async (req: Request, res: Response) => {
  const { pipelineId, targetUrl } = req.body;
  const result = await db
    .insert(subscribers)
    .values({
      pipelineId: Number(pipelineId),
      targetUrl,
    })
    .returning();

  res.json(result[0]);
};
