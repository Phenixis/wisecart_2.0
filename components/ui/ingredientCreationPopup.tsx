'use client';

import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { useState, useActionState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { ActionState } from '@/lib/auth/middleware';
import { createIngredient } from '@/app/dashboard/actions';

export default function CreationPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        createIngredient,
        { error: '' }
    );
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <>
            <Button className="rounded-xl text-white font-semibold" onClick={() => setIsOpen(true)}>
                <Plus size={16} className="mr-2" />
                New Ingredient
            </Button>
            {isOpen ? (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" 
                onClick={() => setIsOpen(false)}
            >
                <div className='bg-white rounded-xl p-4 w-96 space-y-4'>
                    <div className='flex items-center space-x-1'>
                        <ArrowLeft className="cursor-pointer" onClick={() => setIsOpen(false)} />
                        <h2 className="text-2xl font-semibold">Edit the Ingredient</h2>
                    </div>
                    <form 
                        className="space-y-2" 
                        onClick={(e) => e.stopPropagation()}
                        action={formAction}
                    >
                        <div>
                            <label className="block text-sm font-semibold">Name</label>
                            <Input 
                                id="name"
                                name="name"
                                type="text"
                                className="appearance-none rounded-xl relative block w-full px-3 py-2  border-neutral placeholder:italic placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Pineapple"
                                required
                                onChange={(e) => {
                                    if (e.target.value !== '') {
                                        setHasChanged(true);
                                    } else {
                                        setHasChanged(false);
                                    }
                                }}
                            />
                        </div>
                        {state?.error && (
                            <div className="text-red-500 text-sm">{state.error}</div>
                        )}
                        <Button 
                            type="submit"
                            className="rounded-xl text-white font-semibold"
                            disabled={pending || !hasChanged}
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} className="mr-2" />
                                    New Ingredient
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