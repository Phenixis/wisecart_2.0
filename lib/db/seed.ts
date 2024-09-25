import { stripe } from '../payments/stripe';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const earlyAccessProduct = await stripe.products.create({
    name: 'Early Access',
    description: 'Early Access plan',
  });

  await stripe.prices.create({
    product: earlyAccessProduct.id,
    nickname: 'Early Access Monthly',
    unit_amount: 400, // $4 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 31,
    },
  });

  await stripe.prices.create({
    product: earlyAccessProduct.id,
    nickname: 'Early Access Yearly',
    unit_amount: 4000, // $40 in cents
    currency: 'usd',
    recurring: {
      interval: 'year',
      trial_period_days: 31,
    },
  });

  await stripe.prices.create({
    product: earlyAccessProduct.id,
    nickname: 'Early Access Lifetime',
    unit_amount: 10000, // $100 in cents
    currency: 'usd',
  });

  const fullPriceProduct = await stripe.products.create({
    name: 'Full Price',
    description: 'Full Price plan',
  });

  await stripe.prices.create({
    product: fullPriceProduct.id,
    nickname: 'Full Price Monthly',
    unit_amount: 900, // $9 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 31,
    },
  });

  await stripe.prices.create({
    product: fullPriceProduct.id,
    nickname: 'Full Price Yearly',
    unit_amount: 9000, // $90 in cents
    currency: 'usd',
    recurring: {
      interval: 'year',
      trial_period_days: 31,
    },
  });

  await stripe.prices.create({
    product: fullPriceProduct.id,
    nickname: 'Full Price Lifetime',
    unit_amount: 15000, // $150 in cents
    currency: 'usd',
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
