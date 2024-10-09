import ShoppingList from "./ui/shoppingList";
import MealList from './mealLists';
import IngredientLists from './ingredientLists';
import { getLastShoppingList } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default async function Dashboard() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const shoppingList = await getLastShoppingList(user);

    return (
        <div className="p-6 spacing-y-4">
            <h1 className="hidden text-2xl font-bold">Dashboard</h1>
            <Link key={"/dashboard/shopping-lists"} href={"/dashboard/shopping-lists"} passHref className="flex group">
                <h2 className="text-xl font-bold">Latest shopping list</h2>
                <ArrowUpRight size={16} className="hidden text-primary group-hover:block" />
            </Link>
            <div className="w-full flex justify-center">
            {shoppingList.map((list) => (
                <ShoppingList key={list.id} user={user} shoppingList={list} />
            ))}
            </div>
            <div className="flex">
                <div className="w-1/2">
                <Link key={"/dashboard/meal-list"} href={"/dashboard/meal-list"} passHref className="flex group">
                        <h2 className="text-xl font-bold">Meal List</h2>
                        <ArrowUpRight size={16} className="hidden text-primary group-hover:block" />
                    </Link>
                    <MealList />
                </div>
                <div className="w-1/2">
                    <Link key={"/dashboard/ingredient-list"} href={"/dashboard/ingredient-list"} passHref className="flex group">
                        <h2 className="text-xl font-bold">Ingredient List</h2>
                        <ArrowUpRight size={16} className="hidden text-primary group-hover:block" />
                    </Link>
                    <IngredientLists isCreationDateVisible={false} isLastUpdateDateVisible={false} isEditPossible={false}/>
                </div>
            </div>
        </div>
    )
}