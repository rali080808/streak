// Context.js
import { createContext, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
    let [goals, setGoals] = useState([
        { name: "Add a goal", endDate: new Date(Date.now()) },
        { name: "Add a goalaa", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { name: "third", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    ]);
    let [completed, setCompleted] = useState([{ name: "somethting", completeDate: new Date(0, 0, 0) }])
    const [streak, setStreak] = useState(0);
    let [lastStreakUpdate, setLastStreakUpdate] = useState(new Date(Date.now() - 7*24*60*60*1000).toDateString() );
    return (
        <DataContext.Provider value={{
            goals,
            completed,
            setGoals,
            setCompleted,
            streak,
            setStreak,
            lastStreakUpdate,
            setLastStreakUpdate
        }}>
            {children}
        </DataContext.Provider>
    );
}