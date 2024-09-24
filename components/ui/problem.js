export default function Problem() {
    return (
        <div id="Problem" className="flex flex-col w-full bg-neutral p-4 space-y-4 rounded-xl text-secondary-content sm:w-[640px] xl:w-1/2">
            <h2 className="text-3xl font-black text-secondary text-center">
                Finding meals and making a shopping list is <span className="text-red-500">time-consuming</span>
            </h2>
            <ul className="space-y-2 font-semibold list-disc list-inside">
                <li>
                    You lose your list in your notes app or you forgot it at home
                </li>
                <li>
                    You struggle to find more than 3 meals for your week.
                </li>
                <li>
                    You forget to note a crucial part
                </li>
            </ul>
            <p className="font-black text-secondary">
                There is a better way...
            </p>
        </div>
    )
}