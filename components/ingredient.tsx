import IngredientToDoItem from "./ui/ingredientToDoItem";
import IngredientCard from "./ui/ingredientCard";

export default function Ingredient({ingredient, mode} : {ingredient: any, mode: string}) {
    switch (mode) {
        case 'card':
            return <IngredientCard ingredient={ingredient} />;
        case 'list':
            return <IngredientToDoItem ingredient={ingredient} />;
        default:
            return <IngredientToDoItem ingredient={ingredient} />;
    }
}