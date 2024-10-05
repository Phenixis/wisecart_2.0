import { Suspense } from "react";
import MealListsSkeleton from "./skeletons/mealListsSkeleton";

export default function MealLists() {
    return (
        <Suspense fallback={<MealListsSkeleton />}>
            <div className="p-5 spacing-y-4 size-full bg-purple-500">
                <h2 className="text-xl font-bold">Meal Lists</h2>
            </div>
        </Suspense>
    )
}