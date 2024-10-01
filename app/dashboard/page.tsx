import { redirect } from "next/navigation";
import { getUser, getTeamSubscriptionStatus } from "@/lib/db/queries";
import Dashboard from "@/components/dashboard";
import Redirection from "@/components/redirection";

export default async function DashboardPage() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }
    const subscriptionStatus = await getTeamSubscriptionStatus(user.id);

    return (
        (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') ? <Dashboard /> :  Redirection({destination: '/pricing', message: "You need to subscribe to access the dashboard. You'll be redirected in a few seconds."})
    );
};