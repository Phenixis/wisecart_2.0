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
    const lifetimePrice = prices.find((price) => (price.productId === earlyAccessPlan?.id && price.nickname === "Early Access Lifetime"));

    return (
        <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Individual"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-xl mx-auto">
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
                <PricingCard
                name={lifetimePrice?.nickname || 'Plus'}
                price={lifetimePrice?.unitAmount || 1200}
                interval={lifetimePrice?.interval}
                trialDays={lifetimePrice?.trialPeriodDays}
                features={[
                    'Every features, forever',
                    'No recurring payments',
                    'Access to exclusive community with priority support',
                ]}
                priceId={lifetimePrice?.id}
                />
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Family"/>
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className='w-full text-center text-xl text-primary'>
                Coming soon...
            </h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-xl mx-auto">
                <PricingCard
                name={"Family Monthly"}
                price={500}
                interval={'month per user'}
                trialDays={31}
                features={[
                    'Unlimited Ingredients, Meals and Shopping Lists',
                    'Up to 5 users',
                ]}
                disabled={true}
                />
                <PricingCard
                name={"Family Yearly"}
                price={4800}
                interval={'year per user'}
                trialDays={31}
                features={[
                    'All Monthly features',
                    '2 months free',
                ]}
                disabled={true}
                />
                <PricingCard
                name={"Family Lifetime"}
                price={10800}
                interval={'lifetime per user'}
                features={[
                  'Every features, forever',
                  'No recurring payments',
                ]}
                disabled={true}
                />
            </div>
        </div>
      </div>
    );
}