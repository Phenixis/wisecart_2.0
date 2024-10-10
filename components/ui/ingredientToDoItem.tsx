'use client';

import { toggleIngredient } from "@/app/dashboard/actions";
import { ActionState } from '@/lib/auth/middleware';
import { useActionState } from "react";
import { isSet } from "util/types";

export default function Ingredient({ingredient, mealId, shoppingListId, isIngredientToggled} : {ingredient: any, mealId: number, shoppingListId: number, isIngredientToggled: boolean}) {
    if (!ingredient.id) {
        throw new Error('Ingredient ID is required');
    } else if (!ingredient.name) {
        throw new Error('Ingredient name is required');
    } else if (!ingredient.quantity) {
        throw new Error('Ingredient quantity is required');
    } else if (!ingredient.unit) {
        throw new Error('Ingredient unit is required');
    }
    const [state, formAction, pending] = useActionState<ActionState, FormData>(toggleIngredient, { error: '' });
    const ingredientCompletion = (
        state.isToggled != undefined ? (
            pending ? !state.isToggled : state.isToggled 
        ) : isIngredientToggled
    );
    console.log(state.isToggled);

    return (
        <div
            className={`flex items-center space-x-1 text-sm ${ingredientCompletion ? 'line-through' : ''}`}>
            <form action={formAction}>
                <input className='hidden' name="idIngredient" type="number" value={ingredient.id} readOnly/>
                <input className='hidden' name="idMeal" type="number" value={mealId} readOnly/>
                <input className='hidden' name="idShoppingList" type="number" value={shoppingListId} readOnly/>
                <button
                    type="submit"
                    className={`p-2 my-1 size-1 border border-neutral rounded-full ${ingredientCompletion ? 'bg-primary hover:bg-transparent' : 'hover:bg-primary'} `}
                />
            </form>
            <p className="leading-none">
                {ingredient.name} : {ingredient.quantity} {ingredient.unit}
            </p>
        </div>
    )
}