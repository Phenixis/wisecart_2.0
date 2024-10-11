import { getIngredientsOfMeal } from "@/app/dashboard/actions";
import { Meal as MealType, User } from "@/lib/db/schema";
import Ingredient from "./ingredient";
import { User as UserIcon } from "lucide-react";
import { Suspense } from "react";
import MealSkeleton from "./../skeletons/mealSkeleton";

export default async function MealShoppingList({ user, meal, shoppingListId }: { user: User, meal: any /* MealType + mealOrder */, shoppingListId?: number }) {

    const ingredients = await getIngredientsOfMeal(user, meal.id);

    return (
        <Suspense fallback={<MealSkeleton />}>
            <div className="py-2">
                <div className="flex items-center">
                    <h4 className="text-xl leading-none">{meal.name}</h4>
                    <p className="text-sm ml-2">
                        {meal.nbPersons}
                    </p>
                    <UserIcon size={16}/>
                </div>
                <div>
                    {ingredients.map((ingredient) => (
                        <Ingredient key={ingredient.id} ingredient={ingredient} mealId={meal.id} shoppingListId={shoppingListId} mealOrder={meal.order}/>
                    ))}
                </div>
            </div>
        </Suspense>
    )
}