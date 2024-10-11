'use client';

import { toggleIngredient } from "@/app/dashboard/actions";
import { ActionState } from '@/lib/auth/middleware';
import { useActionState } from "react";

export default function Ingredient({ingredient, mealId, shoppingListId, isIngredientToggled, mealOrder} : {ingredient: any, mealId: number, shoppingListId: number, isIngredientToggled: boolean, mealOrder: number}) {
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
        state.isToggled !== undefined ? (
            pending ? !state.isToggled : state.isToggled 
        ) : isIngredientToggled
    );

    return (
        <form
            className={`flex items-center space-x-1 text-sm ${ingredientCompletion ? 'line-through' : ''}`}
            action={formAction}
        >
            <input className='hidden' name="idIngredient" type="number" value={ingredient.id} readOnly/>
            <input className='hidden' name="idMeal" type="number" value={mealId} readOnly/>
            <input className='hidden' name="idShoppingList" type="number" value={shoppingListId} readOnly/>
            <input className='hidden' name="mealOrder" type="number" value={mealOrder} readOnly/>
            <button
                type="submit"
                id={`submitBtn${ingredient.id}${mealId}${shoppingListId}${mealOrder}`}
                name={`submitBtn${ingredient.id}${mealId}${shoppingListId}${mealOrder}`}
                className={`p-2 my-1 size-1 border border-neutral rounded-full ${ingredientCompletion ? 'bg-primary lg:hover:bg-transparent' : 'lg:hover:bg-primary'} `}
            />
            <label
                htmlFor={`submitBtn${ingredient.id}${mealId}${shoppingListId}${mealOrder}`}
                className="leading-none"
            >
                {ingredient.name} : {ingredient.quantity} {ingredient.unit}
            </label>
        </form>
    )
}