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

// 2. Actions Table
export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => pipelines.id),
  type: text("type").notNull(), // e.g., 'Text Parser', 'Price Estimator'
});

// 3. Subscribers Table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => pipelines.id),
  targetUrl: text("target_url").notNull(), // وين حنبعث النتيجة النهائية
});

// 4. Jobs Table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => pipelines.id),
  status: text("status").default("pending"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. Deliveries Table (Retry Logic)
export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  status: text("status"), // 'sent', 'failed'
  attempts: integer("attempts").default(0),
});