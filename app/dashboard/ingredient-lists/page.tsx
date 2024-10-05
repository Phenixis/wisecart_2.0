import { redirect } from "next/navigation";
import { getUser, getTeamSubscriptionStatus } from "@/lib/db/queries";
import IngredientLists from "@/components/ingredientLists";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ingredient Lists',
};

export default async function DashboardPage() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <IngredientLists />
    );
};