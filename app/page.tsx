
import type { Metadata } from 'next';
import Header from "@/components/ui/header";
import Main from "@/components/ui/main";
import Footer from "@/components/ui/footer";

export const metadata: Metadata = {
    title: 'WiseCart',
};

export default function Page() {
    return (
        <div className="min-h-screen w-screen bg-base-200">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}