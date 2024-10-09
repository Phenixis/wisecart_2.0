import IngredientToDoItem from "./ui/ingredientToDoItem";
import IngredientCard from "./ui/ingredientCard";
import { isIngredientToggled as isIngredientToggledFunction } from "@/app/dashboard/actions";

export default async function Ingredient({ingredient, mode, isCreationDateVisible, isLastUpdateDateVisible, isEditPossible, mealId, shoppingListId} : {ingredient: any, mode?: string, isCreationDateVisible?: boolean, isLastUpdateDateVisible?: boolean, isEditPossible?: boolean, mealId: number, shoppingListId: number}) {
    switch (mode) {
        case 'card':
            return <IngredientCard ingredient={ingredient} isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} isEditPossible={isEditPossible}/>;
        default:
            const isIngredientToggled = await isIngredientToggledFunction(ingredient.id, mealId, shoppingListId);
            return <IngredientToDoItem ingredient={ingredient} mealId={mealId} shoppingListId={shoppingListId} isIngredientToggled={isIngredientToggled}/>;
    }
}