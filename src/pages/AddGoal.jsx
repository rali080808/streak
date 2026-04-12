import { useState, useEffect } from 'react'
import './AddGoal.css';
function AddGoal() {
    let [goals, setGoals] = useState([
        { name: "Add a goal", endDate: new Date(Date.now()) },
        { name: "Add a goalaa", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    ]);
    let [buttonVisible, setButtonVisible] = useState(true);
    let [newGoal, setNewGoal] = useState({ name: "newGoal", endDate: new Date(0, 0, 0) });
    let [completed, setCompleted] = useState([{name:"somethting", completeDate: new Date(0,0,0)}])
    useEffect(() => {
        let sorted = [...goals].sort((a, b) => a.endDate - b.endDate);
        if (JSON.stringify(sorted) !== JSON.stringify(goals))
            setGoals(sorted);
    }, [goals]);
    useEffect(() => {
        let sorted = [...completed].sort((a, b) => b.completeDate - a.completeDate);
        if (JSON.stringify(sorted) !== JSON.stringify(completed))
            setCompleted(sorted);
    }, [goals]);
    
    function checkGoal(index) { 
        const newArr = [...goals.slice(0, index), ...goals.slice(index + 1)];
        console.log(index)
        setCompleted([...completed, {name:goals[index].name, completeDate:new Date(Date.now())}]);
        setGoals(newArr);
    }
    return <div className='all'>
        <h1>Goals</h1>
        <div className='contatiner'>
            <div className='subContainer'>
                <h2> DO SOMETHING  ({goals.length}) </h2>
        {goals.map((val, index) => {
            return <div className='goal' key={index}>
                <input type="checkbox" key={index} onChange={() => { checkGoal(index) }} />   <h4> {val.name} - {val.endDate.toLocaleDateString()}  </h4>
            </div>
        })}
        {buttonVisible &&
            <button onClick={() => setButtonVisible(false)}> Add a goal </button>}
        {!buttonVisible &&
            <div className='addGoal'>
                <input placeholder='name' value={newGoal.name} onChange={(e) => setNewGoal({ name: e.target.value, endDate: newGoal.endDate })} />
                <input type='date' value={newGoal.endDate} onChange={(e) => setNewGoal({ name: newGoal.name, endDate: e.target.value })} />
                <button onClick={() => { setButtonVisible(true); setGoals([...goals, { name: newGoal.name, endDate: new Date(newGoal.endDate) }]) }}> Add </button>
            </div>}
            </div>
            <div className='subContainer'>
                <h2> Completed </h2>
                {completed.map((val, index) => {
                    return <div className='goal' key={index}>
                        <h4>{val.name} - {val.completeDate.toLocaleDateString()}</h4>
                        </div>
                })}
            </div>
        </div>
    </div>;
}
export default AddGoal;