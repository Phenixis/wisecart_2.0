import ShoppingLists from './shoppingLists';
import MealList from './mealLists';
import IngredientLists from './ingredientLists';
import { Suspense } from "react";
import DashboardSkeleton from "./skeletons/dashboardSkeleton";

export default function Dashboard() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <div className="p-6 spacing-y-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <h2 className="text-xl font-bold">Last Shopping List :</h2>
                <div className="w-full flex justify-center">
                    <ShoppingLists />
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
        </Suspense>
    )
}