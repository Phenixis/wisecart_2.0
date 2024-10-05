import MealSkeleton from "./mealSkeleton";

export default function ShoppingListSkeleton() {
    return (
        <div className="p-6 w-64 shadow bg-gray-100 animate-pulse h-[50vh]">
            <div className="bg-gray-200 w-full h-8"/>
            <MealSkeleton />
            <MealSkeleton />
            <MealSkeleton />
        </div>
    )
}