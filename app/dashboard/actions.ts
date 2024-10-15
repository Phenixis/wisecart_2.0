'use server';

import { z } from 'zod';
import { and, desc, eq, isNotNull, isNull, sql, max } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
    meals,
    ingredients,
    mealsIngredients,
    shoppingLists,
    shoppingListsMealsIngredients,
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
    getTeamForUser,
    getShoppingListIngredients
} from '@/lib/db/queries';
import {
    logActivity
} from '@/lib/actions/actions';

// INGREDIENTS - CRUD

// Create an ingredient
const createIngredientSchema = z.object({
    name: z.string().min(1),
});

export const createIngredient = validatedActionWithUser(
    createIngredientSchema,
    async (data: z.infer<typeof createIngredientSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        if (await getAllIngredients(user).then((ingredients) => ingredients.some((ingredient) => ingredient.name === data.name))) {
            return { error: `Ingredient '${data.name}' already exists` };
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

        return { success: `Ingredient '${data.name}' created` };
    },
);

// Read the list of ingredients

export async function getAllIngredients(user: User) {
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
            updatedAt: ingredients.updatedAt,
            deletedAt: ingredients.deletedAt,
        })
        .from(ingredients)
        .where(
            and(
                eq(ingredients.teamId, team.id),
                isNull(ingredients.deletedAt),
            ),
        );
};

export async function getIngredientsOfMeal(user: User, mealId: number) {
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
            updatedAt: ingredients.updatedAt,
            deletedAt: ingredients.deletedAt,
            unit: mealsIngredients.unit,
            quantity: sql`sum(${mealsIngredients.quantity_per_person} * ${meals.nbPersons})`,
            nbPersons: meals.nbPersons,
        })
        .from(ingredients)
        .innerJoin(mealsIngredients, eq(ingredients.id, mealsIngredients.ingredientId))
        .innerJoin(meals, eq(mealsIngredients.mealId, meals.id))
        .where(
            and(
                eq(ingredients.teamId, team.id),
                isNull(ingredients.deletedAt),
                eq(mealsIngredients.mealId, mealId),
            ),
        )
        .groupBy(
            ingredients.id,
            mealsIngredients.unit,
            meals.nbPersons,
        );

    // return db
    //     .select({
    //         id: ingredients.id,
    //         name: ingredients.name,
    //         createdBy: ingredients.createdBy,
    //         teamId: ingredients.teamId,
    //         createdAt: ingredients.createdAt,
    //         updatedAt: ingredients.updatedAt,
    //         deletedAt: ingredients.deletedAt,
    //         quantity: sql`sum(${mealsIngredients.quantity_per_person} * ${meals.nbPersons})`,
    //         unit: mealsIngredients.unit,
    //     })
    //     .from(ingredients)
    //     .innerJoin(mealsIngredients, eq(ingredients.id, mealsIngredients.ingredientId))
    //     .innerJoin(meals, eq(mealsIngredients.mealId, meals.id))
    //     .where(
    //         and(
    //             eq(ingredients.teamId, team.id),
    //             isNull(ingredients.deletedAt),
    //             eq(mealsIngredients.mealId, mealId),
    //         ),
    //     )
    //     .groupBy(ingredients.id, mealsIngredients.id, meals.id);
};

// Update an ingredient

const updateIngredientSchema = z.object({
    id: z.string().regex(/^\d+$/),
    name: z.string().min(1),
});

export const updateIngredient = validatedActionWithUser(
    updateIngredientSchema,
    async (data: z.infer<typeof updateIngredientSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const newIngredients: NewIngredient = {
            id: Number(data.id),
            name: data.name,
            createdBy: user.id,
            updatedAt: new Date(),
            teamId: team.id,
        };

        await Promise.all([
            db.update(ingredients).set(newIngredients).where(eq(ingredients.id, Number(data.id))),
            logActivity(team.id, user.id, ActivityType.UPDATE_INGREDIENT),
        ]);
    },
);

export async function isIngredientToggled(ingredientId: number, mealId: number, shoppingListId: number, mealOrder: number) {
    const result = await db
        .select({
            completedAt: shoppingListsMealsIngredients.completedAt,
        })
        .from(shoppingListsMealsIngredients)
        .where(
            and(
                eq(shoppingListsMealsIngredients.ingredientId, ingredientId),
                eq(shoppingListsMealsIngredients.mealId, mealId),
                eq(shoppingListsMealsIngredients.shoppingListId, shoppingListId),
                eq(shoppingListsMealsIngredients.mealOrder, mealOrder),
            ),
        );
    
    return result[0].completedAt !== null;
};

const toggleIngredientSchema = z.object({
    idShoppingList: z.string().regex(/^\d+$/),
    idMeal: z.string().regex(/^\d+$/),
    idIngredient: z.string().regex(/^\d+$/),
    mealOrder: z.string().regex(/^\d+$/),
});

export const toggleIngredient = validatedActionWithUser(
    toggleIngredientSchema,
    async (data: z.infer<typeof toggleIngredientSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }
        let isToggled = await isIngredientToggled(Number(data.idIngredient), Number(data.idMeal), Number(data.idShoppingList), Number(data.mealOrder));

        if (isToggled) { 
            await Promise.all([
                db.update(shoppingListsMealsIngredients)
                .set({completedAt: null})
                .where(
                    and(
                        eq(shoppingListsMealsIngredients.shoppingListId, Number(data.idShoppingList)),
                        eq(shoppingListsMealsIngredients.ingredientId, Number(data.idIngredient)),
                        eq(shoppingListsMealsIngredients.mealId, Number(data.idMeal)),
                        eq(shoppingListsMealsIngredients.mealOrder, Number(data.mealOrder)),
                    ),
                ),
            ]);
        } else {
            await Promise.all([
                db.update(shoppingListsMealsIngredients)
                .set({completedAt: new Date()})
                .where(
                    and(
                        eq(shoppingListsMealsIngredients.shoppingListId, Number(data.idShoppingList)),
                        eq(shoppingListsMealsIngredients.ingredientId, Number(data.idIngredient)),
                        eq(shoppingListsMealsIngredients.mealId, Number(data.idMeal)),
                        eq(shoppingListsMealsIngredients.mealOrder, Number(data.mealOrder)),
                    ),
                ),
            ]);
        }
        return { 'isToggled': !isToggled };
    },
);

// Delete an ingredient

const deleteIngredientSchema = z.object({
    id: z.string().regex(/^\d+$/),
});

export const deleteIngredient = validatedActionWithUser(
    deleteIngredientSchema,
    async (data: z.infer<typeof deleteIngredientSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.update(ingredients).set({deletedAt: new Date()}).where(eq(ingredients.id, Number(data.id))),
            logActivity(team.id, user.id, ActivityType.DELETE_INGREDIENT),
        ]);
    },
);

// MEALS - CRUD

// Create a meal

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

// Read the list of meals

export async function getAllMeals(user: User) {
    const team = await getTeamForUser(user.id);
    if (!team) {
        throw new Error('User does not belong to a team');
    }

    return db
        .select({
            id: meals.id,
            name: meals.name,
            description: meals.description,
            nbPersons: meals.nbPersons,
            createdBy: meals.createdBy,
            teamId: meals.teamId,
            createdAt: meals.createdAt,
            updatedAt: meals.updatedAt,
            deletedAt: meals.deletedAt,
        })
        .from(meals)
        .where(
            and(
                eq(meals.teamId, team.id),
                isNull(meals.deletedAt),
            ),
        );
};

export async function getMealsOfShoppingList(user: User, shoppingListId: number) {
    const team = await getTeamForUser(user.id);
    if (!team) {
        throw new Error('User does not belong to a team');
    }

    return db
        .select({
            id: meals.id,
            name: meals.name,
            description: meals.description,
            nbPersons: meals.nbPersons,
            createdBy: meals.createdBy,
            teamId: meals.teamId,
            createdAt: meals.createdAt,
            updatedAt: meals.updatedAt,
            deletedAt: meals.deletedAt,
            order: shoppingListsMealsIngredients.mealOrder,
        })
        .from(meals)
        .innerJoin(shoppingListsMealsIngredients, eq(meals.id, shoppingListsMealsIngredients.mealId))
        .where(
            and(
                eq(meals.teamId, team.id),
                eq(shoppingListsMealsIngredients.shoppingListId, shoppingListId),
                isNull(meals.deletedAt),
            ),
        )
        .groupBy(
            meals.id,
            shoppingListsMealsIngredients.mealId,
            shoppingListsMealsIngredients.mealOrder,
        );
};

// Update a meal

const updateMealSchema = z.object({
    id: z.string().regex(/^\d+$/),
    name: z.string().min(1),
    description: z.string().optional(),
    nbPersons: z.string().regex(/^\d+$/),
});

export const updateMeal = validatedActionWithUser(
    updateMealSchema,
    async (data: z.infer<typeof updateMealSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const newMeal: NewMeal = {
            ...data,
            id : Number(data.id),
            nbPersons: Number(data.nbPersons),
            createdBy: user.id,
            teamId: team.id,
        };

        await Promise.all([
            db.update(meals).set(newMeal).where(eq(meals.id, Number(data.id))),
            logActivity(team.id, user.id, ActivityType.UPDATE_MEAL),
        ]);
    },
);

const updateIngredientOfMealSchema = z.object({
    mealId: z.string().regex(/^\d+$/),
    ingredientId: z.string().regex(/^\d+$/),
    quantity_per_person: z.string().regex(/^\d+$/),
    unit: z.string().min(1),
});

export const updateIngredientOfMeal = validatedActionWithUser(
    updateIngredientOfMealSchema,
    async (data: z.infer<typeof updateIngredientOfMealSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const newIngredientOfMeal = {
            quantity_per_person: Number(data.quantity_per_person),
            unit: data.unit,
        };

        await Promise.all([
            db.update(mealsIngredients)
            .set(newIngredientOfMeal)
            .where(
                and(
                    eq(mealsIngredients.mealId, Number(data.mealId)),
                    eq(mealsIngredients.ingredientId, Number(data.ingredientId)),
                ),
            ),
            logActivity(team.id, user.id, ActivityType.UPDATE_MEAL),
        ]);
    },
);

// Add an ingredient to a meal

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

// Remove an ingredient from a meal

const removeIngredientFromMealSchema = z.object({
    mealId: z.number(),
    ingredientId: z.number(),
});

export const removeIngredientFromMeal = validatedActionWithUser(
    removeIngredientFromMealSchema,
    async (data: z.infer<typeof removeIngredientFromMealSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const mealId = await db
            .select({
                id: mealsIngredients.id,
            })
            .from(mealsIngredients)
            .where(
                and(
                    eq(mealsIngredients.mealId, data.mealId),
                    eq(mealsIngredients.ingredientId, data.ingredientId),
                ),
            ).limit(1);

        await Promise.all([
            db
            .delete(mealsIngredients)
            .where(
                eq(mealsIngredients.mealId, mealId[0].id),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_INGREDIENT_FROM_MEAL),
        ]);
    }
);

// Delete a meal

const deleteMealSchema = z.object({
    id: z.number(),
});

export const deleteMeal = validatedActionWithUser(
    deleteMealSchema,
    async (data: z.infer<typeof deleteMealSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.update(meals).set({deletedAt: sql`CURRENT_TIMESTAMP`}).where(eq(meals.id, data.id)),
            logActivity(team.id, user.id, ActivityType.DELETE_MEAL),
        ]);
    },
);

// SHOPPING LISTS - CRUD

// Create a shopping list

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

// Read the list of shopping lists

export async function getShoppingLists(user: User) {
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
        updatedAt: shoppingLists.updatedAt,
        deletedAt: shoppingLists.deletedAt,
        completedAt: shoppingLists.completedAt,
    })
    .from(shoppingLists)
    .where(
        and(
            eq(shoppingLists.teamId, team.id),
            isNotNull(shoppingLists.deletedAt),
        ),
    ).orderBy(desc(shoppingLists.createdAt));
};

export async function getLastShoppingList(user: User) {
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
        updatedAt: shoppingLists.updatedAt,
        deletedAt: shoppingLists.deletedAt,
        completedAt: shoppingLists.completedAt,
    })
    .from(shoppingLists)
    .where(
        and(
            eq(shoppingLists.teamId, team.id),
            isNull(shoppingLists.deletedAt),
        ),
    ).orderBy(desc(shoppingLists.createdAt))
    .limit(1);
}

// Get a shopping list as CSV

const getShoppingListAsCsvSchema = z.object({
    id: z.number(),
});

export const getShoppingListAsCsv = validatedActionWithUser(
    getShoppingListAsCsvSchema,
    async (data: z.infer<typeof getShoppingListAsCsvSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const ingredients = await getShoppingListIngredients(data.id);

        if (ingredients) {
            logActivity(team.id, user.id, ActivityType.EXPORTED_SHOPPING_LIST_AS_CSV);
        } else {
            throw new Error('No ingredients found for shopping list');
        }

        return ingredients.map((ingredient) => `${ingredient.ingredientId},${ingredient.name},${ingredient.quantity},${ingredient.unit}`).join('\n');
    }
);

// Get a shopping list as Markdown

const getShoppingListAsMarkdownSchema = z.object({
    id: z.number(),
});

export const getShoppingListAsMarkdown = validatedActionWithUser(
    getShoppingListAsMarkdownSchema,
    async (data: z.infer<typeof getShoppingListAsMarkdownSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const ingredients = await getShoppingListIngredients(data.id);

        if (ingredients) {
            logActivity(team.id, user.id, ActivityType.EXPORTED_SHOPPING_LIST_AS_MARKDOWN);
        } else {
            throw new Error('No ingredients found for shopping list');
        }

        return ingredients.map((ingredient) => `- [ ] ${ingredient.name} : ${ingredient.quantity}${ingredient.unit}`).join('\n');
    }
);

// Get a shopping list as text

const getShoppingListAsTextSchema = z.object({
    id: z.number(),
});

export const getShoppingListAsText = validatedActionWithUser(
    getShoppingListAsTextSchema,
    async (data: z.infer<typeof getShoppingListAsTextSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const ingredients = await getShoppingListIngredients(data.id);

        if (ingredients) {
            logActivity(team.id, user.id, ActivityType.EXPORTED_SHOPPING_LIST_AS_TEXT);
        } else {
            throw new Error('No ingredients found for shopping list');
        }

        return ingredients.map((ingredient) => `- ${ingredient.name} : ${ingredient.quantity}${ingredient.unit}`).join('\n');
    }
);

// Update a shopping list

const updateShoppingListSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    description: z.string().optional(),
});

export const updateShoppingList = validatedActionWithUser(
    updateShoppingListSchema,
    async (data: z.infer<typeof updateShoppingListSchema>, _, user) => {
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
            db.update(shoppingLists).set(newShoppingList).where(eq(shoppingLists.id, data.id)),
            logActivity(team.id, user.id, ActivityType.UPDATE_SHOPPING_LIST),
        ]);
    },
);

// Add a meal to a shopping list

async function getOrderOfMealsInShoppingList(shoppingListId: number, mealId: number) {
    return db
        .select({
            mealOrder: max(shoppingListsMealsIngredients.mealOrder),
        })
        .from(shoppingListsMealsIngredients)
        .where(
            and(
                eq(shoppingListsMealsIngredients.shoppingListId, shoppingListId),
                eq(shoppingListsMealsIngredients.mealId, mealId),
            )
        );
}

const addMealToShoppingListSchema = z.object({
    shoppingListId: z.number(),
    mealId: z.number()
});

export const addMealToShoppingList = validatedActionWithUser(
    addMealToShoppingListSchema,
    async (data: z.infer<typeof addMealToShoppingListSchema>, _, user) => {
        /* Fonction à tester */
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        const ingredientsOfMeal = await getIngredientsOfMeal(user, data.mealId);
        const orderOfMealsInShoppingList = await getOrderOfMealsInShoppingList(data.shoppingListId, data.mealId);
        
        const insertPromises = ingredientsOfMeal.map(ingredient =>
            db.insert(shoppingListsMealsIngredients).values({
                shoppingListId: data.shoppingListId,
                mealId: data.mealId,
                ingredientId: ingredient.id,
                mealOrder: orderOfMealsInShoppingList[0].mealOrder !== null ? orderOfMealsInShoppingList[0].mealOrder + 1 : 0,
            })
        );

        await Promise.all([
            ...insertPromises,
            logActivity(team.id, user.id, ActivityType.ADDED_MEAL_TO_SHOPPING_LIST),
        ]);
    }
);

// Remove a meal from a shopping list

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
                id: shoppingListsMealsIngredients.id,
            })
            .from(shoppingListsMealsIngredients)
            .where(
                and(
                    eq(shoppingListsMealsIngredients.shoppingListId, data.shoppingListId),
                    eq(shoppingListsMealsIngredients.mealId, data.mealId),
                ),
            ).limit(1);

        await Promise.all([
            db
            .delete(shoppingListsMealsIngredients)
            .where(
                eq(shoppingListsMealsIngredients.shoppingListId, mealId[0].id),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_ONE_INSTANCE_OF_ONE_MEAL_FROM_SHOPPING_LIST),
        ]);
    }
);

// Remove all instances of one meal from a shopping list

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
            .delete(shoppingListsMealsIngredients)
            .where(
                and(
                    eq(shoppingListsMealsIngredients.shoppingListId, data.shoppingListId),
                    eq(shoppingListsMealsIngredients.mealId, data.mealId),
                ),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_ALL_INSTANCES_OF_ONE_MEAL_FROM_SHOPPING_LIST),
        ]);
    }
);

// Remove all meals from a shopping list

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
            .delete(shoppingListsMealsIngredients)
            .where(
                eq(shoppingListsMealsIngredients.shoppingListId, data.shoppingListId),
            ),
            logActivity(team.id, user.id, ActivityType.REMOVED_ALL_MEALS_FROM_SHOPPING_LIST),
        ]);
    }
);

// Complete a shopping list

const completeShoppingListSchema = z.object({
    id: z.number(),
});

export const completeShoppingList = validatedActionWithUser(
    completeShoppingListSchema,
    async (data: z.infer<typeof completeShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.update(shoppingLists).set({completedAt: sql`CURRENT_TIMESTAMP`}).where(eq(shoppingLists.id, data.id)),
            logActivity(team.id, user.id, ActivityType.COMPLETE_SHOPPING_LIST),
        ]);
    },
);

// Uncomplete a shopping list

const uncompleteShoppingListSchema = z.object({
    id: z.number(),
});

export const uncompleteShoppingList = validatedActionWithUser(
    uncompleteShoppingListSchema,
    async (data: z.infer<typeof uncompleteShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.update(shoppingLists).set({completedAt: null}).where(eq(shoppingLists.id, data.id)),
            logActivity(team.id, user.id, ActivityType.UNCOMPLETE_SHOPPING_LIST),
        ]);
    },
);

// Delete a shopping list

const deleteShoppingListSchema = z.object({
    id: z.number(),
});

export const deleteShoppingList = validatedActionWithUser(
    deleteShoppingListSchema,
    async (data: z.infer<typeof deleteShoppingListSchema>, _, user) => {
        const team = await getTeamForUser(user.id);
        if (!team) {
            throw new Error('User does not belong to a team');
        }

        await Promise.all([
            db.update(shoppingLists).set({deletedAt: sql`CURRENT_TIMESTAMP`}).where(eq(shoppingLists.id, data.id)),
            logActivity(team.id, user.id, ActivityType.DELETE_SHOPPING_LIST),
        ]);
    },
);