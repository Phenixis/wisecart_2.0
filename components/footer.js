import Socials from "@/components/socials";

export default function Footer() {
    return (   
        <footer className="footer bg-neutral text-gray-400 flex flex-wrap items-center justify-center p-4">
            <aside className="grid-flow-col items-center">
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