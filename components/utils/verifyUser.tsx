import { getUser, getTeamPaymentStatus } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function verifyUser() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    } else {
        const teamPaymentStatus = await getTeamPaymentStatus(user.id);
        if (teamPaymentStatus !== 'active' && teamPaymentStatus !== 'trialing' && teamPaymentStatus !== 'completed') {
            redirect('/pricing');
        }
    }
}