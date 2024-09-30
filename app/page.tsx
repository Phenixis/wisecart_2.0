
import type { Metadata } from 'next';
import Header from "@/components/header";
import Main from "@/components/main";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: 'WiseCart',
};

export default function Page() {
    return (
        <div className="min-h-screen w-screen bg-base-100 space-y-12">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}