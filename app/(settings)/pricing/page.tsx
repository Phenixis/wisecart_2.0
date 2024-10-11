import PricingCard from '@/components/ui/pricingCard';
import { getUser, getTeamPaymentStatus } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Pricing from '@/components/pricing';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const user = await getUser();
  if (!user) {} else {
    const teamPaymentStatus = await getTeamPaymentStatus(user.id);
    if (teamPaymentStatus === 'active' || teamPaymentStatus === 'trialing') {
      redirect('/dashboard');
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Pricing />
    </main>
  );
}

