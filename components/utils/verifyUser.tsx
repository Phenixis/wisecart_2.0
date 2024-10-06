import { getUser, getTeamSubscriptionStatus } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function verifyUser() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    } else {
        const teamSubscriptionStatus = await getTeamSubscriptionStatus(user.id);
        if (teamSubscriptionStatus !== 'active' && teamSubscriptionStatus !== 'trialing') {
            redirect('/pricing');
        }
    }
}