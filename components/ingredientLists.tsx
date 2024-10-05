import { Suspense } from "react";
import IngredientListsSkeleton from "./skeletons/ingredientListsSkeleton";

export default function IngredientLists() {
    return (
        <Suspense fallback={<IngredientListsSkeleton />}>
            <div className="p-5 spacing-y-4 size-full bg-green-500">
                <h2 className="text-xl font-bold">Ingredient Lists</h2>
            </div>
        </Suspense>
    )
}