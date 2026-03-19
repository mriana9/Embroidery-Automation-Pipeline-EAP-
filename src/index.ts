import express from "express";
import { createPipeline, getPipelines, deletePipeline } from "./api/pipelines";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.post("/pipelines", createPipeline);
app.get("/pipelines", getPipelines);
app.delete("/pipelines/:id", deletePipeline);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
