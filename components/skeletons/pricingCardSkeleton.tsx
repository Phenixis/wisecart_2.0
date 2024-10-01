import SubmitButtonSkeleton from "./submitButtonSkeleton";

export default function PricingCardSkeleton() {
    return (
        <div className="pt-6 animate-pulse">
            <h2 className="text-2xl font-medium text-gray-200 mb-2 bg-gray-200 rounded-xl">Name</h2>
            <p className="text-sm text-gray-200 mb-4 bg-gray-200 rounded-xl">
                with trialDays day free trial
            </p>
            <p className="text-4xl font-medium text-gray-200 mb-6 bg-gray-200 rounded-xl">
                $100{' '}
                <span className="text-xl font-normal text-gray-200 bg-gray-200 rounded-xl">
                    per user / interval
                </span>
            </p>
            <ul className="space-y-4 mb-8 text-gray-200">
                <li className="flex items-start bg-gray-200 rounded-xl">
                    features
                </li>
                <li className="flex items-start bg-gray-200 rounded-xl">
                    features
                </li>
                <li className="flex items-start bg-gray-200 rounded-xl">
                    features
                </li>
            </ul>
            <input type="hidden" name="priceId" />
            <SubmitButtonSkeleton />
        </div>
    );
}