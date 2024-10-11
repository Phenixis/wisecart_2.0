import { Suspense } from "react";
import MealListsSkeleton from "./skeletons/mealListsSkeleton";
import { getAllMeals } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Meal from "./ui/meal";

export default async function MealLists() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const meals = await getAllMeals(user);

    return (
        <Suspense fallback={<MealListsSkeleton />}>
            <div className="p-4 flex items-center flex-wrap space-x-4">
                {meals.map((meal) => (
                    <Meal key={meal.id} mode={"card"} user={user} meal={meal} />
                ))}
            </div>
        </Suspense>
    )
}