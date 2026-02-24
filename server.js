import "dotenv/config";
import express from "express";
import cors from "cors";
import { createAmoLead, getConfigWarnings, toHttpError } from "./lib/amoLead.js";

const app = express();

app.use(cors());
app.use(express.json());

const configWarnings = getConfigWarnings(process.env);
for (const warning of configWarnings) {
  console.error(warning);
}

app.post("/api/amo/lead", async (req, res) => {
  try {
    const result = await createAmoLead(req.body, process.env);
    return res.json(result);
  } catch (error) {
    const { status, body } = toHttpError(error);
    if (status >= 500) {
      console.error("Lead API error:", error.message);
    }
    return res.status(status).json(body);
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`AmoCRM backend server running on port ${PORT}`);
});
