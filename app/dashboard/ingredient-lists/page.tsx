import verifyUser from "@/components/utils/verifyUser";
import IngredientLists from "@/components/ingredientLists";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ingredient Lists',
};

export default async function DashboardPage() {
    await verifyUser();
    
    return (
        <IngredientLists />
    );
};