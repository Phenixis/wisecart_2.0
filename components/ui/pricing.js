'use client'

import { useState } from 'react';
import CTA from "@/components/ui/cta";

export default function Pricing() {
    const [activeTab, setActiveTab] = useState('monthly');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <section id="pricing" className="w-full bg-base-300 p-4 text-neutral space-y-4 rounded-xl">
            <p className="text-3xl font-bold">Pricing</p>
            <div className="w-full">
                <div className="join join-vertical w-full sm:hidden">
                    <div role="tablist" className="join-item tabs tabs-boxed font-black">
                        <button role="tab" onClick={() => handleTabClick('monthly')} className={`tab ${activeTab === 'monthly' ? 'tab-active' : ''}`}>Monthly</button>
                        <button role="tab" onClick={() => handleTabClick('annualy')} className={`tab ${activeTab === 'annualy' ? 'tab-active' : ''}`}>Annualy</button>
                        <button role="tab" onClick={() => handleTabClick('lifetime')} className={`tab ${activeTab === 'lifetime' ? 'tab-active' : ''}`}>Lifetime</button>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <p className="card-title text-2xl">
                            Free
                        </p>
                        <ul className="list-disc list-inside mt-2">
                            <li>25 saved meals</li>
                            <li>Plan for the 3 next days</li>
                        </ul>
                        <CTA className="mt-4" title="Choose The Free Tier" btnClassName="btn-outline" subtextClassName="hidden"/>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                {activeTab === 'monthly' && (
                        <div>
                            <p className="card-title text-2xl">
                                $4/month
                            </p>
                        </div>
                )}
                {activeTab === 'annualy' && ( 
                        <div>
                            <div className='flex items-center space-x-2'>
                                <p className="card-title text-lg line-through decoration-2">
                                    $48/year
                                </p>
                                <div className='badge badge-secondary font-bold'>Save 20%</div>
                            </div>
                            <p className="card-title text-2xl">
                                $40/year
                            </p>
                        </div>
                )}
                {activeTab === 'lifetime' && (
                        <div>
                            <p className="card-title text-lg line-through decoration-2 ">
                                $149/life
                            </p>
                            <p className="card-title text-2xl">
                                $69/life
                            </p>
                        </div>
                )}
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                </div>
                <div className="w-full hidden sm:join join-vertical xl:hidden">
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <p className="card-title text-2xl">
                            Free
                        </p>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>25 saved meals</li>
                                <li>Plan for the 3 next days</li>
                            </ul>
                            <CTA className="mt-4" title="Choose The Free Tier" btnClassName="btn-outline" subtextClassName="invisible"/>
                        </div>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <div>
                            <p className="card-title text-2xl">
                                $4/month
                            </p>
                        </div>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <div>
                            <div className='flex items-center space-x-2'>
                                <p className="card-title text-lg line-through decoration-2">
                                    $48/year
                                </p>
                                <div className='badge badge-secondary font-bold'>Save 20%</div>
                            </div>
                            <p className="card-title text-2xl">
                                $40/year
                            </p>
                        </div>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <div>
                            <p className="card-title text-lg line-through decoration-2 ">
                                $149/life
                            </p>
                            <p className="card-title text-2xl">
                                $69/life
                            </p>
                        </div>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                    </div>
                </div>
                <div className="w-full hidden join-horizontal xl:join">
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <p className="card-title text-2xl">
                            Free
                        </p>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>25 saved meals</li>
                                <li>Plan for the 3 next days</li>
                            </ul>
                            <CTA className="mt-4" title="Choose The Free Tier" btnClassName="btn-outline" subtextClassName="invisible"/>
                        </div>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <div>
                            <p className="card-title text-2xl">
                                $4/month
                            </p>
                        </div>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <div>
                            <div className='flex items-center space-x-2'>
                                <p className="card-title text-lg line-through decoration-2">
                                    $48/year
                                </p>
                                <div className='badge badge-secondary font-bold'>Save 20%</div>
                            </div>
                            <p className="card-title text-2xl">
                                $40/year
                            </p>
                        </div>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                    </div>
                    <div className="join-item card w-full bg-base-200 p-4 border-2 border-neutral">
                        <div>
                            <p className="card-title text-lg line-through decoration-2 ">
                                $149
                            </p>
                            <p className="card-title text-2xl">
                                $69/life
                            </p>
                        </div>
                        <div className='divider'></div>
                        <div className='h-full flex flex-col justify-between'>
                            <ul className="list-disc list-inside mt-2">
                                <li>Unlimited meals</li>
                                <li>Plan for unlimited days</li>
                                <li>1-Month free trial (before any billing)</li>
                            </ul>
                            <CTA className="mt-4" title="Get Premium For Free" iconClassName="hidden"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// {activeTab === 'annualy' && ( 
//     <div>
//         <div className='flex items-center space-x-2'>
//             <p className="card-title text-lg line-through decoration-2">
//                 Premium - $48/year
//             </p>
//             <div className='badge badge-secondary font-bold'>Save 20%</div>
//         </div>
//         <p className="card-title text-2xl">
//             Premium - $40/year
//         </p>
//     </div>
// )}
// {activeTab === 'lifetime' && (
//     <div>
//         <p className="card-title text-lg line-through decoration-2 ">
//             Lifetime - $149
//         </p>
//         <p className="card-title text-2xl">
//             Lifetime - $69
//         </p>
//     </div>
// )}