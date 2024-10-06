import { User as UserIcon } from "lucide-react";
import IngredientSkeleton from "../skeletons/ingredientSkeleton";

export default function mealSkeleton() {
    return (
        <div className="w-full py-2 space-y-2">
            <div className="flex items-center">
                <h4 className="w-1/3 h-6 bg-yellow-200"/>
                <div className="w-3 h-4 bg-yellow-200 ml-1"/>
                <UserIcon size={16}/>
            </div>
            <IngredientSkeleton />
            <IngredientSkeleton />
            <IngredientSkeleton />
            <IngredientSkeleton />
        </div>
    )
}