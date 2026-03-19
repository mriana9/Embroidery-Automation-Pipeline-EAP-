import { Request, Response } from "express";
import { db } from "../db";
import { pipelines } from "../db/schema";
import { eq } from "drizzle-orm";

// CREATE
export const createPipeline = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const newPipeline = await db
      .insert(pipelines)
      .values({
        name,
        sourceUrl: `/webhook/${Date.now()}`, // unique URL
      })
      .returning();

    res.json(newPipeline);
  } catch (err) {
    res.status(500).json({ error: "Failed to create pipeline" });
  }
};

// READ ALL
export const getPipelines = async (req: Request, res: Response) => {
  const all = await db.select().from(pipelines);
  res.json(all);
};

// GIT Pipline ID
export const getPipelineById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, Number(id)));

  if (result.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(result[0]);
};

// DELETE
export const deletePipeline = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.delete(pipelines).where(eq(pipelines.id, Number(id)));

  res.json({ message: "Deleted" });
};
