import Hero from "@/components/ui/hero";
import With from "@/components/ui/with";
import Pricing from "@/components/ui/pricing";
import FAQ from "@/components/ui/faq";
import Problem from "@/components/ui/problem";

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