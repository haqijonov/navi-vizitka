import axios from "axios";
import { v4 as uuidv4 } from "uuid";

class HttpError extends Error {
  constructor(status, payload) {
    super(payload?.message || "Request failed");
    this.status = status;
    this.payload = payload;
  }
}

function parseOptionalNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getAmoConfig(env = process.env) {
  return {
    AMO_BASE_URL: env.AMO_BASE_URL || "https://navii.amocrm.ru",
    AMO_ACCESS_TOKEN: env.AMO_ACCESS_TOKEN,
    AMO_PIPELINE_ID: parseOptionalNumber(env.AMO_PIPELINE_ID),
    AMO_PHONE_FIELD_ID: parseOptionalNumber(env.AMO_PHONE_FIELD_ID),
    AMO_PHONE_WORK_ENUM_ID: parseOptionalNumber(env.AMO_PHONE_WORK_ENUM_ID),
    AMO_NOTEBOOK_FIELD_ID: parseOptionalNumber(env.AMO_NOTEBOOK_FIELD_ID),
    AMO_AGE_FIELD_ID: parseOptionalNumber(env.AMO_AGE_FIELD_ID),
  };
}

export function getConfigWarnings(env = process.env) {
  const config = getAmoConfig(env);
  const warnings = [];

  if (!config.AMO_ACCESS_TOKEN) {
    warnings.push("Missing AMO_ACCESS_TOKEN in environment");
  }
  if (!Number.isInteger(config.AMO_PIPELINE_ID)) {
    warnings.push("Missing or invalid AMO_PIPELINE_ID in environment");
  }

  return warnings;
}

function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 2;
}

function isValidAge(age) {
  if (typeof age !== "number" || Number.isNaN(age)) return false;
  return age >= 10 && age <= 17;
}

function normalizePhone(phone) {
  if (typeof phone !== "string") return null;
  const clean = phone.replace(/\s+/g, "");

  if (/^\+998\d{9}$/.test(clean)) return clean;
  if (/^998\d{9}$/.test(clean)) return `+${clean}`;
  if (/^8\d{9}$/.test(clean)) return `+998${clean.slice(1)}`;

  return null;
}

function isValidPhone(phone) {
  return /^\+998\d{9}$/.test(phone);
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function parseRequestBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object") return body;
  return {};
}

export async function createAmoLead(rawBody, env = process.env) {
  const body = parseRequestBody(rawBody);
  const config = getAmoConfig(env);

  if (!config.AMO_ACCESS_TOKEN) {
    throw new HttpError(500, {
      ok: false,
      message: "Server configuration error: AMO_ACCESS_TOKEN is missing",
    });
  }

  if (!Number.isInteger(config.AMO_PIPELINE_ID)) {
    throw new HttpError(500, {
      ok: false,
      message: "Server configuration error: AMO_PIPELINE_ID is missing",
    });
  }

  const { name, age, hasComputer, phone, pageUrl, utm = {} } = body;
  const errors = {};

  if (!isValidName(name)) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!isValidAge(age)) {
    errors.age = "Age must be a number between 10 and 17.";
  }

  if (!isBoolean(hasComputer)) {
    errors.hasComputer = "hasComputer must be a boolean.";
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone || !isValidPhone(normalizedPhone)) {
    errors.phone = "Phone must be in format +998XXXXXXXXX.";
  }

  if (!pageUrl || typeof pageUrl !== "string") {
    errors.pageUrl = "pageUrl is required.";
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, {
      ok: false,
      message: "Validation error",
      errors,
    });
  }

  const nowUnix = Math.floor(Date.now() / 1000);
  const sourceUid = uuidv4();
  const hasComputerText = hasComputer ? "Ha" : "Yo'q";
  const contactCustomFields = [];

  if (normalizedPhone) {
    if (config.AMO_PHONE_FIELD_ID) {
      const phoneField = {
        field_id: config.AMO_PHONE_FIELD_ID,
        values: [{ value: normalizedPhone }],
      };

      if (config.AMO_PHONE_WORK_ENUM_ID) {
        phoneField.values[0].enum_id = config.AMO_PHONE_WORK_ENUM_ID;
      }

      contactCustomFields.push(phoneField);
    } else {
      contactCustomFields.push({
        field_code: "PHONE",
        values: [{ value: normalizedPhone, enum_code: "WORK" }],
      });
    }
  }

  if (config.AMO_NOTEBOOK_FIELD_ID) {
    contactCustomFields.push({
      field_id: config.AMO_NOTEBOOK_FIELD_ID,
      values: [{ value: hasComputerText }],
    });
  }

  if (config.AMO_AGE_FIELD_ID) {
    contactCustomFields.push({
      field_id: config.AMO_AGE_FIELD_ID,
      values: [{ value: String(age) }],
    });
  }

  const unsortedPayload = [
    {
      source_uid: sourceUid,
      source_name: "Landing form",
      created_at: nowUnix,
      pipeline_id: config.AMO_PIPELINE_ID,
      metadata: {
        form_id: "landing-free-lesson",
        form_name: "Bepul darsga yozilish",
        form_page: pageUrl,
        form_sent_at: nowUnix,
        referer: pageUrl,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_term: utm.utm_term,
        utm_content: utm.utm_content,
      },
      _embedded: {
        leads: [
          {
            name: "Bepul darsga yozilish",
            pipeline_id: config.AMO_PIPELINE_ID,
          },
        ],
        contacts: [
          {
            name,
            custom_fields_values: contactCustomFields,
          },
        ],
      },
    },
  ];

  const amoUrl = `${config.AMO_BASE_URL}/api/v4/leads/unsorted/forms`;

  try {
    const amoResponse = await axios.post(amoUrl, unsortedPayload, {
      headers: {
        Authorization: `Bearer ${config.AMO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const unsortedItem = amoResponse.data?._embedded?.unsorted?.[0];

    return {
      ok: true,
      unsortedUid: unsortedItem?.uid || null,
      leadId: unsortedItem?._embedded?.leads?.[0]?.id || null,
      contactId: unsortedItem?._embedded?.contacts?.[0]?.id || null,
    };
  } catch (error) {
    if (error.response) {
      throw new HttpError(error.response.status, {
        ok: false,
        message: "amoCRM request failed",
        amoStatus: error.response.status,
        amoError: error.response.data,
      });
    }

    throw new HttpError(500, {
      ok: false,
      message: "Internal server error when sending data to amoCRM",
    });
  }
}

export function toHttpError(error) {
  if (error instanceof HttpError) {
    return { status: error.status, body: error.payload };
  }

  return {
    status: 500,
    body: {
      ok: false,
      message: "Internal server error when sending data to amoCRM",
    },
  };
}
