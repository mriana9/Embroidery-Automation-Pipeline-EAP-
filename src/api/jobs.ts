import { Request, Response } from "express";
import { db } from "../db";
import { jobs } from "../db/schema";
import { desc } from "drizzle-orm";

// READ ALL
export const getJobs = async (req: Request, res: Response) => {
  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  res.json(allJobs);
};
