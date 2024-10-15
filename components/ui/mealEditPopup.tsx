'use client';

import { ArrowLeft, Loader2, Pen, Plus, Trash, X } from 'lucide-react';
import { useState, useActionState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { ActionState } from '@/lib/auth/middleware';
import { updateMeal, deleteMeal } from '@/app/dashboard/actions';

export default function MealEditPopup({ meal, ingredients }: { meal: any, ingredients: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        updateMeal,
        { error: '' }
    );
    const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(
        deleteMeal,
        { error: '' }
    );
    const [hasChanged, setHasChanged] = useState(false);

    const initialValues = {
        name: meal.name,
        description: meal.description,
        nbPersons: meal.nbPersons,
        ingredients: ingredients.map((ingredient: any) => ({
            quantity: ingredient.quantity / ingredient.nbPersons,
            unit: ingredient.unit,
        })),
    };

    const [currentValues, setCurrentValues] = useState(initialValues);

    useEffect(() => {
        if (state?.success || deleteState?.success) {
            setIsOpen(false);
        }
    }, [state, deleteState]);

    const handleInputChange = (field: string, value: any) => {
        setCurrentValues((prevValues) => {
            const newValues = { ...prevValues, [field]: value };
            const hasChanged = JSON.stringify(newValues) !== JSON.stringify(initialValues);
            setHasChanged(hasChanged);
            return newValues;
        });
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        setCurrentValues((prevValues) => {
            const newIngredients = [...prevValues.ingredients];
            newIngredients[index] = { ...newIngredients[index], [field]: value };
            const newValues = { ...prevValues, ingredients: newIngredients };
            const hasChanged = JSON.stringify(newValues) !== JSON.stringify(initialValues);
            setHasChanged(hasChanged);
            return newValues;
        });
    };

    const validateInput = (value: any) => {
        return value !== '';
    };

    return (
        <>
            <button className="sm:hidden sm:group-hover:block" onClick={() => setIsOpen(true)}>
                <Pen size={16} className="text-primary" />
            </button>
            {isOpen ? (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    <div className='bg-white rounded-xl p-4 sm:w-96 w-full space-y-4 h-fit' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center justify-between space-x-1'>
                                <ArrowLeft className="cursor-pointer" onClick={() => setIsOpen(false)} />
                                <h2 className="text-2xl font-semibold">Edit the Meal</h2>
                            </div>
                            <form 
                                onClick={(e) => e.stopPropagation()}
                                action={deleteAction}>
                                <input className='hidden' name="id" type="number" value={meal.id} />
                                <Button
                                    type="submit"
                                    variant={'outline'}
                                    className="rounded-xl text-red-500 font-semibold border-red-500 hover:bg-red-500 hover:text-white"
                                    disabled={deletePending}
                                >
                                    {deletePending ? (
                                        <>
                                            <Loader2 className="animate-spin size-4" />
                                        </>
                                    ) : (
                                        <>
                                            <Trash className="size-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                        <form
                            className='space-y-2'
                            onClick={(e) => e.stopPropagation()}
                            action={formAction}
                        >
                            <div>
                                <input className='hidden' name="id" type="number" value={meal.id} />
                                <label className="block text-sm font-semibold">Name</label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="appearance-none rounded-xl relative block w-full px-3 py-2  border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder={meal.name}
                                    defaultValue={meal.name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (validateInput(value)) {
                                            handleInputChange('name', value);
                                        }
                                    }}
                                />
                                <label className="block text-sm font-semibold">Description</label>
                                <Input
                                    id="description"
                                    name="description"
                                    type="text"
                                    className="appearance-none rounded-xl relative block w-full px-3 py-2 border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder={meal.description}
                                    defaultValue={meal.description}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (validateInput(value)) {
                                            handleInputChange('description', value);
                                        }
                                    }}
                                />
                                <label className="block text-sm font-semibold">Number of Persons</label>
                                <Input
                                    id="nbPersons"
                                    name="nbPersons"
                                    type="number"
                                    className="appearance-none rounded-xl relative block w-full px-3 py-2  border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder={meal.nbPersons}
                                    defaultValue={meal.nbPersons}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (validateInput(value)) {
                                            handleInputChange('nbPersons', value);
                                        }
                                    }}
                                />
                                <label className="block text-sm font-semibold">Ingredients</label>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity per person</th>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {ingredients.map((ingredient: any, index: number) => (
                                            <tr key={ingredient.id}>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <Input
                                                        id={`name_${ingredient.id}`}
                                                        name={`name_${ingredient.id}`}
                                                        type="text"
                                                        className="appearance-none rounded-xl relative block w-full px-3 py-2 border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm hover:bg-gray-100 cursor-pointer focus:bg-white"
                                                        placeholder={ingredient.name}
                                                        defaultValue={ingredient.name}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'name', value);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    <Input
                                                        id={`quantity_${ingredient.id}`}
                                                        name={`quantity_${ingredient.id}`}
                                                        type="number"
                                                        className="appearance-none rounded-xl relative block w-full px-3 py-2 border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm hover:bg-gray-100 cursor-pointer focus:bg-white"
                                                        placeholder={"" + (ingredient.quantity / ingredient.nbPersons)}
                                                        defaultValue={ingredient.quantity / ingredient.nbPersons}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'quantity', value);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    <Input
                                                        id={`unit_${ingredient.id}`}
                                                        name={`unit_${ingredient.id}`}
                                                        type="text"
                                                        className="appearance-none rounded-xl relative block w-full px-3 py-2 border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm hover:bg-gray-100 cursor-pointer focus:bg-white"
                                                        placeholder={ingredient.unit}
                                                        defaultValue={ingredient.unit}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'unit', value);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {state?.error && (
                                <div className="text-red-500 text-sm">{state.error}</div>
                            )}
                            {deleteState?.error && (
                                <div className="text-red-500 text-sm">{deleteState.error}</div>
                            )}
                            <Button
                                type="submit"
                                className="rounded-xl text-white font-semibold"
                                disabled={pending || hasChanged === false}
                            >
                                {pending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} className="mr-2" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            ) : ''}
        </>
    )
}