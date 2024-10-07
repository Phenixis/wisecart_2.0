import { Suspense } from "react";
import IngredientListsSkeleton from "./skeletons/ingredientListsSkeleton";
import { getAllIngredients } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Ingredient from "./ingredient";

export default async function IngredientLists() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const ingredients = await getAllIngredients(user);

    return (
        <Suspense fallback={<IngredientListsSkeleton />}>
            <div className="p-4 flex items-center flex-wrap">
                {ingredients.map((ingredient) => (
                    <Ingredient key={ingredient.id} ingredient={ingredient} mode={"card"} />
                ))}
            </div>
        </Suspense>
    )
}