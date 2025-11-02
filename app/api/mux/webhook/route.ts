// app/api/mux/webhook/route.ts
// All code and comments must be in English.
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle Mux webhook events
    // For now, just acknowledge receipt
    // In production, you would:
    // 1. Verify the webhook signature
    // 2. Update lesson video status in database
    // 3. Process the event (e.g., asset ready, error, etc.)
    
    console.log("Mux webhook received:", body.type);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Mux webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
