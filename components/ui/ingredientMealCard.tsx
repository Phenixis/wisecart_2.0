import { getUserWithId } from "@/lib/db/queries";
import EditPopup from "./ingredientEditPopup";

export default async function IngredientMealCard({ ingredient, isCreationDateVisible, isLastUpdateDateVisible, isEditPossible } : {ingredient : any, isCreationDateVisible ?: boolean, isLastUpdateDateVisible ?: boolean, isEditPossible ?: boolean}) {
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
        <div className="bg-white shadow-md rounded-lg p-2 w-fit rounded-xl mb-2 mr-2 group">
            <div className="flex items-center justify-between space-x-2">
                <h3 className="text-lg font-semibold text-gray-700">{ingredient.name}</h3>
                { isEditPossible ? 
                <div className="sm:hidden sm:group-hover:block">
                    <EditPopup ingredient={ingredient} />
                </div>
                : '' }
            </div>
            <p>Quantity per person : {ingredient.quantity / ingredient.nbPersons} {ingredient.unit}</p>
            { isCreationDateVisible ? <p className="text-xs hidden sm:block">Created by {user.name} the {ingredient.createdAt.toLocaleDateString()}</p> : '' }
            { isLastUpdateDateVisible ? <p className="text-xs hidden sm:block">Last update : {ingredient.updatedAt.toLocaleDateString()}</p> : '' }
        </div>
    )
}