import ShoppingLists from "@/components/shoppingLists";
import { Metadata } from 'next';
import verifyUser from "@/components/utils/verifyUser";

export const metadata: Metadata = {
  title: 'Shopping Lists',
};

export default async function DashboardPage() {
    await verifyUser();
    
    return (
        <ShoppingLists />
    );
};