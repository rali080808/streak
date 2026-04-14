import { useState, useEffect, useContext } from 'react'
import { DataContext } from '../DataProvider';
import styles from '../styles/AddGoal.module.css';

import Login from './Login'
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function Completed() {
    const { goals, setGoals, isLoggedIn, userID } = useContext(DataContext);
    async function fetchGoals() {
        const { data, error } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", userID)
            .eq("completed", true);
        if (error) console.log(error)
        console.log(data)
        return data;
    }

    useEffect(() => {
        let sorted = [...goals].sort((a, b) => new Date(b.completeDate) - new Date(a.completeDate));
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
    return <>
        <h1> Completed </h1>
        <div className={styles.container}>
            <div className={`${styles.subContainer} ${styles.completed}`}>
                {goals.map((val, index) => {
                    return (val.completed && <div className={`${styles.goal} ${styles[val.importance]}`} key={index}>
                        <h4>{val.name} - {new Date(val.completeDate).toLocaleDateString()}</h4>
                    </div>)
                })}</div>
        </div></>
}
export default Completed;