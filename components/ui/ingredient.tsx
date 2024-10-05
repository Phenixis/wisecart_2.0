'use client';

import { useState } from "react";
import IngredientSkeleton from "../skeletons/ingredientSkeleton";

export default function Ingredient({ingredient} : {ingredient: any}) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheck = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div  
            onClick={handleCheck} 
            className={`flex items-center space-x-1 text-sm ${isChecked ? 'line-through' : ''}`}>
            <button
                className={`p-2 my-1 size-1 border border-neutral rounded-full ${isChecked ? 'bg-primary hover:bg-transparent' : 'hover:bg-primary'} `}
                >
            </button>
            <p className="leading-none">
                {ingredient.name} : {ingredient.quantity} {ingredient.unit}
            </p>
        </div>
    )
}