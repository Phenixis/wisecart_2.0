'use server';

import { Suspense } from "react";
import ShoppingListsSkeleton from "./skeletons/shoppingListsSkeleton";
import { getLastShoppingList } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import ShoppingList from "./ui/shoppingList";

export default async function ShoppingLists() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const shoppingList = await getLastShoppingList(user);

    return (
        <Suspense fallback={<ShoppingListsSkeleton />}>
            <div className="p-4 spacing-y-4 bg-base-200 rounded-xl border-neutral border-2 w-fit">
                {shoppingList.map((list) => (
                    <ShoppingList key={list.id} user={user} shoppingList={list} />
                ))}
            </div>
        </Suspense>
    )
}