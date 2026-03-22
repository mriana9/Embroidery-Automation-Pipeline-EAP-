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
  pipelineId: integer("pipeline_id").references(() => pipelines.id, {
    onDelete: "cascade",
  }), 
  type: text("type").notNull(),
});

// 3. Subscribers Table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => pipelines.id, {
    onDelete: "cascade",
  }), 
  targetUrl: text("target_url").notNull(),
});

// 4. Jobs Table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => pipelines.id, {
    onDelete: "cascade",
  }),
  status: text("status").default("pending"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. Deliveries Table
export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "cascade" }),
  status: text("status"),
  attempts: integer("attempts").default(0),
});
