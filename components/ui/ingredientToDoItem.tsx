'use client';

import { useState } from "react";

export default function Ingredient({ingredient} : {ingredient: any}) {
    if (!ingredient.name) {
        throw new Error('Ingredient name is required');
    } else if (!ingredient.quantity) {
        throw new Error('Ingredient quantity is required');
    } else if (!ingredient.unit) {
        throw new Error('Ingredient unit is required');
    }

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