import { useState, useEffect, useContext } from 'react'
import { DataContext } from '../DataProvider';
import styles from '../styles/AddGoal.module.css';


import Login from './Login'
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function Goal({goal, index, onClick}) {
    const { goals, setGoals, userID, isLoggedIn, fetchGoals } = useContext(DataContext);
    let [strikethrough, setStrikethrough] = useState(false)

    return (!goal.completed && <div className={`${styles.goal} ${styles[goal.importance]} ${styles["strikethrough"+strikethrough]}`} onClick={()=> {setStrikethrough(true); onClick()}}>
        <h4> {new Date(goal.endDate).toLocaleDateString()} - {goal.name} </h4>
    </div>)


}
export default Goal;