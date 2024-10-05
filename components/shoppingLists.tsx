'use server';

import { Suspense } from "react";
import ShoppingListsSkeleton from "./skeletons/shoppingListsSkeleton";
import { getShoppingLists } from "@/app/dashboard/actions";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import ShoppingList from "./ui/shoppingList";

export default async function ShoppingLists() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    const shoppingList = await getShoppingLists(user);

    return (
        <Suspense fallback={<ShoppingListsSkeleton />}>
            {shoppingList.map((list) => (
                <ShoppingList key={list.id} user={user} shoppingList={list} />
            ))}
        </Suspense>
    )
}