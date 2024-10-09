"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react';

const carouseulTextMessages = [
    "Do you know you can use WiseCart not only for groceries but also for other shopping lists?",
    "You can create multiple shopping lists and share them with your family and friends.",
    "You can also create meal lists and ingredient lists.",
]

const imgWidth = 256

export default function Loading() {
    const [carouselActiveText, setCarouselActiveText] = useState(0);

    const carouselRef = useRef<HTMLDivElement>(null)

    const scrollItem = () => {
        setCarouselActiveText(prevState => {
            if(carouseulTextMessages.length-1 > prevState){
                return prevState+1
            } else {
                return 0
            }
        })
    }

    const autoplay = useCallback(() => setInterval(scrollItem, 5000),[])

    useEffect(() => {
        const play = autoplay()
        return () => clearInterval(play)
    },[autoplay])

    useEffect(() => {
        carouselRef.current?.scroll({left: imgWidth * carouselActiveText})
    },[carouselActiveText])

    return (
        <div className="flex items-center justify-center min-h-[100dvh]">
            <div className="max-w-md p-4 text-center">
                <div className="flex justify-center">
                    <Loader2 className="animate-spin size-12 text-primary" />
                </div>
                <h1 className="text-2xl text-gray-900">
                    Loading...
                </h1>
                <div ref={carouselRef} className="carousel rounded-box w-64">
                    {
                        carouseulTextMessages.map(message => (
                            <p className="carousel-item w-64" key={message}>
                                {message}
                            </p>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}