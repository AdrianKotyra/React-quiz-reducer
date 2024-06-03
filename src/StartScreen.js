function StartScreen({numQuestions, dispatch}) {
    return (
        <div className="start">
            <h2>Welcome to the React quiz!</h2>
            <h3>{numQuestions} question to test your react knowledge</h3>
            <button onClick={()=>dispatch({type: 'start'})}className="btn btn-ui">Let's start</button>
        </div>
    )
}

export default StartScreen
