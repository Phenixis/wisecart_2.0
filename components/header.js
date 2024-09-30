import Logo from "@/components/ui/logo";
import { SlArrowRight } from "react-icons/sl";
import CTA from "@/components/ui/cta";

export default function Header() {
    return (
        <div className="navbar bg-base-200 rounded-b-xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden focus:rotate-90">
                        <SlArrowRight />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#FAQ">FAQ</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">
                    <Logo />
                    <h2>
                        WiseCart
                    </h2>
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#FAQ">FAQ</a></li>
                </ul>
            </div>
            <CTA className="navbar-end" subtextClassName="hidden"/>
            </div>
    )
}