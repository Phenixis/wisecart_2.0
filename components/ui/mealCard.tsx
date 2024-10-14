import { getIngredientsOfMeal } from "@/app/dashboard/actions";
import { Meal as MealType, User } from "@/lib/db/schema";
import Ingredient from "./ingredient";
import { User as UserIcon } from "lucide-react";
import { Suspense } from "react";
import MealSkeleton from "./../skeletons/mealSkeleton";
import MealEditPopup from "./mealEditPopup";

export default async function MealCard({ user, meal, isEditPossible }: { user: User, meal: any /* MealType + mealOrder */, isEditPossible: boolean}) {

    const ingredients = await getIngredientsOfMeal(user, meal.id);

    return (
        <Suspense fallback={<MealSkeleton />}>
            <div className="bg-white shadow rounded-xl w-fit p-2 mb-4 mr-4 group">
                <div className="flex items-center justify-between h-[24px]">
                    <div className="flex items-center">
                        <h4 className="text-xl leading-none">{meal.name}</h4>
                        <p className="text-sm ml-2">
                            {meal.nbPersons}
                        </p>
                        <UserIcon size={16}/>
                    </div>
                    { isEditPossible ? 
                    <div className="sm:hidden sm:group-hover:block">
                        <MealEditPopup key={meal.id} meal={meal} />
                    </div>
                    : '' }
                </div>
                <p className="text-sm text-gray-500">{meal.description}</p>
                <div>
                    {ingredients.map((ingredient) => (
                        <Ingredient key={ingredient.id} ingredient={ingredient} mode={"mealCard"} mealId={meal.id}/>
                    ))}
                </div>
            </div>
        </Suspense>
    )
}