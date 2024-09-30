import { ImCancelCircle } from "react-icons/im";

export default function Without() {
    return (
        <div id="without" className="xl:w-1/2 sm:w-[640px] items-center h-full">
            <div className='bg-red-300 p-3 flex flex-col w-full sm:w-[640px] xl:w-full border-8 border-red-800 rounded-xl'>
                <div className="flex items-center text-2xl space-x-2">
                    <ImCancelCircle className="fill-red-800"/>
                    <p className="font-black">Without WiseCart :</p>
                </div>
                <div className="font-semibold p-4">
                    <li>
                        You can't find your list in your notes
                    </li>
                    <li>
                        You struggle to find more than 3 different meals for your week.
                    </li>
                    <li>
                        You forget to note a crucial part
                    </li>
                </div>
            </div>
        </div>
    );
}