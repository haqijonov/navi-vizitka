import "dotenv/config";
import axios from "axios";
import fs from "fs";

const AMO_ACCESS_TOKEN = process.env.AMO_ACCESS_TOKEN;
const AMO_BASE_URL = process.env.AMO_BASE_URL || "https://navii.amocrm.ru";

function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

const tokenPayload = parseJwtPayload(AMO_ACCESS_TOKEN);
const tokenApiDomain = tokenPayload?.api_domain
  ? `https://${tokenPayload.api_domain}`
  : null;
const API_BASE_URL = process.env.AMO_API_BASE_URL || tokenApiDomain || AMO_BASE_URL;
const SHOULD_WRITE_ENV = process.argv.includes("--write-env");

function upsertEnvValue(lines, key, value) {
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (index >= 0) {
    if (value) {
      lines[index] = `${key}=${value}`;
    }
    return lines;
  }

  lines.push(`${key}=${value || ""}`);
  return lines;
}

function writeEnvValues(values) {
  const envText = fs.readFileSync(".env", "utf8");
  const lines = envText.split(/\r?\n/);

  upsertEnvValue(lines, "AMO_PHONE_FIELD_ID", values.AMO_PHONE_FIELD_ID);
  upsertEnvValue(lines, "AMO_PHONE_WORK_ENUM_ID", values.AMO_PHONE_WORK_ENUM_ID);
  upsertEnvValue(lines, "AMO_NOTEBOOK_FIELD_ID", values.AMO_NOTEBOOK_FIELD_ID);
  upsertEnvValue(lines, "AMO_AGE_FIELD_ID", values.AMO_AGE_FIELD_ID);

  fs.writeFileSync(".env", `${lines.join("\n").replace(/\n+$/, "")}\n`, "utf8");
}

function pickEnum(field, regex, preferredCode) {
  if (!field || !Array.isArray(field.enums)) {
    return null;
  }

  if (preferredCode) {
    const byCode = field.enums.find((item) => item.code === preferredCode);
    if (byCode) return byCode;
  }

  if (regex) {
    const byName = field.enums.find((item) => regex.test(item.value || ""));
    if (byName) return byName;
  }

  return field.enums[0] || null;
}

async function getContactFields() {
  const all = [];
  let page = 1;

  while (true) {
    const response = await axios.get(`${API_BASE_URL}/api/v4/contacts/custom_fields`, {
      params: { page, limit: 250 },
      headers: {
        Authorization: `Bearer ${AMO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const chunk = response.data?._embedded?.custom_fields || [];
    all.push(...chunk);

    if (chunk.length < 250) {
      break;
    }
    page += 1;
  }

  return all;
}

function printFieldList(fields) {
  for (const field of fields) {
    const enums = Array.isArray(field.enums)
      ? field.enums
          .map((item) => `${item.id}:${item.value}${item.code ? `(${item.code})` : ""}`)
          .join(", ")
      : "";
    console.log(
      `${field.id}\tcode=${field.code || "-"}\tname=${field.name || "-"}${enums ? `\tenums=[${enums}]` : ""}`,
    );
  }
}

async function main() {
  if (!AMO_ACCESS_TOKEN) {
    console.error("AMO_ACCESS_TOKEN topilmadi (.env).");
    process.exit(1);
  }

  const fields = await getContactFields();
  console.log(`API base: ${API_BASE_URL}`);

  const phoneField =
    fields.find((field) => field.code === "PHONE") ||
    fields.find((field) => /телефон|phone/i.test(field.name || ""));
  const phoneWorkEnum = pickEnum(phoneField, /раб|work|main/i, "WORK");

  const notebookField = fields.find((field) =>
    /ноутбук|noutbuk|notebook/i.test(field.name || ""),
  );
  const ageField = fields.find((field) => /возраст|yosh|age/i.test(field.name || ""));
  const envValues = {
    AMO_PHONE_FIELD_ID: phoneField?.id || "",
    AMO_PHONE_WORK_ENUM_ID: phoneWorkEnum?.id || "",
    AMO_NOTEBOOK_FIELD_ID: notebookField?.id || "",
    AMO_AGE_FIELD_ID: ageField?.id || "",
  };

  console.log("Recommended .env values:");
  console.log(`AMO_PHONE_FIELD_ID=${envValues.AMO_PHONE_FIELD_ID}`);
  console.log(`AMO_PHONE_WORK_ENUM_ID=${envValues.AMO_PHONE_WORK_ENUM_ID}`);
  console.log(`AMO_NOTEBOOK_FIELD_ID=${envValues.AMO_NOTEBOOK_FIELD_ID}`);
  console.log(`AMO_AGE_FIELD_ID=${envValues.AMO_AGE_FIELD_ID}`);

  if (SHOULD_WRITE_ENV) {
    writeEnvValues(envValues);
    console.log("");
    console.log(".env yangilandi (--write-env).");
  }

  const missing = [];
  if (!phoneField) missing.push("PHONE field");
  if (!phoneWorkEnum) missing.push("PHONE WORK enum");
  if (!notebookField) missing.push("NOTEBOOK field");
  if (!ageField) missing.push("AGE field");

  if (missing.length > 0) {
    console.log("");
    console.log(`Topilmadi: ${missing.join(", ")}`);
    console.log("Quyidagi ro'yxatdan qo'lda ID tanlang:");
  } else {
    console.log("");
    console.log("Barcha kerakli qiymatlar topildi.");
    console.log("Baribir tekshiruv uchun maydonlar ro'yxati:");
  }

  printFieldList(fields);
}

main().catch((error) => {
  if (error.response) {
    console.error(`amoCRM status: ${error.response.status}`);
    console.error(JSON.stringify(error.response.data, null, 2));
    process.exit(1);
  }
  console.error(error.message);
  process.exit(1);
});
