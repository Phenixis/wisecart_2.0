import { ShoppingList as ShoppingListType, User } from "@/lib/db/schema";
import { getMealsOfShoppingList } from "@/app/dashboard/actions";
import { Suspense } from "react";
import ShoppingListSkeleton from "./../skeletons/shoppingListSkeleton";
import Meal from "./meal";


export default async function ShoppingList({ user, shoppingList }: { user: User, shoppingList: ShoppingListType }) {
    const meals = await getMealsOfShoppingList(user, shoppingList.id);

    return (
        <Suspense fallback={<ShoppingListSkeleton />}>
            <div className="p-6 w-64 shadow bg-yellow-100 h-[50vh]">
                <h3 className="text-xl font-semibold leading-none">{shoppingList.name}</h3>
                {meals.map((meal) => (
                    <Meal key={meal.id} user={user} meal={meal} />
                ))}
            </div>
        </Suspense>
    )
}
