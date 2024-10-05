import { redirect } from "next/navigation";
import { getUser, getTeamSubscriptionStatus } from "@/lib/db/queries";
import ShoppingLists from "@/components/shoppingLists";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Lists',
};

export default async function DashboardPage() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <ShoppingLists />
    );
};