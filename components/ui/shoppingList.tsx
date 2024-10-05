import { ShoppingList as ShoppingListType, User } from "@/lib/db/schema";
import { getMealsOfShoppingList } from "@/app/dashboard/actions";
import { getUserWithId } from "@/lib/db/queries";
import { Suspense } from "react";
import ShoppingListSkeleton from "./../skeletons/shoppingListSkeleton";
import Meal from "./meal";


export default async function ShoppingList({ user, shoppingList }: { user: User, shoppingList: ShoppingListType }) {
    const meals = await getMealsOfShoppingList(user, shoppingList.id);

    return (
        <Suspense fallback={<ShoppingListSkeleton />}>
            <div className="p-2 spacing-y-4">
                <div className="w-full flex items-end space-between">
                    <h3 className="text-xl font-semibold">{shoppingList.name}</h3>
                </div>
                {meals.map((meal) => (
                    <Meal key={meal.id} user={user} meal={meal} />
                ))}
            </div>
        </Suspense>
    )
}
