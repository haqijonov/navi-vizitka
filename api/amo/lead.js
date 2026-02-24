import { createAmoLead, toHttpError } from "../../lib/amoLead.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    const result = await createAmoLead(req.body, process.env);
    return res.status(200).json(result);
  } catch (error) {
    const { status, body } = toHttpError(error);
    if (status >= 500) {
      console.error("Vercel lead API error:", error.message);
    }
    return res.status(status).json(body);
  }
}
