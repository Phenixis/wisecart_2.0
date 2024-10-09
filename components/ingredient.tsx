import IngredientToDoItem from "./ui/ingredientToDoItem";
import IngredientCard from "./ui/ingredientCard";

export default function Ingredient({ingredient, mode, isCreationDateVisible, isLastUpdateDateVisible, isEditPossible} : {ingredient: any, mode?: string, isCreationDateVisible?: boolean, isLastUpdateDateVisible?: boolean, isEditPossible?: boolean}) {
    switch (mode) {
        case 'card':
            return <IngredientCard ingredient={ingredient} isCreationDateVisible={isCreationDateVisible} isLastUpdateDateVisible={isLastUpdateDateVisible} isEditPossible={isEditPossible}/>;
        default:
            return <IngredientToDoItem ingredient={ingredient} />;
    }
}