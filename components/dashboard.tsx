import ShoppingList from "./ui/shoppingList";
import MealList from './mealLists';
import IngredientLists from './ingredientLists';
import { Suspense } from "react";
import DashboardSkeleton from "./skeletons/dashboardSkeleton";
import { getLastShoppingList } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const shoppingList = await getLastShoppingList(user);
    return (
        <div className="p-6 spacing-y-4">
            {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
            <h2 className="text-xl font-bold">Latest Shopping List :</h2>
            <div className="w-full flex justify-center">
            {shoppingList.map((list) => (
                <ShoppingList key={list.id} user={user} shoppingList={list} />
            ))}
            </div>
            <div className="flex">
                <div className="w-1/2">
                    <h2 className="text-xl font-bold">Meal Lists</h2>
                    <MealList />
                </div>
                <div className="w-1/2">
                    <h2 className="text-xl font-bold">Ingredient Lists</h2>
                    <IngredientLists />
                </div>
            </div>
        </div>
    )
}