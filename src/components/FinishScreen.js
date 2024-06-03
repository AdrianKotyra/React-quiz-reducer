function FinishScreen({points, maxPossiblePoints, highscore, dispatch}) {
    const percentage = (points/maxPossiblePoints) * 100;
    return (
        <>
            <p className="results">
                You scored {points} out of {maxPossiblePoints}
                {Math.ceil(percentage)}%
            </p>
            <p className="highscore">{highscore}</p>

            <button className="btn btn-ui" onClick={()=>dispatch({type: "restart"})}>Restart the Quiz</button>
        </>
    )
}

export default FinishScreen
