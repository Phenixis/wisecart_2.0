import CTA from '@/components/ui/cta'
import Image from 'next/image'

export default function Hero() {
    return (
        <div className="hero">
            <div className="hero-content">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black xl:w-[80%]">
                        Create Your Shopping List <span className="text-primary">in Seconds</span>, Not Hours
                    </h1>
                    <h3 className="text-xl font-bold text-secondary">using a meal-oriented approach : </h3>
                    <div className="space-y-2 flex flex-col items-center">
                    <picture className="w-[90%]">
                        <source media="(min-width: 640px)" srcSet="/hero.png" />
                        <Image
                        src="/hero-mobile.png"
                        alt="Description of the process"
                        width={270}
                        height={480}
                        layout="responsive"
                        />

                    </picture>
                        <CTA className='w-full flex flex-col items-start sm:items-center' title="Get It For Free"/>
                    </div>
                </div>
            </div>
        </div>
    )
}