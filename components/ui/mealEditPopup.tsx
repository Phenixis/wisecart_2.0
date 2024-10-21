'use client';

import { ArrowLeft, Loader2, Pen, Plus, Trash} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useState, useActionState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { ActionState } from '@/lib/auth/middleware';
import { updateMeal, deleteMeal, updateIngredient, updateIngredientOfMeal, fetchAllIngredients, createIngredient, addIngredientToMeal, removeIngredientFromMeal } from '@/app/dashboard/actions';
import { User } from '@/lib/db/schema';

export default function MealEditPopup({ user, meal, ingredients }: { user: User, meal: any, ingredients: any }) {
    const handleUpdateMeal = async (state: ActionState, formData: FormData) => {
        // UPDATING MEAL - DONE
        const updatedMeal : FormData = new FormData();
        updatedMeal.append('id', meal.id);
        updatedMeal.append('name', formData.get('name') as string);
        updatedMeal.append('description', formData.get('description') as string);
        updatedMeal.append('nbPersons', formData.get('nbPersons') as string);

        if (JSON.stringify(currentMealValues) !== JSON.stringify(initialMealValues)) {
            await updateMeal(state, updatedMeal);
        }

        // DELETING INGREDIENTS - DONE
        if (deletedIngredients.length > 0) {
            for (const mealsIngredientsId of deletedIngredients) {
                const deletedIngredientsFD : FormData = new FormData();
                deletedIngredientsFD.append('mealsIngredientsId', "" + mealsIngredientsId);

                await removeIngredientFromMeal(state, deletedIngredientsFD);
            }
            setDeletedIngredients([]);
        }

        // UPDATING INGREDIENTS - DONE
        for (const ingredient of currentIngredients) {
            const updatedIngredient : FormData = new FormData();
            updatedIngredient.append('id', ingredient.id);
            updatedIngredient.append('name', ingredient.name);
            updatedIngredient.append('quantity', ingredient.quantity);
            updatedIngredient.append('unit', ingredient.unit);

            // TODO : check if ingredient has changed using JSON.stringify
            if (JSON.stringify(ingredient) !== JSON.stringify(initialIngredients.find((i: { id: any; }) => i.id === ingredient.id))) {
                await updateIngredient(state, updatedIngredient);
            }
        }

        // ADDING NEW INGREDIENTS - DONE
        for (const ingredient of newIngredients) {
            const newIngredient : FormData = new FormData();
            newIngredient.append('name', ingredient.name);

            await createIngredient(state, newIngredient);

            const ingredientId = await fetchAllIngredients(user, ingredient.name);
            const ingredientIdValue = ingredientId[0].id;

            const newIngredientToMeal : FormData = new FormData();
            newIngredientToMeal.append('mealId', meal.id);
            newIngredientToMeal.append('ingredientId', "" + ingredientIdValue);
            newIngredientToMeal.append('quantity_per_person', ingredient.quantity);
            newIngredientToMeal.append('unit', ingredient.unit);

            await addIngredientToMeal(state, newIngredientToMeal);
        }
        setNewIngredients([]);

        setIsOpen(false);
    };
    
    const initialMealValues = {
        name: meal.name,
        description: meal.description,
        nbPersons: "" + meal.nbPersons,
    };

    const initialIngredients = ingredients.map((ingredient: any) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: "" + ingredient.quantity / ingredient.nbPersons,
        unit: ingredient.unit,
    }));

    const verifyChanges = () => {
        const hasChanged = JSON.stringify(currentMealValues) !== JSON.stringify(initialMealValues) ||
            JSON.stringify(currentIngredients) !== JSON.stringify(initialIngredients) ||
            JSON.stringify(newIngredients) !== JSON.stringify([]) ||
            JSON.stringify(deletedIngredients) !== JSON.stringify([]);

        setHasChanged(hasChanged);
    };

    const handleInputChange = (field: string, value: any) => {
        setCurrentMealValues((prevValues) => {
            const newValues = { ...prevValues, [field]: "" + value };
            const hasChanged = JSON.stringify(newValues) !== JSON.stringify(initialMealValues);
            setHasChanged(hasChanged);
            return newValues;
        });
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        setCurrentIngredients((prevValues: any) => {
            const newValues = [...prevValues];
            newValues[index] = { ...newValues[index], [field]: value };
            const hasChanged = JSON.stringify(newValues) !== JSON.stringify(initialIngredients);
            setHasChanged(hasChanged);
            return newValues;
        });
    };

    const handleNewIngredientChange = (field: string, value: any) => {
        setNewIngredient((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const addNewIngredient = async () => {
        if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
            setNewIngredients((prevValues) => [
                ...prevValues,
                {
                    id: newIngredients.length,
                    name: newIngredient.name,
                    quantity: newIngredient.quantity,
                    unit: newIngredient.unit,
                },
            ]);

            setNewIngredient({ name: '', quantity: '', unit: '' });
            setSearchQuery('');
        }
    };

    const validateInput = (value: any) => {
        return value !== '';
    };
    
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [suggestedIngredients, setSuggestedIngredients] = useState<{ name: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [currentMealValues, setCurrentMealValues] = useState(initialMealValues);
    const [currentIngredients, setCurrentIngredients] = useState(initialIngredients);
    const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '' });
    const [newIngredients, setNewIngredients] = useState<{ id: number, name: string, quantity: string, unit: string}[]>([]);
    const [deletedIngredients, setDeletedIngredients] = useState<number[]>([]);
    
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        handleUpdateMeal,
        { error: '' }
    );
    const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(
        deleteMeal,
        { error: '' }
    );
    
    useEffect(() => {
        if (debouncedQuery) {
            fetchAllIngredients(user, debouncedQuery).then((data) => {
                setSuggestedIngredients(data);
            });
        } else {
            setSuggestedIngredients([]);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        if (state?.success || deleteState?.success) {
            setIsOpen(false);
        }
    }, [state, deleteState]);

    useEffect(() => {
        verifyChanges();
    }, [currentMealValues, currentIngredients, newIngredients, deletedIngredients]);


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
                                <input className='hidden' id="id" name="id" type="number" value={meal.id} />
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
                                                <td className='hidden'>
                                                    <input
                                                        id={`id_${ingredient.id}`}
                                                        name={`id_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary hidden"
                                                        defaultValue={ingredient.id}
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <input
                                                        id={`name_${ingredient.id}`}
                                                        name={`name_${ingredient.id}`}
                                                        type="text"
                                                        className={`bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary ${deletedIngredients.includes(ingredient.mealsIngredientsId) ? 'line-through text-gray-400' : ''}`}
                                                        placeholder={ingredient.name}
                                                        defaultValue={ingredient.name}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'name', value);
                                                            }
                                                        }}
                                                        readOnly={
                                                            (deletedIngredients.includes(ingredient.id)) ? (
                                                                true
                                                            ) : (
                                                                false
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    <input
                                                        id={`quantity_${ingredient.id}`}
                                                        name={`quantity_${ingredient.id}`}
                                                        type="text"
                                                        className={`bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary ${deletedIngredients.includes(ingredient.mealsIngredientsId) ? 'line-through text-gray-400' : ''}`}
                                                        pattern="\d+"
                                                        title='Only numbers are allowed'
                                                        placeholder={`${Number(ingredient.quantity) / Number(ingredient.nbPersons)}`}
                                                        defaultValue={`${Number(ingredient.quantity) / Number(ingredient.nbPersons)}`}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'quantity', value);
                                                            }
                                                        }}
                                                        readOnly={
                                                            (deletedIngredients.includes(ingredient.mealsIngredientsId)) ? (
                                                                true
                                                            ) : (
                                                                false
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    <input
                                                        id={`unit_${ingredient.id}`}
                                                        name={`unit_${ingredient.id}`}
                                                        type="text"
                                                        className={`bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary ${deletedIngredients.includes(ingredient.mealsIngredientsId) ? 'line-through text-gray-400' : ''}`}
                                                        placeholder={ingredient.unit}
                                                        defaultValue={ingredient.unit}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'unit', value);
                                                            }
                                                        }}
                                                        readOnly={
                                                            (deletedIngredients.includes(ingredient.mealsIngredientsId)) ? (
                                                                true
                                                            ) : (
                                                                false
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Button
                                                        type="button"
                                                        className={`rounded-xl ${deletedIngredients.includes(ingredient.mealsIngredientsId) ? "text-green-500" : "text-red-500"} font-semibold bg-transparent border border-transparent p-2 hover:bg-transparent ${deletedIngredients.includes(ingredient.mealsIngredientsId) ? "hover:border-green-500 hover:text-green-500" : "hover:border-red-500 hover:text-red-500"} group`}
                                                        onClick={(e) => {
                                                            if (deletedIngredients.includes(ingredient.mealsIngredientsId)) {
                                                                setDeletedIngredients((prevValues) => prevValues.filter((id) => id !== ingredient.mealsIngredientsId));
                                                            } else {
                                                                setDeletedIngredients((prevValues) => [...prevValues, ingredient.mealsIngredientsId]); 
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            deletedIngredients.includes(ingredient.mealsIngredientsId) ? (
                                                                <Plus size={16}/>
                                                            ) : (
                                                                <Trash size={16}/>
                                                            )
                                                        }
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {newIngredients.map((ingredient: any, index: number) => (
                                            <tr key={`new_${ingredient.id}`}>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-green-500">
                                                    <input
                                                        id={`new_name_${ingredient.id}`}
                                                        name={`new_name_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
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
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-green-500">
                                                    <input
                                                        id={`new_quantity_${ingredient.id}`}
                                                        name={`new_quantity_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary focus:text-gray-900"
                                                        pattern="\d+"
                                                        title='Only numbers are allowed'
                                                        placeholder={`${Number(ingredient.quantity)}`}
                                                        defaultValue={`${Number(ingredient.quantity)}`}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (validateInput(value)) {
                                                                handleIngredientChange(index, 'quantity', value);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-green-500">
                                                    <input
                                                        id={`new_unit_${ingredient.id}`}
                                                        name={`new_unit_${ingredient.id}`}
                                                        type="text"
                                                        className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
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
                                                <td>
                                                    <Button
                                                        type="button"
                                                        className="rounded-xl text-red-500 font-semibold bg-transparent border border-transparent p-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 group"
                                                        onClick={(e) => {
                                                            setNewIngredients((prevValues) => prevValues.filter((_, i) => i !== index));
                                                        }}
                                                    >
                                                        <Trash size={16}/>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <input
                                                    id="new_ingredient_name"
                                                    name="new_ingredient_name"
                                                    type="text"
                                                    className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow-md hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
                                                    placeholder="New Ingredient Name"
                                                    value={newIngredient.name}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSearchQuery(value);
                                                        if (validateInput(value)) {
                                                            handleNewIngredientChange('name', value);
                                                        }
                                                    }}
                                                    list="ingredient-suggestions"
                                                />
                                                <datalist id="ingredient-suggestions">
                                                    {suggestedIngredients.map((ingredient: any) => (
                                                        <option key={ingredient.id} value={ingredient.name} />
                                                    ))}
                                                </datalist>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <input
                                                    id="new_ingredient_quantity"
                                                    name="new_ingredient_quantity"
                                                    type="text"
                                                    className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
                                                    pattern="\d+"
                                                    title='Only numbers are allowed'
                                                    placeholder="Quantity per person"
                                                    value={newIngredient.quantity}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (validateInput(value)) {
                                                            handleNewIngredientChange('quantity', value);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <input
                                                    id="new_ingredient_unit"
                                                    name="new_ingredient_unit"
                                                    type="text"
                                                    className="bg-transparent border-none cursor-pointer w-full max-w-fit shadow-none p-2 rounded-xl placeholder:italic placeholder:text-gray-300 focus:shadow hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-primary focus:border-primary"
                                                    placeholder="Unit"
                                                    value={newIngredient.unit}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (validateInput(value)) {
                                                            handleNewIngredientChange('unit', value);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    type="button"
                                                    className="rounded-xl text-primary font-semibold bg-transparent border border-transparent p-2 hover:bg-transparent hover:border-primary hover:text-primary"
                                                    onClick={addNewIngredient}
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </td>
                                        </tr>
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