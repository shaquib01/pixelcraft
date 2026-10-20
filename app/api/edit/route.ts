import { NextResponse } from "next/server";

export async function POST() {
  // Provider integration is intentionally not faked. Add a trusted image-edit API
  // adapter here once a provider and server-side API key are configured.
  if (!process.env.IMAGE_EDIT_API_URL || !process.env.IMAGE_EDIT_API_KEY) {
    return NextResponse.json({
      error: "AI editing is not connected yet. Add a compatible provider URL and API key to the server environment."
    }, { status: 501 });
  }

  return NextResponse.json({
    error: "A provider-specific adapter is required before AI editing can run."
  }, { status: 501 });
}
