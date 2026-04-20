import { NextRequest, NextResponse } from "next/server";

let cachedSubscription: unknown = null;

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Subscription invalide" }, { status: 400 });
    }
    cachedSubscription = subscription;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
