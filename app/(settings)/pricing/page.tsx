import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import PricingCard from '@/components/ui/pricingCard';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {

  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const earlyAccessPlan = products.find((product) => product.name === 'Early Access');

  const monthlyPrice = prices.find((price) => (price.productId === earlyAccessPlan?.id && price.nickname === "Early Access Monthly"));
  const yearlyPrice = prices.find((price) => (price.productId === earlyAccessPlan?.id && price.nickname === "Early Access Yearly"));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <PricingCard
          name={monthlyPrice?.nickname || 'Base'}
          price={monthlyPrice?.unitAmount || 800}
          interval={monthlyPrice?.interval || 'month'}
          trialDays={monthlyPrice?.trialPeriodDays || 7}
          features={[
            'Unlimited Ingredients, Meals and Shopping Lists',
            'Early access to new features',
            'Price lock for life',
          ]}
          priceId={monthlyPrice?.id}
        />
        <PricingCard
          name={yearlyPrice?.nickname || 'Plus'}
          price={yearlyPrice?.unitAmount || 1200}
          falsePrice={(monthlyPrice?.unitAmount ?? 0) * 12 || undefined}
          interval={yearlyPrice?.interval || 'month'}
          trialDays={yearlyPrice?.trialPeriodDays || 7}
          features={[
            'All Base features',
            '2 months free',
            'Access to exclusive community with priority support',
          ]}
          priceId={yearlyPrice?.id}
        />
      </div>
    </main>
  );
}

