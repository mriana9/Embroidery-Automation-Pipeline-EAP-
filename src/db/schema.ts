import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. Pipelines Table
export const pipelines = pgTable("pipelines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sourceUrl: text("source_url"),
});

// 2. Jobs Table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => pipelines.id),
  status: text("status").default("pending"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow(),
});
