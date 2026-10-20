# PixelCraft

A responsive creative studio built with Next.js. Upload an image, add a centered text overlay, adjust its size and color, and export a PNG.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current features

- Responsive studio UI
- Local image preview and centered text overlay
- Text size and color controls
- PNG export
- AI-edit prompt interface with an honest not-yet-connected API response

## AI editing status

**Generative image editing is not connected yet.** The `/api/edit` endpoint deliberately returns a setup message until a provider-specific adapter is implemented. `.env.example` documents placeholder environment variables; do not add real secrets to GitHub.

## Stack

Next.js 15, React 19, TypeScript, and Lucide icons.
