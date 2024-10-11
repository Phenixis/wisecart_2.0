ALTER TABLE "teams" ADD COLUMN "stripe_payment_intent_id" text;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "payment_status" varchar(20);