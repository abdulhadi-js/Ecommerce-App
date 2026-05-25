import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const orderId = session.metadata?.orderId;
      
      if (orderId) {
        // Atomically update order status to PAID
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });
        console.log(`Order ${orderId} marked as PAID.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
