export default function Dashboard() {
    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex justify-around mt-5">
                <div className="w-1/3 p-2 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold">Section 1</h2>
                    <p>Content for section 1</p>
                </div>
                <div className="w-1/3 p-2 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold">Section 2</h2>
                    <p>Content for section 2</p>
                </div>
                <div className="w-1/3 p-2 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold">Section 3</h2>
                    <p>Content for section 3</p>
                </div>
            </div>
        </div>
    )
}