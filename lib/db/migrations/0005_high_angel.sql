ALTER TABLE "shopping_lists_meals" ADD COLUMN "ingredient_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "shopping_lists_meals" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_lists_meals" ADD CONSTRAINT "shopping_lists_meals_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
