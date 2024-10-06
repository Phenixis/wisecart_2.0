import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { Suspense } from "react";
import PricingCardSkeleton from "./../skeletons/pricingCardSkeleton";

export default function PricingCard({
    name,
    price,
    falsePrice,
    interval,
    trialDays,
    features,
    priceId,
    disabled,
  }: {
    name: string;
    price: number;
    falsePrice?: number;
    interval: string;
    trialDays: number;
    features: string[];
    priceId?: string;
    disabled?: boolean;
  }) {
    return (
        <Suspense fallback={<PricingCardSkeleton />}>
            <div className="pt-6">
                <h2 className={`text-2xl font-medium ${disabled ? "text-gray-500" : "text-gray-900"} mb-2`}>{name}</h2>
                <p className={`text-sm ${disabled ? "text-gray-500" : "text-gray-600"} mb-4`}>
                with {trialDays} day free trial
                </p>
                <p className={`text-4xl font-medium ${disabled ? "text-gray-500" : "text-gray-900"} mb-6`}>
                    {falsePrice ?
                        <span className={`line-through ${disabled ? "text-gray-500" : "text-red-500"} text-2xl`}>
                            ${falsePrice / 100}{' '}
                        </span>
                        : ''
                    }
                    ${price / 100}{' '}
                    <span className={`text-xl font-normal ${disabled ? "text-gray-500" : "text-gray-600"}`}>
                        / {interval}
                    </span>
                </p>
                <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                    <Check className={`h-5 w-5 ${disabled ? "text-gray-500" : "text-primary"} mr-2 mt-0.5 flex-shrink-0`}/>
                    <span className={`${disabled ? "text-gray-500" : "text-gray-700"}`}>{feature}</span>
                    </li>
                ))}
                </ul>
                <form action={checkoutAction}>
                <input type="hidden" name="priceId" value={priceId} />
                <SubmitButton disabled={disabled}/>
                </form>
            </div>
        </Suspense>
    );
  }
  