import { useState, useEffect } from 'react'
function AddGoal() {
    let [goals, setGoals] = useState([
        { name: "Add a goal", endDate: new Date(Date.now()) },
        { name: "Add a goalaa", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    ]);
    let [buttonVisible, setButtonVisible] = useState(true); 
    let [newGoal, setNewGoal] = useState({name:"newGoal", endDate: new Date(0,0,0)});
    useEffect(() => {
        let sorted = [...goals].sort((a, b) => a.endDate - b.endDate);
        if ( JSON.stringify(sorted) !== JSON.stringify(goals))
            setGoals(sorted);
    }, [goals]);
    return <>
        <h2>Goals ({goals.length})</h2> 
        {goals.map((val, index) => {
            return <div key={index}>
                <h4> {val.name} - {val.endDate.toLocaleDateString()}  </h4>
            </div>
        })}
        {buttonVisible &&
        <button onClick={()=>setButtonVisible(false)}> Add a goal </button>}
        {!buttonVisible && 
        <div className='addGoal'> 
            <input placeholder='name' value={newGoal.name} onChange={(e)=>setNewGoal({name:e.target.value, endDate:newGoal.endDate})} /> 
            <input type='date' value={newGoal.endDate} onChange={(e)=>setNewGoal({name:newGoal.name, endDate:e.target.value}) }/> 
            <button onClick={()=>{setButtonVisible(true); setGoals([...goals, {name:newGoal.name, endDate:new Date(newGoal.endDate)}])}}> Add </button>
        </div> }
    </>;
}
export default AddGoal;