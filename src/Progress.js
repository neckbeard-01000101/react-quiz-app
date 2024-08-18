export default function Progress({
    index,
    numQuestions,
    points,
    maxPoints,
    answer,
}) {
    return (
        <header className="progress">
            <progress
                max={numQuestions}
                value={index + Number(answer !== null)}
            ></progress>
            <p>
                Question: <strong>{index}</strong> / {numQuestions}
            </p>
            <p>
                points: <strong>{points}</strong> / {maxPoints}
            </p>
        </header>
    );
}
