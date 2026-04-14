import { useState, useEffect, useContext } from 'react'
import { DataContext } from '../DataProvider';
import styles from '../styles/AddGoal.module.css';


import Login from './Login'
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function AddGoal() {
    const { goals, setGoals, userID, isLoggedIn } = useContext(DataContext);

    let [buttonVisible, setButtonVisible] = useState(true);
    let [newGoal, setNewGoal] = useState({
        name: "newGoal", endDate: new Date(0, 0, 0), importance: "low", user_id: userID

    });
    async function fetchGoals() {
        const { data, error } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", userID)
            .eq("completed", false);
        if (error) console.log(error)
        console.log(data)
        return data;
    }
    useEffect(() => {
        let sorted = [...goals].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        if (JSON.stringify(sorted) !== JSON.stringify(goals))
            setGoals(sorted);
    }, [goals]);
    useEffect(() => {
        if (isLoggedIn) {
            fetchGoals().then(data => {
                if (data) setGoals(data);
            });
        }
    }, [isLoggedIn]);
    if (!isLoggedIn) return <Login />;

    async function checkGoal(index) {
        const { data, error } = await supabase
            .from('goals')
            .update({ completed: true, completeDate: new Date(Date.now()) })
            .eq('id', goals[index].id);
        fetchGoals().then(data => {
            if (data) setGoals(data);
        });
    }
    async function addGoal() {
        console.log(newGoal.user_id, userID)
        setButtonVisible(true);
        const { error } = await supabase
            .from('goals')
            .insert({ ...newGoal, endDate: new Date(newGoal.endDate), completed: false, user_id: userID })
        if (error) console.log("Error from supabase:", error)

        if (isLoggedIn) {
            fetchGoals().then(data => {
                if (data) setGoals(data);
            });
        }
    }
    return <div className='all'>
        <h1>Goals</h1>
        <div className={styles.container}>
            <div className={`${styles.subContainer} ${styles.goals}`}>

                {goals.map((val, index) => {
                    return (!val.completed && <div className={`${styles.goal} ${styles[val.importance]}`} key={index} onClick={() => checkGoal(index)} >
                        <h4> {new Date(val.endDate).toLocaleDateString()} - {val.name} </h4>
                    </div>)
                })}
                {buttonVisible &&
                    <button className={styles.addGoal} onClick={() => setButtonVisible(false)}> Add a goal </button>}
                {!buttonVisible &&
                    <div className={styles.addGoal}>
                        <input className={styles.addGoal} placeholder='name' value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} />
                        <input className={styles.addGoal} type='date' value={newGoal.endDate} onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })} />
                        <select className={styles.addGoal} value={newGoal.importance}
                            onChange={(e) => setNewGoal({ ...newGoal, importance: e.target.value })}>
                            <option value="low"> Low </option>
                            <option value="medium"> Medium </option>
                            <option value="high"> High </option>
                        </select>
                        <button className={styles.addGoal} onClick={addGoal}> Add </button>
                    </div>}
            </div>
        </div>

    </div>;
}
export default AddGoal;