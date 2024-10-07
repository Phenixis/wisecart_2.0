ALTER TABLE "shopping_lists_meals" RENAME TO "shopping_lists_meals_ingredients";--> statement-breakpoint
ALTER TABLE "shopping_lists_meals_ingredients" DROP CONSTRAINT "shopping_lists_meals_shopping_list_id_shopping_lists_id_fk";
--> statement-breakpoint
ALTER TABLE "shopping_lists_meals_ingredients" DROP CONSTRAINT "shopping_lists_meals_meal_id_meals_id_fk";
--> statement-breakpoint
ALTER TABLE "shopping_lists_meals_ingredients" DROP CONSTRAINT "shopping_lists_meals_ingredient_id_ingredients_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_lists_meals_ingredients" ADD CONSTRAINT "shopping_lists_meals_ingredients_shopping_list_id_shopping_lists_id_fk" FOREIGN KEY ("shopping_list_id") REFERENCES "public"."shopping_lists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_lists_meals_ingredients" ADD CONSTRAINT "shopping_lists_meals_ingredients_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_lists_meals_ingredients" ADD CONSTRAINT "shopping_lists_meals_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
