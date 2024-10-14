import { Meal as MealType, User } from "@/lib/db/schema";
import MealCard from "./mealCard";
import MealShoppingList from "./mealShoppingList";

export default async function Meal({ mode, user, meal, shoppingListId }: {mode?:string, user: User, meal: any /* MealType + mealOrder */, shoppingListId?: number }) {
    switch (mode) {
        case 'card':
            return <MealCard user={user} meal={meal} isEditPossible={true}/>;
        default:
            return <MealShoppingList user={user} meal={meal} shoppingListId={shoppingListId}/>;
    }
}