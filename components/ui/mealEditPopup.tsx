'use client';

import { ArrowLeft, Loader2, Pen, Plus, Trash, X } from 'lucide-react';
import { useState, useActionState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { ActionState } from '@/lib/auth/middleware';
import { updateMeal, deleteMeal, updateIngredient } from '@/app/dashboard/actions';

export default function MealEditPopup({ meal, ingredients }: { meal: any, ingredients: any }) {

    const handleUpdateMeal = async (state: ActionState, formData: FormData) => {
        const updatedMeal = {
            name: formData.get('name'),
            description: formData.get('description'),
            nbPersons: formData.get('nbPersons'),
        };

        const mealChanged = updatedMeal.name !== initialValues.name ||
            updatedMeal.description !== initialValues.description ||
            updatedMeal.nbPersons !== initialValues.nbPersons;

        console.log("meal changed ? : " + mealChanged);
        if (mealChanged) {
            return await updateMeal(state, formData);
        }

        const updatedIngredients = ingredients.map((ingredient: any, index: number) => ({
            name: formData.get(`name_${ingredient.id}`),
            quantity: formData.get(`quantity_${ingredient.id}`),
            unit: formData.get(`unit_${ingredient.id}`),
        }));

        for (let i = 0; i < updatedIngredients.length; i++) {
            const ingredientChanged = updatedIngredients[i].name !== initialValues.ingredients[i].name ||
                updatedIngredients[i].quantity !== initialValues.ingredients[i].quantity ||
                updatedIngredients[i].unit !== initialValues.ingredients[i].unit;
            
            console.log("ingredient " + updatedIngredients[i].id + " changed ? : " + mealChanged);
            if (ingredientChanged) {
                const ingredientFormData = new FormData();
                ingredientFormData.append('id', ingredients[i].id);
                ingredientFormData.append('name', updatedIngredients[i].name);
                ingredientFormData.append('quantity', updatedIngredients[i].quantity);
                ingredientFormData.append('unit', updatedIngredients[i].unit);
                return await updateIngredient(state, ingredientFormData);
            }
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        handleUpdateMeal,
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
        nbPersons: "" + meal.nbPersons,
        ingredients: ingredients.map((ingredient: any) => ({
            id: ingredient.id,
            name: ingredient.name,
            quantity: "" + ingredient.quantity / ingredient.nbPersons,
            unit: "" + ingredient.unit,
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
            const newValues = { ...prevValues, [field]: "" + value };
            const hasChanged = JSON.stringify(newValues) !== JSON.stringify(initialValues);
            setHasChanged(hasChanged);
            return newValues;
        });
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        setCurrentValues((prevValues) => {
            const newIngredients = [...prevValues.ingredients];
            newIngredients[index] = { ...newIngredients[index], [field]: "" + value };
            const newValues = { ...prevValues, ingredients: newIngredients };
            // PROBLEME ICI : Les nouvelles valeurs ne contiennent pas l'identifiant de l'ingrédient
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
                    <div className='bg-white rounded-xl p-4 w-full sm:w-fit space-y-4 h-fit' onClick={(e) => e.stopPropagation()}>
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
                            className='space-y-2 w-full max-w-fit'
                            onClick={(e) => e.stopPropagation()}
                            action={formAction}
                        >
                            <div className='w-full max-w-fit'>
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
                                    type="text"
                                    className="appearance-none rounded-xl relative block w-full px-3 py-2  border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    pattern="\d+"
                                    title='Only numbers are allowed'
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
                                                <input
                                                    id={`id_${ingredient.id}`}
                                                    name={`id_${ingredient.id}`}
                                                    type="text"
                                                    className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary hidden"
                                                    defaultValue={ingredient.id}
                                                />
                                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <input
                                                        id={`name_${ingredient.id}`}
                                                        name={`name_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
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
                                                    <input
                                                        id={`quantity_${ingredient.id}`}
                                                        name={`quantity_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl focus:shadow hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
                                                        pattern="\d+"
                                                        title='Only numbers are allowed'
                                                        placeholder={"" + (ingredient.quantity / ingredient.nbPersons)}
                                                        defaultValue={`${ingredient.quantity / ingredient.nbPersons}`}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'quantity', value);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    <input
                                                        id={`unit_${ingredient.id}`}
                                                        name={`unit_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl focus:shadow hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
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