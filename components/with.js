import { ImCheckmark } from "react-icons/im";

export default function With() {

    return (
        <div id="with" className="xl:w-1/2 sm:w-[640px] items-center h-full">
            <div className='bg-green-300 p-3 flex flex-col w-full sm:w-[640px] xl:w-full border-8 border-green-800 rounded-xl'>
                <div className="flex items-center text-2xl space-x-2">
                    <ImCheckmark className="fill-green-800"/>
                    <p className="font-black">With WiseCart :</p>
                </div>
                <div className="font-semibold p-4">
                    <li>
                        Lists are saved, sorted and accessible from anywhere
                    </li>
                    <li>
                        Find ideas for your week in seconds with your list
                    </li>
                    <li>
                        Parts are automatically added to your list
                    </li>
                </div>
            </div>
        </div>
    );
}