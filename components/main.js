import Hero from "@/components/hero";
import With from "@/components/with";
import Pricing from "@/components/pricing";
import FAQ from "@/components/faq";
import Problem from "@/components/problem";
import Without from "@/components/without";

export default function Main() {
    return (
        <main className="flex flex-col items-center space-y-8 w-[95%] max-w-[1024px] sm:w-[60%] m-auto">
            <Hero />
            <div id="features" className="space-y-4 items-center">
                <h2 className="text-3xl font-black text-secondary text-center">
                    Finding meals and making a shopping list is <span className="text-red-500">time-consuming</span>
                </h2>
                <div className="xl:flex xl:space-x-4 xl:space-y-0 items-center">
                    <Without />
                    <With />
                </div>
            </div>
            <Pricing />
            <FAQ />
        </main>
    )
}