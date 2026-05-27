// Context.js
import { createContext, useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
 import OneSignal from 'react-onesignal';
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
     

 
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
      
      appId: "46e54a80-e9fe-4e26-b4b8-14ccf233e88b",
      safari_web_id: "web.onesignal.auto.24e91fba-47ec-4183-a873-89e8fb838de6",
  
       allowLocalhostAsSecureOrigin: true, 
        notifyButton: {
          enable: true,
        }
      });
    }
  }, []);
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