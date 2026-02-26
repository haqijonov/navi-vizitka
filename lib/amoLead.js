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

function sanitizeText(value, maxLength = 255) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength);
}

function sanitizeErrorText(value, maxLength = 240) {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return sanitizeText(value, maxLength);
}

function normalizePageUrl(pageUrl) {
  if (typeof pageUrl !== "string") return null;
  const trimmed = pageUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return null;
  }
}

function sanitizeUtm(rawUtm) {
  if (!rawUtm || typeof rawUtm !== "object") {
    return {};
  }

  const safeUtm = {};
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
  ];

  for (const key of keys) {
    const value = sanitizeText(rawUtm[key], 120);
    if (value) {
      safeUtm[key] = value;
    }
  }

  return safeUtm;
}

function buildMetadata({ normalizedPageUrl, nowUnix, sanitizedUtm, withUtm }) {
  const metadata = {
    form_id: "landing-free-lesson",
    form_name: "Bepul darsga yozilish",
    form_page: normalizedPageUrl,
    form_sent_at: nowUnix,
    referer: normalizedPageUrl,
  };

  if (!withUtm) {
    return metadata;
  }

  metadata.utm_source = sanitizedUtm.utm_source;
  metadata.utm_medium = sanitizedUtm.utm_medium;
  metadata.utm_campaign = sanitizedUtm.utm_campaign;
  metadata.utm_term = sanitizedUtm.utm_term;
  metadata.utm_content = sanitizedUtm.utm_content;
  metadata.utm_id = sanitizedUtm.utm_id;

  return metadata;
}

function createUnsortedPayload({
  sourceUid,
  nowUnix,
  pipelineId,
  metadata,
  contactName,
  contactCustomFields,
}) {
  return [
    {
      source_uid: sourceUid,
      source_name: "Landing form",
      created_at: nowUnix,
      pipeline_id: pipelineId,
      metadata,
      _embedded: {
        leads: [
          {
            name: "Bepul darsga yozilish",
            pipeline_id: pipelineId,
          },
        ],
        contacts: [
          {
            name: contactName,
            custom_fields_values: contactCustomFields,
          },
        ],
      },
    },
  ];
}

function getAmoErrorDetail(amoError) {
  if (!amoError || typeof amoError !== "object") {
    return undefined;
  }

  const directDetail =
    sanitizeErrorText(amoError.detail) ||
    sanitizeErrorText(amoError.title) ||
    sanitizeErrorText(amoError.message);

  const validationErrors =
    amoError["validation-errors"] || amoError.validation_errors;

  if (Array.isArray(validationErrors)) {
    const messages = [];
    for (const requestError of validationErrors) {
      const list = requestError?.errors;
      if (!Array.isArray(list)) continue;

      for (const item of list) {
        const path = sanitizeErrorText(item?.path, 120);
        const code = sanitizeErrorText(item?.code, 120);
        const detail = sanitizeErrorText(item?.detail, 120);
        const line = [path, detail || code].filter(Boolean).join(": ");

        if (line) {
          messages.push(line);
        }
      }
    }

    if (messages.length > 0) {
      return messages.slice(0, 3).join("; ");
    }
  }

  return directDetail;
}

async function postUnsortedLead(amoUrl, accessToken, payload) {
  const response = await axios.post(amoUrl, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data?._embedded?.unsorted?.[0] || null;
}

function toAmoHttpError(error, extra = {}) {
  if (error?.response) {
    const amoError = error.response.data;
    const amoDetail = getAmoErrorDetail(amoError);

    return new HttpError(error.response.status, {
      ok: false,
      message: "amoCRM request failed",
      amoStatus: error.response.status,
      amoDetail,
      amoError,
      ...extra,
    });
  }

  return new HttpError(500, {
    ok: false,
    message: "Internal server error when sending data to amoCRM",
  });
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

  const { name, age, hasComputer, phone, pageUrl, utm } = body;
  const errors = {};
  const sanitizedName = sanitizeText(name, 120);
  const normalizedPageUrl = normalizePageUrl(pageUrl);
  const sanitizedUtm = sanitizeUtm(utm);

  if (!isValidName(sanitizedName)) {
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

  if (!normalizedPageUrl) {
    errors.pageUrl = "pageUrl must be a valid http(s) URL.";
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, {
      ok: false,
      message: "Validation error",
      errors,
    });
  }

  const nowUnix = Math.floor(Date.now() / 1000);
  const hasComputerText = hasComputer ? "Ha" : "Yo'q";
  const contactCustomFields = [];

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

  const amoUrl = `${config.AMO_BASE_URL}/api/v4/leads/unsorted/forms`;
  const hasAnyUtm = Object.keys(sanitizedUtm).length > 0;

  const firstPayload = createUnsortedPayload({
    sourceUid: uuidv4(),
    nowUnix,
    pipelineId: config.AMO_PIPELINE_ID,
    metadata: buildMetadata({
      normalizedPageUrl,
      nowUnix,
      sanitizedUtm,
      withUtm: true,
    }),
    contactName: sanitizedName,
    contactCustomFields,
  });

  try {
    const unsortedItem = await postUnsortedLead(
      amoUrl,
      config.AMO_ACCESS_TOKEN,
      firstPayload,
    );

    return {
      ok: true,
      unsortedUid: unsortedItem?.uid || null,
      leadId: unsortedItem?._embedded?.leads?.[0]?.id || null,
      contactId: unsortedItem?._embedded?.contacts?.[0]?.id || null,
      amoRetryTried: false,
    };
  } catch (firstError) {
    const amoStatus = firstError?.response?.status;

    if (amoStatus === 400 && hasAnyUtm) {
      const retryPayload = createUnsortedPayload({
        sourceUid: uuidv4(),
        nowUnix,
        pipelineId: config.AMO_PIPELINE_ID,
        metadata: buildMetadata({
          normalizedPageUrl,
          nowUnix,
          sanitizedUtm,
          withUtm: false,
        }),
        contactName: sanitizedName,
        contactCustomFields,
      });

      try {
        const unsortedItem = await postUnsortedLead(
          amoUrl,
          config.AMO_ACCESS_TOKEN,
          retryPayload,
        );

        return {
          ok: true,
          unsortedUid: unsortedItem?.uid || null,
          leadId: unsortedItem?._embedded?.leads?.[0]?.id || null,
          contactId: unsortedItem?._embedded?.contacts?.[0]?.id || null,
          amoRetryTried: true,
        };
      } catch (retryError) {
        throw toAmoHttpError(retryError, {
          amoRetryTried: true,
          amoFirstAttemptDetail: getAmoErrorDetail(firstError?.response?.data),
        });
      }
    }

    throw toAmoHttpError(firstError, { amoRetryTried: false });
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
