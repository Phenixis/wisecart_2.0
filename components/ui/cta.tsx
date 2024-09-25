import { BiDollar } from "react-icons/bi"

export default function CTA({ className="", title="Register Now", btnClassName="", subtextClassName="", iconClassName="" }) {
    return (
        <div className={`${className}`}>
            <a href="/sign-up">
                <button className={`btn btn-primary text-base font-bold ${btnClassName}`}>{title}</button>
            </a>
                <div className={`font-semibold text-sm flex items-center ${subtextClassName}`}>
                    <BiDollar className={`fill-primary ${iconClassName}`} />
                    <p>
                        <span className="text-primary">100% FREE</span> for the first 100 customers (only 5 left !).
                    </p>
                </div>
        </div>
    )
}