import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import { useEffect, useReducer } from "react";
import Timer from "./Timer.js";
const initialState = {
    questions: [],
    // "loading", "error", "ready", "active", "finished"
    status: "loading",
    currentQuestionIndex: 0,
    answer: null,
    points: 0,
    secondsRemaining: null,
};
function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return { ...state, questions: action.payload, status: "ready" };
        case "dataFailed":
            return { ...state, status: "error" };
        case "start":
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * 30, // length * seconds per question
            };
        case "newAnswer":
            const question = state.questions.at(state.currentQuestionIndex);
            return {
                ...state,
                answer: action.payload,
                points:
                    question.correctOption === action.payload
                        ? state.points + question.points
                        : state.points,
            };
        case "nextQuestion":
            return {
                ...state,
                currentQuestionIndex: state.currentQuestionIndex + 1,
                answer: null,
            };
        case "finish":
            return { ...state, status: "finished" };
        case "restart":
            return {
                ...initialState,
                questions: state.questions,
                status: "ready",
            };
        case "tick":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status:
                    state.secondsRemaining === 0 ? "finished" : state.status,
            };
        default:
            throw new Error("unknown action");
    }
}
export default function App() {
    const [
        {
            questions,
            status,
            currentQuestionIndex,
            answer,
            points,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("http://localhost:8000/questions");
                const data = await res.json();
                console.log(data);
                dispatch({ type: "dataReceived", payload: data });
            } catch (err) {
                console.log(err);
                dispatch({ type: "dataFailed" });
            }
        }
        getData();
    }, []);
    return (
        <div className="app">
            <Header />
            <Main>
                <Progress
                    index={currentQuestionIndex}
                    numQuestions={questions.length}
                    maxPoints={maxPoints}
                    points={points}
                    answer={answer}
                />
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && (
                    <StartScreen
                        numQuestion={questions.length}
                        dispatch={dispatch}
                    />
                )}
                {status === "active" && (
                    <>
                        <Question
                            question={questions[currentQuestionIndex]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <NextButton
                            dispatch={dispatch}
                            answer={answer}
                            index={currentQuestionIndex}
                            numQuestions={questions.length}
                        />
                        <footer>
                            <Timer
                                dispatch={dispatch}
                                seconds={secondsRemaining}
                            />
                        </footer>
                    </>
                )}
                {status === "finished" && (
                    <FinishScreen
                        points={points}
                        maxPoints={maxPoints}
                        dispatch={dispatch}
                    />
                )}
            </Main>
        </div>
    );
}
