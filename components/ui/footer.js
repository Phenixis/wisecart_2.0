import Logo from "@/components/ui/logo";
import Socials from "@/components/ui/socials";

export default function Footer() {
    return (   
        <footer className="footer bg-neutral text-neutral-content flex flex-wrap items-center justify-center p-4">
            <aside className="grid-flow-col items-center">
                <Logo />
                <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
            </aside>
            <div className="flex justify-center items-center">
                <p className="uppercase font-semibold">
                    About the maker :
                </p>
                <Socials />
            </div>
        </footer>
    )
}