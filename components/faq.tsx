import Question from "@/components/ui/question";

export default function FAQ() {
    return (
        <div id="FAQ" className="flex flex-col w-full bg-secondary p-4 space-y-4  rounded-xl">
            <div className="text-3xl font-bold text-secondary-content">
                Frequently Asked Questions
            </div>
            <div className="space-y-2">
                <Question props={{question: "How does WiseCart work?", answer: "WiseCart uses a meal-oriented approach to help you build your shopping list easier and faster. All you have to do is to enter the parts of the meal you eat regularly. They will be saved in your personnal list and you will be able to select them for your next meals. Finally, you have the button 'export' that creates and copy the list for you. You now have saved hours of wondering what to eat. Congrats !"}} />

                <Question props={{question: "What is the price?", answer: "The first 100 customers get it for free in exchange of a genuine feedback to improve the app. Then the app will cost $4/month, or 40$/year or $69 for a lifetime access."}} />
                
                <div className="collapse collapse-arrow join-item border-b-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-bold text-secondary-content ">
                        <span className="text-neutral text-xl font-bold ">Q : </span>
                        How do I suggest a feature ?
                    </div>
                    <div className="collapse-content text-secondary-content">
                        <p>
                            <span className="text-neutral text-xl font-bold ">A : </span>
                            I use Insighto to track feature requests, you can suggest a feature right <a href="https://insigh.to/b/wisecart" target="_blank"className="link">here</a>. On the page, you'll see others' suggestions and vote on them or make your own.
                        </p>
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-b-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-bold text-secondary-content ">
                        <span className="text-neutral text-xl font-bold ">Q : </span>
                        How do I report a bug ?
                    </div>
                    <div className="collapse-content text-secondary-content">
                        <p>
                            <span className="text-neutral text-xl font-bold ">A : </span>
                            I (also) use Insighto to track bug reports, you can report a bug right <a href="https://insigh.to/b/wisecartbugs" target="_blank"className="link">here</a>. On the page, you'll see others' bug reports and vote on them or make your own.
                        </p>
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-b-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-bold text-secondary-content ">
                        <span className="text-neutral text-xl font-bold ">Q : </span>
                        I have another question, how can I ask it ?
                    </div>
                    <div className="collapse-content text-secondary-content">
                        <p>
                            <span className="text-neutral text-xl font-bold ">A : </span>
                            You can reach me at <a href="mailto:max@maximeduhamel.com" className="link">this email address</a>, I'll be happy to help you and add your valuable question to this FAQ.
                        </p>
                    </div>
                </div>
                <Question props={{question:"Who is WiseCart for ?", answer:"WiseCart is for anyone who wants to save time on their groceries. It's especially useful for people who eat the same meals regularly and want to automate their shopping list."}} />
            </div>
        </div>
    )
}