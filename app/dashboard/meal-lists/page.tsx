import verifyUser from "@/components/utils/verifyUser";
import MealList from "@/components/mealLists";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meal Lists',
};

export default async function DashboardPage() {
    await verifyUser();
    
    return (
        <MealList />
    );
};