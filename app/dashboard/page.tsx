import Dashboard from "@/components/dashboard";
import { Metadata } from 'next';
import verifyUser from "@/components/utils/verifyUser";

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
    await verifyUser();
    
    return (
        <Dashboard />
    );
};