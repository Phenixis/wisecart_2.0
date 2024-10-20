

export default function Question({ props }) {
    let answer;
    
    if (props.answer) {
        if (props.ol) {
            let ol = props.ol.split("\n").map((li, index) => {
                return <li key={index}>{li}</li>;
            })
            answer = 
                    <div className="collapse-content text-secondary-content">
                        <p><span className="text-neutral text-xl font-bold ">A : </span>{props.answer}</p>
                        <ol className="list-inside list-decimal">{ol}</ol>
                    </div>;
        } else {
            answer = 
            <div className="collapse-content text-secondary-content">
                <p><span className="text-neutral text-xl font-bold ">A : </span>{props.answer}</p>
            </div>;
        }
    }

    return (
        <div className="collapse collapse-arrow join-item border-b-2">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-bold text-secondary-content ">
                <span className="text-neutral text-xl font-bold ">Q : </span>{props.question}
            </div>
            {answer}
        </div>
    )
}