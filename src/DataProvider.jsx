// Context.js
import { createContext, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const DataContext = createContext();

export function DataProvider({ children }) {
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [userID, setUserID] = useState("no_user");
    let [username, setUsername] = useState("");
    let [goals, setGoals] = useState([]);

    const [streak, setStreak] = useState(0);
    let [lastStreakUpdate, setLastStreakUpdate] = useState("loading" );
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