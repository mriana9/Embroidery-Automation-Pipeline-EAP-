import express from "express";
import { db } from "./db";
import { pipelines } from "./db/schema";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/db-test", async (req, res) => {
  try {
    // محاولة جلب أول سجل من جدول pipelines للتأكد من وجوده
    const result = await db.select().from(pipelines);
    res.json({
      status: "Success",
      message: "Database is connected!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "Error",
      message: "Table not found or connection failed",
      error: error.message,
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
