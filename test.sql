-- Insert sample data into the tables
INSERT INTO "ingredients" ("name", "team_id") VALUES 
('Tomato', 1), 
('Cheese', 1), 
('Lettuce', 1);

INSERT INTO "meals" ("name", "description", "nb_persons", "team_id") VALUES 
('Salad', 'Fresh vegetable salad', 2, 1), 
('Pizza', 'Cheese pizza', 4, 1);

INSERT INTO "meals_ingredients" ("meal_id", "ingredient_id", "quantity_per_person", "unit") VALUES 
(1, 1, 2, 'pieces'), 
(1, 3, 1, 'head'), 
(2, 1, 3, 'pieces'), 
(2, 2, 200, 'grams');

INSERT INTO "shopping_lists" ("name", "team_id") VALUES 
('Weekly Groceries', 1);

INSERT INTO "shopping_lists_meals" ("shopping_list_id", "meal_id", "quantity") VALUES 
(1, 1, 2), 
(1, 2, 1);

-- Select all data from each table
SELECT * FROM "ingredients";
SELECT * FROM "meals";
SELECT * FROM "meals_ingredients";
SELECT * FROM "shopping_lists";
SELECT * FROM "shopping_lists_meals";

-- List ingredients for each shopping list with the sum of their required quantities
SELECT 
sl.name AS "Shopping List",
i.name AS "Ingredient",
SUM(mi.quantity_per_person * m.nb_persons * slm.quantity) AS "Total Quantity",
mi.unit
FROM shopping_lists sl
JOIN shopping_lists_meals slm ON sl.id = slm.shopping_list_id
JOIN meals m ON slm.meal_id = m.id
JOIN meals_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY sl.name, i.name, mi.unit
ORDER BY sl.name, i.name;

-- Truncate the tables to remove all data
TRUNCATE TABLE "ingredients" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "meals" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "meals_ingredients" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "shopping_lists" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "shopping_lists_meals" RESTART IDENTITY CASCADE;