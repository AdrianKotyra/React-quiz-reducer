import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader"
import Error from "./Error"
import StartScreen from "./StartScreen";
import Question from "./Question"
import NextButton from "./components/nextButton"

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
                status: "active"
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
    points : 0
}



export default function App(){
    // const [state, dispatch] = useReducer(reducer, initialState) state destructured
    const [{points, answer, questions, status, index}, dispatch] = useReducer(reducer, initialState)
    console.log(questions)
    const numQuestions = questions.length;

    useEffect(function(){
        
        fetch("http://localhost:8000/questions")
        .then((res)=>res.json())
        .then((data)=>dispatch({type: 'dataRecieved', payload: data }))
        .catch((err)=>dispatch({type: 'dataFailed'}))
  
        // async function getquestions(){
        //     try {
           
        //     const res = await fetch(`http://localhost:8001/questions`)
        //     if(!res.ok) throw new Error("Something went wrong");
        //     const data = await res.json();

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
            <Question  answer={answer} dispatch={dispatch} question={questions[index]}/> 
            <NextButton answer={answer} dispatch={dispatch}/>
        </>
        }
      
    
    </Main>
   
    </div>
}