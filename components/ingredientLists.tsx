import { Suspense } from "react";
import IngredientListsSkeleton from "./skeletons/ingredientListsSkeleton";
import { getAllIngredients } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Ingredient from "./ingredient";

export default async function IngredientLists({isCreationDateVisible, isLastUpdateDateVisible, isEditPossible} : {isCreationDateVisible ?: boolean, isLastUpdateDateVisible ?: boolean, isEditPossible ?: boolean}) {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const ingredients = await getAllIngredients(user);

    return (
        <Suspense fallback={<IngredientListsSkeleton isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible}/>}>
            <div className="p-4 flex items-center flex-wrap justify-between">
                {ingredients.map((ingredient) => (
                    <Ingredient key={ingredient.id} ingredient={ingredient} mode={"card"} isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} isEditPossible={isEditPossible} />
                ))}
            </div>
        </Suspense>
    )
}