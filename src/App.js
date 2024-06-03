import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader"
import Error from "./Error"
import StartScreen from "./StartScreen";
import Question from "./Question"
import NextButton from "./components/nextButton"
import Progress from "./components/progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer"

const SECONDS_PERS_QUESTION = 30;

function reducer(state, action){
    // action.type === dispatch(type) <===
    switch(action.type){
        case 'dataRecieved':
            return {
            ...state,
            questions: action.payload,
            status: "ready"
            }

        case 'dataFailed':
            return {
                ...state,
                status: "error"
            }
        case 'start':
            return {
                ...state,
                status: "active",
                secondsRemaining : state.questions.length * SECONDS_PERS_QUESTION

            }
        case 'newAnswer':
            const question = state.questions.at(state.index)
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points
            }
        case 'nextQuestion':
            return {
                ...state,
                answer: null,
                index: state.index +1
            }
        case 'finished':
            return {
                ...state,
                status: "finish",
                highscore: state.points > state.highscore ? state.points :  state.highscore
             
            }
        case 'restart':
            return {
                ...state,
                status: "ready",
                index: 0,
                answer: null,
                points : 0,
                secondsRemaining: null
                
                
            }
            case 'tick':
                return {
                    ...state,
                    secondsRemaining : state.secondsRemaining - 1,
                    status: state.secondsRemaining === 0 ? "finish" : state.status,
                
                    
                    
                }
        default:
            throw new Error("action unknown")
    }
}
  

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: "loading",
    index: 0,
    answer: null,
    points : 0,
    highscore : 0,
    secondsRemaining: 10
}



export default function App(){
    // const [state, dispatch] = useReducer(reducer, initialState) state destructured
    const [{secondsRemaining, highscore, points, answer, questions, status, index}, dispatch] = useReducer(reducer, initialState)
   
    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, cur)=> prev+ cur.points, 0)

    useEffect(function(){
         
        // fetch("http://localhost:8000/questions")
        // .then((res)=>res.json())
        // .then((data)=>dispatch({type: 'dataRecieved', payload: data }))
        // .catch((err)=>dispatch({type: 'dataFailed'}))


        fetch("https://adriankotyraprojects.co.uk/websites/APIs/questions.php")
        .then((res)=>res.json())
        .then((data)=>dispatch({type: 'dataRecieved', payload: data }))
        .catch((err)=>dispatch({type: 'dataFailed'}))
        
        // async function getquestions(){
        //     try {
           
        //     const res = await fetch("https://adriankotyraprojects.co.uk/websites/APIs/questions.php")
        //     if(!res.ok) throw new Error("Something went wrong");
        //     const data = await res.json();
        //     dispatch({type: 'dataRecieved', payload: data })
        //     if(data.response==='false') throw new Error("Something went wrong")
        //     }
        //     catch (err) {
        //         console.log(err.message)
        //     }    
        // }
        // getquestions()

    },[])

    
    return <div className="app">
    <Header/>
    <Main>
        {status==="loading"&& <Loader/>}
        {status==="error"&& <Error/>}
        {status==="ready"&& <StartScreen dispatch={dispatch} numQuestions={numQuestions}/>}
        {status==="active" && 
        <>
            <Progress numQuestions={numQuestions} index={index} points={points} maxPossiblePoints={maxPossiblePoints}/>
            <Question  answer={answer} dispatch={dispatch} question={questions[index]}/> 
            <Footer>
                <Timer secondsRemaining = {secondsRemaining}dispatch={dispatch}/>
                <NextButton answer={answer} dispatch={dispatch} numQuestions={numQuestions} index={index}/>

                
            </Footer>
        </>
        }
        {status==="finish" && <FinishScreen dispatch={dispatch} highscore={highscore} points={points} maxPossiblePoints={maxPossiblePoints}/> }
      
    
    </Main>
   
    </div>
}