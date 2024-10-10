import IngredientToDoItem from "./ui/ingredientToDoItem";
import IngredientCard from "./ui/ingredientCard";
import { isIngredientToggled as isIngredientToggledFunction } from "@/app/dashboard/actions";

export default async function Ingredient({ingredient, mode, isCreationDateVisible, isLastUpdateDateVisible, isEditPossible, mealId, shoppingListId, mealOrder} : {ingredient: any, mode?: string, isCreationDateVisible?: boolean, isLastUpdateDateVisible?: boolean, isEditPossible?: boolean, mealId?: number, shoppingListId?: number, mealOrder?: number}) {
    switch (mode) {
        case 'card':
            return <IngredientCard ingredient={ingredient} isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} isEditPossible={isEditPossible}/>;
        default:
            if (mealId === undefined) {
                throw new Error('Meal ID is required');
            } else if (shoppingListId === undefined) {   
                throw new Error('Shopping list ID is required');
            } else if (mealOrder === undefined) {
                throw new Error('Meal order is required');
            }

            const isIngredientToggled = await isIngredientToggledFunction(ingredient.id, mealId, shoppingListId, mealOrder);
            return <IngredientToDoItem ingredient={ingredient} mealId={mealId} shoppingListId={shoppingListId} isIngredientToggled={isIngredientToggled} mealOrder={mealOrder}/>;
    }
}