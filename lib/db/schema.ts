import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const meals = pgTable('meals', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  nbPersons: integer('nb_persons').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
});

export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
});

export const shoppingLists = pgTable('shopping_lists', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  completedAt: timestamp('completed_at'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
});

export const mealsIngredients = pgTable('meals_ingredients', {
  id: serial('id').primaryKey(),
  mealId: integer('meal_id')
    .notNull()
    .references(() => meals.id),
  ingredientId: integer('ingredient_id')
    .notNull()
    .references(() => ingredients.id),
  quantity_per_person: integer('quantity_per_person').notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
});

export const shoppingListsMealsIngredients = pgTable('shopping_lists_meals_ingredients', {
  id: serial('id').primaryKey(),
  shoppingListId: integer('shopping_list_id')
    .notNull()
    .references(() => shoppingLists.id),
  mealId: integer('meal_id')
    .notNull()
    .references(() => meals.id),
  ingredientId: integer('ingredient_id')
    .notNull()
    .references(() => ingredients.id),
  completedAt: timestamp('completed_at'),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  meals: many(meals),
  ingredients: many(ingredients),
  shoppingLists: many(shoppingLists),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  meals: many(meals),
  ingredients: many(ingredients),
  shoppingLists: many(shoppingLists),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const mealsRelations = relations(meals, ({ many }) => ({
  ingredients: many(mealsIngredients),
  shoppingLists: many(shoppingListsMealsIngredients),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  meals: many(mealsIngredients),
  shoppingLists: many(shoppingListsMealsIngredients),
}));

export const mealsIngredientsRelations = relations(mealsIngredients, ({ one }) => ({
  meal: one(meals, {
    fields: [mealsIngredients.mealId],
    references: [meals.id],
  }),
  ingredient: one(ingredients, {
    fields: [mealsIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

export const shoppingListsRelations = relations(shoppingLists, ({ many }) => ({
  meals: many(shoppingListsMealsIngredients),
  ingredients: many(shoppingListsMealsIngredients),
}));

export const shoppingListsMealsIngredientsRelations = relations(shoppingListsMealsIngredients, ({ one }) => ({
  shoppingList: one(shoppingLists, {
    fields: [shoppingListsMealsIngredients.shoppingListId],
    references: [shoppingLists.id],
  }),
  meal: one(meals, {
    fields: [shoppingListsMealsIngredients.mealId],
    references: [meals.id],
  }),
  ingredient: one(ingredients, {
    fields: [shoppingListsMealsIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};
export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
export type MealIngredient = typeof mealsIngredients.$inferSelect;
export type NewMealIngredient = typeof mealsIngredients.$inferInsert;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type NewShoppingList = typeof shoppingLists.$inferInsert;
export type ShoppingListMealIngredient = typeof shoppingListsMealsIngredients.$inferSelect;
export type NewShoppingListMealIngredient = typeof shoppingListsMealsIngredients.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP', // [x]
  SIGN_IN = 'SIGN_IN', // [x]
  SIGN_OUT = 'SIGN_OUT', // [x]
  UPDATE_PASSWORD = 'UPDATE_PASSWORD', // [x]
  DELETE_ACCOUNT = 'DELETE_ACCOUNT', // [x]
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT', // [x]
  CREATE_TEAM = 'CREATE_TEAM', // [x]
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER', // [x]
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER', // [x]
  ACCEPT_INVITATION = 'ACCEPT_INVITATION', // [ ]
  CREATE_INGREDIENT = 'CREATE_INGREDIENT', // [ ]
  UPDATE_INGREDIENT = 'UPDATE_INGREDIENT', // [ ]
  DELETE_INGREDIENT = 'DELETE_INGREDIENT', // [ ]
  CREATE_MEAL = 'CREATE_MEAL', // [ ]
  UPDATE_MEAL = 'UPDATE_MEAL', // [ ]
  ADDED_INGREDIENT_TO_MEAL = 'ADDED_INGREDIENT_TO_MEAL', // [ ]
  REMOVED_INGREDIENT_FROM_MEAL = 'REMOVED_INGREDIENT_FROM_MEAL', // [ ]
  DELETE_MEAL = 'DELETE_MEAL', // [ ]
  CREATE_SHOPPING_LIST = 'CREATE_SHOPPING_LIST', // [ ]
  UPDATE_SHOPPING_LIST = 'UPDATE_SHOPPING_LIST', // [ ]
  ADDED_MEAL_TO_SHOPPING_LIST = 'ADDED_MEAL_TO_SHOPPING_LIST', // [ ]
  REMOVED_ONE_INSTANCE_OF_ONE_MEAL_FROM_SHOPPING_LIST = 'REMOVED_ONE_INSTANCE_OF_ONE_MEAL_FROM_SHOPPING_LIST', // [ ]
  REMOVED_ALL_INSTANCES_OF_ONE_MEAL_FROM_SHOPPING_LIST = 'REMOVED_ALL_INSTANCES_OF_ONE_MEAL_FROM_SHOPPING_LIST', // [ ]
  REMOVED_ALL_MEALS_FROM_SHOPPING_LIST = 'REMOVED_ALL_MEALS_FROM_SHOPPING_LIST', // [ ]
  COMPLETE_SHOPPING_LIST = 'COMPLETE_SHOPPING_LIST', // [ ]
  UNCOMPLETE_SHOPPING_LIST = 'UNCOMPLETE_SHOPPING_LIST', // [ ]
  DELETE_SHOPPING_LIST = 'DELETE_SHOPPING_LIST', // [ ]
  EXPORTED_SHOPPING_LIST_AS_CSV = 'EXPORTED_SHOPPING_LIST_AS_CSV', // [ ]
  EXPORTED_SHOPPING_LIST_AS_MARKDOWN = 'EXPORTED_SHOPPING_LIST_AS_MARKDOWN', // [ ]
  EXPORTED_SHOPPING_LIST_AS_TEXT = 'EXPORTED_SHOPPING_LIST_AS_TEXT', // [ ]
}
