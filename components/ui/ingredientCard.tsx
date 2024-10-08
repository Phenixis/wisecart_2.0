import { getUserWithId } from "@/lib/db/queries";
import { Pen } from "lucide-react";
import EditPopup from "./ingredientEditPopup";

export default async function IngredientCard({ ingredient } : {ingredient : any}) {
    const user = (await getUserWithId(ingredient.createdBy)).at(0);
    if (!user) {
        throw new Error('User not found');        
    } else if (!ingredient.name) {
        throw new Error('Ingredient name is required');
    } else if (!ingredient.createdAt) {
        throw new Error('Ingredient creation date is required');
    } else if (!ingredient.updatedAt) {
        throw new Error('Ingredient update date is required');
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-2 w-fit rounded-xl mr-4 mb-4 group">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">{ingredient.name}</h3>
                <div className="hidden group-hover:block">
                    <EditPopup ingredient={ingredient} />
                </div>
            </div>
            <p className="text-xs">Created by {user.name} the {ingredient.createdAt.toLocaleDateString()}</p>
            <p className="text-xs">Last update : {ingredient.updatedAt.toLocaleDateString()}</p>
        </div>
    )
}