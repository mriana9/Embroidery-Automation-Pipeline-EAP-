import express from "express";
import { createPipeline, getPipelines, deletePipeline, getPipelineById } from "./api/pipelines";
import { handleWebhook } from "./api/webhook";
import { getJobById, getJobs } from "./api/jobs";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.post("/pipelines", createPipeline);
app.get("/pipelines", getPipelines);
app.delete("/pipelines/:id", deletePipeline);
app.get("/pipelines/:id", getPipelineById);

app.post("/webhook/:pipelineId", handleWebhook);

app.get("/jobs", getJobs);
app.get("/jobs/:id", getJobById);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
