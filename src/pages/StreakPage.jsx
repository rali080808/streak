import { useContext, useEffect } from 'react';
import { DataContext } from '../DataProvider';
import '../styles/StreakPage.css';
import '../styles/Login.module.css';
import Login from './Login'
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function StreakPage() {
    const { streak, setStreak, goals, lastStreakUpdate, setLastStreakUpdate, username, isLoggedIn, fetchGoals, setGoals, userID } = useContext(DataContext);
    const STREAK_UPDATE_TIME = 23;
    if (!isLoggedIn) return <Login />;
    useEffect(() => {
        async function fetchStreak() {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq('user_id', userID)
                .single();
            if (error) {
                console.log(error)
                return null
            } else {
                setStreak(data.streak)
                return data
            }
        } let today = new Date(Date.now());
        /**
         * @param {Date} date
         * @returns {Date}
         */
        function dateAtMidnight(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }
        async function updateStreak() {
            let yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

            const [streakData, goalsData] = await Promise.all([
                fetchStreak(),
                fetchGoals()
            ])
            let currentStreak = streakData.streak;
            if (goalsData && dateAtMidnight(new Date(streakData.lastStreakUpdate)).valueOf() != dateAtMidnight(today).valueOf()) {

                let sorted = [...goalsData].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
                setGoals(sorted);

                if (goals.length == 0 || new Date(goals[0].endDate).valueOf() > dateAtMidnight(today).valueOf()) {
                    currentStreak = dateAtMidnight(new Date(streakData.lastStreakUpdate)).valueOf() == dateAtMidnight(yesterday).valueOf() ? currentStreak + 1 : 1
                } else {
                    currentStreak = 0
                }
                setLastStreakUpdate(today);
                setStreak(currentStreak)
                const { data, error } = await supabase
                    .from("profiles")
                    .update({ ...streakData, streak: currentStreak, lastStreakUpdate: dateAtMidnight(new Date(Date.now())).toDateString(), updateDate: new Date(Date.now()) })
                    .eq('user_id', userID)
                if (error)
                    console.log("error from updating streak: ", error);
                else
                    console.log("no problems with updating streak data")
            }
        }
        if (today.getHours() >= STREAK_UPDATE_TIME) updateStreak();

    }, [isLoggedIn]);

    return (isLoggedIn ? (<div>
        <h3> Hello, {username}</h3>
        <h1>Your Streak</h1>
        <h1 >{streak}</h1>
        <h2>Last Streak Update: {lastStreakUpdate ? lastStreakUpdate.toLocaleTimeString() : 'Loading...'}</h2>
        <h2> STREAK_UPDATE_TIME: {STREAK_UPDATE_TIME}h </h2>
        <h2> Current time: {new Date(Date.now()).getHours()}h </h2>
    </div>) : (<Login />));
}
export default StreakPage;