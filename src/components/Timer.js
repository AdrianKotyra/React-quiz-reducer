import { useEffect } from "react"

function Timer({dispatch, secondsRemaining}) {
    useEffect(function(){
        const id = setInterval(()=>{
            dispatch({type: "tick"})

        }, 1000)
        return function(){
            clearInterval(id)

        }
    },[dispatch])
 
    return (
        <div className="timer">
            {secondsRemaining}
        </div>
    )
}

export default Timer
