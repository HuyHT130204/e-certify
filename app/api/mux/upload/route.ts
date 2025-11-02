// All code and comments must be in English.
import { NextResponse } from "next/server";

export async function GET() {
	const token = process.env.MUX_TOKEN_ID;
	const secret = process.env.MUX_TOKEN_SECRET;
	if (!token || !secret) return NextResponse.json({ error: "Mux not configured" }, { status: 500 });

	const res = await fetch("https://api.mux.com/video/v1/uploads", {
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(`${token}:${secret}`).toString("base64")}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ new_asset_settings: { playback_policy: ["public"] }, cors_origin: "*" }),
	});
	const data = await res.json();
	return NextResponse.json(data);
}
// All code and comments must be in English.
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// Requires env: MUX_TOKEN_ID, MUX_TOKEN_SECRET
const tokenId = process.env.MUX_TOKEN_ID;
const tokenSecret = process.env.MUX_TOKEN_SECRET;

export async function POST() {
  if (!tokenId || !tokenSecret) {
    return NextResponse.json({ error: "Mux environment not configured" }, { status: 500 });
  }

  try {
    const mux = new Mux({ tokenId, tokenSecret });
    // Create a direct upload URL so the client can upload video securely
    const { id, url } = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: { playback_policy: ["public"] },
    });

    return NextResponse.json({ uploadId: id, uploadUrl: url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Mux error" }, { status: 500 });
  }
}





