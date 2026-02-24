# NAVI Landing

React + Vite frontend with amoCRM lead submission API.

## Local run

1. Copy `.env.example` to `.env`
2. Fill amoCRM values in `.env`
3. Install deps:
   - `npm install`
4. Start frontend + local Express API:
   - `npm run dev:full`
5. Open:
   - `http://localhost:5173`

## Vercel deployment

This repo is configured for Vercel with serverless functions:

- `api/amo/lead.js`
- `api/health.js`

### Steps

1. Push this repo to GitHub.
2. Import project in Vercel.
3. In Vercel project settings, set Environment Variables:
   - `AMO_BASE_URL`
   - `AMO_ACCESS_TOKEN`
   - `AMO_PIPELINE_ID`
   - `AMO_PHONE_FIELD_ID` (optional)
   - `AMO_PHONE_WORK_ENUM_ID` (optional)
   - `AMO_NOTEBOOK_FIELD_ID` (optional)
   - `AMO_AGE_FIELD_ID` (optional)
4. Deploy.

`VITE_API_BASE_URL` is optional. If empty, frontend automatically calls same-origin `/api/amo/lead` (recommended for Vercel).

## Notes

- `.env` is ignored by git.
- If an access token was ever committed, rotate it in amoCRM immediately.
