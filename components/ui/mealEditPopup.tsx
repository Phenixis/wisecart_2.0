'use client';

import { ArrowLeft, Loader2, Pen, Plus, Trash, X } from 'lucide-react';
import { useState, useActionState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { ActionState } from '@/lib/auth/middleware';
import { updateMeal, deleteMeal } from '@/app/dashboard/actions';

export default function MealEditPopup({ meal }: { meal: any }) {
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

    useEffect(() => {
        if (state?.success || deleteState?.success) {
            setIsOpen(false);
        }
    }, [state, deleteState]);

    return (
        <>
            <button onClick={() => setIsOpen(true)}>
                <Pen size={16} className="text-primary" />
            </button>
            {isOpen ? (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    <div className='bg-white rounded-xl p-4 sm:w-96 w-full space-y-4 h-fit'>
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
                                    placeholder="Pizza"
                                    defaultValue={meal.name}
                                    onChange={(e) => {
                                            if (e.target.value !== meal.name && e.target.value !== '') { 
                                                setHasChanged(true);
                                            } else {
                                                setHasChanged(false);
                                            }
                                        }
                                    }
                                />
                                <label className="block text-sm font-semibold">Description</label>
                                <Input
                                    id="description"
                                    name="description"
                                    type="text"
                                    className="appearance-none rounded-xl relative block w-full px-3 py-2 border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="A fresh Hawaiian pizza"
                                    defaultValue={meal.description}
                                    onChange={(e) => {
                                            if (e.target.value !== meal.description) { 
                                                setHasChanged(true);
                                            } else {
                                                setHasChanged(false);
                                            }
                                        }
                                    }
                                />
                                <label className="block text-sm font-semibold">For</label>
                                <Input
                                    id="nbPersons"
                                    name="nbPersons"
                                    type="number"
                                    className="appearance-none rounded-xl relative block w-full px-3 py-2  border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="4"
                                    defaultValue={meal.nbPersons}
                                    onChange={(e) => {
                                            if (e.target.value !== meal.nbPersons && Number.parseInt(e.target.value) !== 0) { 
                                                setHasChanged(true);
                                            } else {
                                                setHasChanged(false);
                                            }
                                        }
                                    }
                                />
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