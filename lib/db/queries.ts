import { desc, and, eq, isNull, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { 
  activityLogs,
  teamMembers,
  teams,
  users,
  meals,
  shoppingLists,
  shoppingListsMealsIngredients,
  mealsIngredients,
  ingredients
} from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getUserWithId(userId: number) {
  return await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function updateTeamOneTimePayment(
  teamId: number,
  paymentData: {
    stripePaymentIntentId: string;
    paymentStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...paymentData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
/**
 * Retrieves the team associated with a given user.
 *
 * @param userId - The ID of the user for whom the team is being retrieved.
 * @returns A promise that resolves to the team object if found, or null if no team is associated with the user.
*/
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function getTeamPaymentStatus(userId: number) {
  const team = await getTeamForUser(userId);
  
  if (!team) {
    return null;
  } else if (team.subscriptionStatus) {
    return team.subscriptionStatus;
  } else if (team.paymentStatus) {
    return team.paymentStatus;
  } else {
    return null;
  }
}

/* Une commande qui renvoie l'entièreté des ingrédients d'une liste de courses donnée en faisant la somme des mêmes ingrédients. */
export async function getShoppingListIngredients(shoppingListId: number) {
  return await db
    .select({
      ingredientId: shoppingListsMealsIngredients.ingredientId,
      name: ingredients.name,
      quantity: sql`SUM(${mealsIngredients.quantity_per_person} * ${meals.nbPersons})`,
      unit: mealsIngredients.unit,
    })
    .from(shoppingListsMealsIngredients)
    .innerJoin(mealsIngredients, eq(shoppingListsMealsIngredients.mealId, mealsIngredients.mealId))
    .innerJoin(ingredients, eq(shoppingListsMealsIngredients.ingredientId, ingredients.id))
    .innerJoin(meals, eq(shoppingListsMealsIngredients.mealId, meals.id))
    .where(eq(shoppingListsMealsIngredients.shoppingListId, shoppingListId))
    .groupBy(shoppingListsMealsIngredients.ingredientId);
}