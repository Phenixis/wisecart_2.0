import { LucideProps } from "lucide-react";
import { Dispatch, ForwardRefExoticComponent, RefAttributes, SetStateAction } from "react";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { usePathname } from "next/navigation";
import Link from 'next/link';


export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    navItems,
} : {
    isSidebarOpen: boolean,
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>,
    navItems: {
        href: string,
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
        label: string,
    }[],
}) {
    const pathname = usePathname();

    return (
    <aside
        className={`w-64 border-r border-gray-200 lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
        } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        >
        <nav className="h-full overflow-y-auto">
            <Button
            className="lg:hidden"
            variant="ghost"
            size={'icon'}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
            <X className="size-6" />
            <span className="sr-only">Close sidebar</span>
            </Button>
            {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                    <Button
                    className={`w-full justify-start bg-base-100 p-5 ${ pathname === item.href ? 'text-primary' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                    >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                    </Button>
                </Link>
            ))}
        </nav>
    </aside>
    );
}