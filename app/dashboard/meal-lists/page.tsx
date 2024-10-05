import { redirect } from "next/navigation";
import { getUser, getTeamSubscriptionStatus } from "@/lib/db/queries";
import MealList from "@/components/mealLists";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meal Lists',
};

export default async function DashboardPage() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <MealList />
    );
};