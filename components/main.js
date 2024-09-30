import Hero from "@/components/hero";
import With from "@/components/with";
import Pricing from "@/components/pricing";
import FAQ from "@/components/faq";
import Problem from "@/components/problem";

export default function Main() {
    return (
        <main className="flex flex-col items-center space-y-8 w-[95%] max-w-[1024px] sm:w-[60%] m-auto">
            <Hero />
            <div className="space-y-4 xl:flex xl:space-x-4 xl:space-y-0 items-center">
                <Problem />
                <With />
            </div>
            <Pricing />
            <FAQ />
        </main>
    )
}