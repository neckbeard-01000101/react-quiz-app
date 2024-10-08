export default function Question({ question, dispatch, answer }) {
    return (
        <div>
            <h4>{question.question}</h4>
            <div className="options">
                {question.options.map((option, index) => {
                    return (
                        <button
                            className={`btn btn-option ${index === answer ? "answer" : ""} ${answer !== null && (index === question.correctOption ? "correct" : "wrong")}`}
                            onClick={() => {
                                dispatch({ type: "newAnswer", payload: index });
                            }}
                            key={option}
                            disabled={answer !== null}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
