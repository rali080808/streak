import { useContext, useEffect } from 'react';
import { DataContext } from '../DataProvider';
import '../styles/StreakPage.css';
import '../styles/Login.module.css';
import Login from './Login'
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function StreakPage() {
    const { streak, setStreak, goals, lastStreakUpdate, setLastStreakUpdate, username, isLoggedIn, fetchGoals, setGoals, userID } = useContext(DataContext);
  
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
             //   setStreak(data.streak)
                return data
            }
        } 
        
        let today = new Date(Date.now());
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
            let currentLastStreakUpdate = streakData.lastStreakUpdate;
            console.log(dateAtMidnight(new Date(streakData.lastStreakUpdate)))
            console.log(dateAtMidnight(today))

            if (goalsData && dateAtMidnight(new Date(streakData.lastStreakUpdate)).valueOf() != dateAtMidnight(today).valueOf()) {

                let sorted = [...goalsData].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
                setGoals(sorted);
                
                console.log(goals.length )
                if (sorted.length == 0 || new Date(sorted[0].endDate).valueOf() > dateAtMidnight(today).valueOf()) {
                    if ( dateAtMidnight(new Date(streakData.lastStreakUpdate)).valueOf() == dateAtMidnight(yesterday).valueOf() ) {
                        currentStreak = currentStreak+1
                        currentLastStreakUpdate = today
                         
                    } else {
                     currentStreak = 1
                    currentLastStreakUpdate = today;

                  }
                } else {
                    currentStreak = 0
                     currentLastStreakUpdate = today;
                }

                setLastStreakUpdate(currentLastStreakUpdate)
                setStreak(currentStreak)
                console.log(dateAtMidnight(new Date(Date.now())).toDateString())
            const { data, error } = await supabase
                    .from("profiles")
                    .update({ ...streakData, streak: currentStreak, lastStreakUpdate: currentLastStreakUpdate.toDateString(), updateDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toDateString() })
                    .eq('user_id', userID)
                if (error)
                    console.log("error from updating streak: ", error);
                else
                    console.log("no problems with updating streak data")
            }else {setStreak(streakData.streak); setLastStreakUpdate(streakData.lastStreakUpdate)}
        }
      updateStreak();

    }, [isLoggedIn]);

    return (isLoggedIn ? (<div>
        <h3> Hello, {username}</h3>
        <h1>Your Streak</h1>
        <h1 >{streak}</h1>
        <h2>{new Date(lastStreakUpdate).toDateString()}</h2>
        <h2> STREAK_UPDATE_TIME: {0}h </h2>
        <h2> Current time: {new Date(Date.now()).getHours()}h </h2>
    </div>) : (<Login />));
}
export default StreakPage;