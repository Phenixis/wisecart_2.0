import { getIngredientsOfMeal } from "@/app/dashboard/actions";
import { Meal as MealType, User } from "@/lib/db/schema";
import Ingredient from "./ingredient";
import { User as UserIcon } from "lucide-react";
import { Suspense } from "react";
import MealSkeleton from "./../skeletons/mealSkeleton";

export default async function Meal({ user, meal }: { user: User, meal: MealType }) {
    const ingredients = await getIngredientsOfMeal(user, meal.id);

    return (
        <Suspense fallback={<MealSkeleton />}>
            <div className="py-2 spacing-y-4 size-full">
                <div className="flex items-end">
                    <h4 className="text-xl">{meal.name}</h4>
                    <div className="flex items-center">
                        <p className="text-sm ml-2">
                            {meal.nbPersons}
                        </p>
                        <UserIcon size={16}/>
                    </div>
                </div>
                <p className="text-sm">
                    {meal.description}
                </p>
                <div className="flex items-center space-x-2">
                    {ingredients.map((ingredient) => (
                        <Ingredient key={ingredient.id} ingredient={ingredient} />
                    ))}
                </div>
            </div>
        </Suspense>
    )
}