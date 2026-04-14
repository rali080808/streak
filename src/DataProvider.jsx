// Context.js
import { createContext, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [userID, setUserID] = useState("no_user");
    let [username, setUsername] = useState("no_username");
    let [goals, setGoals] = useState([
        { name: "Add a goal", endDate: new Date(Date.now()), importance: "high", completed: false },
        { name: "Add a goalaa", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), importance: "low", completed: false   },
        { name: "third", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), importance: "medium", completeDate: new Date(0,0,0),completed: true   }
    ]);

    const [streak, setStreak] = useState(0);
    let [lastStreakUpdate, setLastStreakUpdate] = useState(new Date(Date.now() - 7*24*60*60*1000).toDateString() );
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
            setIsLoggedIn
        }}>
            {children}
        </DataContext.Provider>
    );
}