import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import Dashboard from "@/components/dashboard";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <Dashboard />
    );
};