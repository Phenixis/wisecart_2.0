'use server';

import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
    meals,
    ingredients,
    mealsIngredients,
    shoppingLists,
    shoppingListsMeals,
    User,
    ActivityType,
    type NewMeal,
    type NewIngredient,
    type NewShoppingList,
} from '@/lib/db/schema';
import {
    validatedAction,
    validatedActionWithUser,
} from '@/lib/auth/middleware';
import {
    getTeamForUser
} from '@/lib/db/queries';
import {
    logActivity
} from '@/lib/actions/actions';

const createIngredientSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export const createIngredient = validatedActionWithUser(
    createIngredientSchema,
    async (data: z.infer<typeof createIngredientSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const newIngredients: NewIngredient = {
            ...data,
            createdBy: user.id,
            teamId: team.id,
        };

        await Promise.all([
            db.insert(ingredients).values(newIngredients),
            logActivity(team.id, user.id, ActivityType.CREATE_INGREDIENT),
        ]);
    },
);

const createMealSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    nbPersons: z.number().int().positive(),
    ingredients: z.array(createIngredientSchema),
});

export const createMeal = validatedActionWithUser(
    createMealSchema,
    async (data: z.infer<typeof createMealSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const newMeal: NewMeal = {
            ...data,
            createdBy: user.id,
            teamId: team.id,
        };


        await Promise.all([
            db.insert(meals).values(newMeal),
            logActivity(team.id, user.id, ActivityType.CREATE_MEAL),
        ]);
    },
);

const createShoppingListSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    meals: z.array(createMealSchema),
});

export const createShoppingList = validatedActionWithUser(
    createShoppingListSchema,
    async (data: z.infer<typeof createShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const newShoppingList: NewShoppingList = {
            ...data,
            createdBy: user.id,
            teamId: team.id,
        };

        await Promise.all([
            db.insert(shoppingLists).values(newShoppingList),
            logActivity(team.id, user.id, ActivityType.CREATE_SHOPPING_LIST),
        ]);
    },
);

const addMealToShoppingListSchema = z.object({
    shoppingListId: z.number(),
    mealId: z.number()
});

export const addMealToShoppingList = validatedActionWithUser(
    addMealToShoppingListSchema,
    async (data: z.infer<typeof addMealToShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.insert(shoppingListsMeals).values(data),
            logActivity(team.id, user.id, ActivityType.ADDED_MEAL_TO_SHOPPING_LIST),
        ]);
    }
);

const removeOneInstanceOfOneMealFromShoppingListSchema = z.object({
    shoppingListId: z.number(),
    mealId: z.number(),
});

export const removeOneInstanceOfOneMealFromShoppingList = validatedActionWithUser(
    removeOneInstanceOfOneMealFromShoppingListSchema,
    async (data: z.infer<typeof removeOneInstanceOfOneMealFromShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const mealId = await db
            .select({
                id: shoppingListsMeals.id,
            })
            .from(shoppingListsMeals)
            .where(
                and(
                    eq(shoppingListsMeals.shoppingListId, data.shoppingListId),
                    eq(shoppingListsMeals.mealId, data.mealId),
                ),
            ).limit(1);

        await Promise.all([
            db
            .delete(shoppingListsMeals)
            .where(
                eq(shoppingListsMeals.shoppingListId, mealId[0].id),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_ONE_INSTANCE_OF_ONE_MEAL_FROM_SHOPPING_LIST),
        ]);
    }
);

const removeAllInstanceOfOneMealFromShoppingListSchema = z.object({
    shoppingListId: z.number(),
    mealId: z.number(),
});

export const removeAllInstanceOfOneMealFromShoppingList = validatedActionWithUser(
    removeAllInstanceOfOneMealFromShoppingListSchema,
    async (data: z.infer<typeof removeAllInstanceOfOneMealFromShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db
            .delete(shoppingListsMeals)
            .where(
                and(
                    eq(shoppingListsMeals.shoppingListId, data.shoppingListId),
                    eq(shoppingListsMeals.mealId, data.mealId),
                ),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_ALL_INSTANCES_OF_ONE_MEAL_FROM_SHOPPING_LIST),
        ]);
    }
);

const removeAllMealsFromShoppingListSchema = z.object({
    shoppingListId: z.number(),
});

export const removeAllMealsFromShoppingList = validatedActionWithUser(
    removeAllMealsFromShoppingListSchema,
    async (data: z.infer<typeof removeAllMealsFromShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db
            .delete(shoppingListsMeals)
            .where(
                eq(shoppingListsMeals.shoppingListId, data.shoppingListId),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_ALL_MEALS_FROM_SHOPPING_LIST),
        ]);
    }
);

const addIngredientToMealSchema = z.object({
    mealId: z.number(),
    ingredientId: z.number(),
    quantity_per_person: z.number().int().positive(),
    unit: z.string().min(1),
    quantity: z.number().int().positive().default(1),
});

export const addIngredientToMeal = validatedActionWithUser(
    addIngredientToMealSchema,
    async (data: z.infer<typeof addIngredientToMealSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.insert(mealsIngredients).values(data),
            logActivity(team.id, user.id, ActivityType.ADDED_INGREDIENT_TO_MEAL),
        ]);
    }
);

const getMealsSchema = z.object({});

export const getMeals = validatedActionWithUser(
    getMealsSchema,
    async (_, __, user: User) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        return db
            .select({
                id: meals.id,
                name: meals.name,
                createdBy: meals.createdBy,
                teamId: meals.teamId,
                createdAt: meals.createdAt,
            })
            .from(meals)
            .where(eq(meals.teamId, team.id));
    },
);

const getIngredientsSchema = z.object({});

export const getIngredients = validatedActionWithUser(
    getIngredientsSchema,
    async (_, __, user: User) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        return db
            .select({
                id: ingredients.id,
                name: ingredients.name,
                createdBy: ingredients.createdBy,
                teamId: ingredients.teamId,
                createdAt: ingredients.createdAt,
            })
            .from(ingredients)
            .where(eq(ingredients.teamId, team.id));
    },
);

const getShoppingListsSchema = z.object({});

export const getShoppingLists = validatedActionWithUser(
    getShoppingListsSchema,
    async (_, __, user: User) => {
    const team = await getTeamForUser(user.id);
    if (!team) {
        throw new Error('User does not belong to a team');
    }

    return db
        .select({
            id: shoppingLists.id,
            name: shoppingLists.name,
            createdBy: shoppingLists.createdBy,
            teamId: shoppingLists.teamId,
            createdAt: shoppingLists.createdAt,
            completedAt: shoppingLists.completedAt,
        })
        .from(shoppingLists)
        .where(eq(shoppingLists.teamId, team.id));
});

