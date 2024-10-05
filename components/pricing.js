import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import PricingCard from "./ui/pricingCard";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function Pricing() {

    const [prices, products] = await Promise.all([
      getStripePrices(),
      getStripeProducts(),
    ]);
  
    const earlyAccessPlan = products.find((product) => product.name === 'Early Access');
  
    const monthlyPrice = prices.find((price) => (price.productId === earlyAccessPlan?.id && price.nickname === "Early Access Monthly"));
    const yearlyPrice = prices.find((price) => (price.productId === earlyAccessPlan?.id && price.nickname === "Early Access Yearly"));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
                <PricingCard
                name={monthlyPrice?.nickname || 'Base'}
                price={monthlyPrice?.unitAmount || 800}
                interval={monthlyPrice?.interval || 'month'}
                trialDays={monthlyPrice?.trialPeriodDays || 7}
                features={[
                    'Unlimited Usage',
                    'Unlimited Workspace Members',
                    'Email Support',
                ]}
                priceId={monthlyPrice?.id}
                />
                <PricingCard
                name={yearlyPrice?.nickname || 'Plus'}
                price={yearlyPrice?.unitAmount || 1200}
                interval={yearlyPrice?.interval || 'month'}
                trialDays={yearlyPrice?.trialPeriodDays || 7}
                features={[
                    'Everything in Base, and:',
                    'Early Access to New Features',
                    '24/7 Support + Slack Access',
                ]}
                priceId={yearlyPrice?.id}
                />
            </div>
        </div>
    );
}