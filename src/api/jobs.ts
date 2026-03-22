import { Request, Response } from "express";
import { db } from "../db";
import { jobs } from "../db/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";


/* 
  Descending -> [0 - 10]
  Ascending -> [10 - 0]
  ---------
  orderBy(desc(jobs.createdAt))? to show a new job in the first.
  Number(id)? becouse the number from url is a string, but in db is a number
*/


// READ ALL
export const getJobs = async (req: Request, res: Response) => {
  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  res.json(allJobs);
};


// GIT Job ID
export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, Number(id)));

  if (result.length === 0) return res.status(404).json({ error: "Job not found" });
  res.json(result[0]);
};