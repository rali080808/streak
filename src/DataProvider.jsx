// Context.js
import { createContext, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const DataContext = createContext();

export function DataProvider({ children }) {
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [userID, setUserID] = useState("no_user");
    let [username, setUsername] = useState("");
    let [goals, setGoals] = useState([
        { name: "Add a goal", endDate: new Date(Date.now()), importance: "high", completed: false },
        { name: "Add a goalaa", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), importance: "low", completed: false   },
        { name: "third", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), importance: "medium", completeDate: new Date(0,0,0),completed: true   }
    ]);

    const [streak, setStreak] = useState(0);
    let [lastStreakUpdate, setLastStreakUpdate] = useState(new Date(Date.now() - 7*24*60*60*1000).toDateString() );
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
    return (
        <DataContext.Provider value={{
            goals,
            setGoals,
            userID,
            setUserID, 
            username,
            setUsername,
            streak,
            setStreak,
            lastStreakUpdate,
            setLastStreakUpdate,
            isLoggedIn,
            setIsLoggedIn,
            fetchGoals
        }}>
            {children}
        </DataContext.Provider>
    );
}