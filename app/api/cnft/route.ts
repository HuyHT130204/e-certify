import { NextResponse } from "next/server";

const HELIUS_RPC_URL = process.env.HELIUS_API_KEY_URL;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const ownerAddress = searchParams.get("owner");

	if (!ownerAddress) {
		return NextResponse.json({ error: "Owner address is required" }, { status: 400 });
	}

	if (!HELIUS_RPC_URL) {
		return NextResponse.json({ error: "Backend RPC not configured" }, { status: 500 });
	}

	try {
		const response = await fetch(HELIUS_RPC_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: "e-certify-cnft-fetch",
				method: "getAssetsByOwner",
				params: { ownerAddress, page: 1, limit: 1000 },
			}),
		});

		const data = await response.json();
		if ((data as any).error) {
			throw new Error((data as any).error.message);
		}

		return NextResponse.json((data as any).result);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
