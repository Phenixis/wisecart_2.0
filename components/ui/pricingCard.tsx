import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { Suspense } from "react";
import PricingCardSkeleton from "./../skeletons/pricingCardSkeleton";

export default function PricingCard({
    name,
    price,
    interval,
    trialDays,
    features,
    priceId,
    disabled,
  }: {
    name: string;
    price: number;
    interval?: string;
    trialDays?: number;
    features: string[];
    priceId?: string;
    disabled?: boolean;
  }) {
    return (
        <Suspense fallback={<PricingCardSkeleton />}>
            <div className="pt-6 flex flex-col justify-between">
                <div>
                    <h2 className={`text-2xl font-medium ${disabled ? "text-gray-500" : "text-gray-900"} mb-2`}>{name}</h2>
                    {trialDays !== undefined ?
                    <p className={`text-sm ${disabled ? "text-gray-500" : "text-gray-600"} mb-4`}>
                        with {trialDays} days free trial
                    </p>
                    :
                    <></>
                    }
                    <p className={`font-medium mb-6 ${disabled ? "text-gray-500" : "text-primary"}`}>
                        {interval?.includes('year') ? 
                        <span className='leading-none'>
                            <span className="text-4xl">
                                ${Math.round(price / 12) / 100}
                            </span>
                            <span className={`text-xl font-normal ${disabled ? "text-gray-500" : "text-gray-600"}`}>
                                / month
                            </span>
                            <br/>
                            <span className={`text-base ${disabled ? "text-gray-500" : "text-gray-600"}`}>
                                Billed <span className={`${disabled ? "text-gray-500" : "text-primary"}`}>
                                    ${price / 100}{' '}
                                    </span>
                                / {interval}
                            </span>
                        </span>
                        : 
                        <span>
                            <span className="text-4xl">
                                ${price / 100}{' '}
                            </span>
                            <span className={`text-xl font-normal ${disabled ? "text-gray-500" : "text-gray-600"}`}>
                                / {interval !== undefined ? interval : 'lifetime'}
                            </span>
                        </span>
                        }
                        
                    </p>
                </div>
                <div>
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
            </div>
        </Suspense>
    );
  }
  