import { useContext, useEffect } from 'react';
import { DataContext } from '../DataProvider';
import './StreakPage.css';
function StreakPage() {
    const { streak, setStreak, goals, lastStreakUpdate, setLastStreakUpdate } = useContext(DataContext);

    useEffect(() => {
      //  if (goals.length == 0) return;
        let today = new Date(Date.now()).toDateString();
        //console.log(new Date(goals[0].endDate.toDateString()) );
      //  console.log(goals[0].endDate);
        //console.log(new Date(today));
        if (goals.length == 0 || new Date(goals[0].endDate.toDateString()) > new Date(today)) {
            //console.log(new Date(goals[0].endDate.toDateString()) );
            //console.log(new Date(today));
            setLastStreakUpdate(prev => {
                console.log(prev)
                if ( prev === today ) return prev;
                setStreak(streak => streak + 1);
                return today;
            })
          
        }
    }, [goals]);

    return <div>
        <h1>Your Streak</h1>
        <h1 >{streak}</h1>
        <h2>{new Date(lastStreakUpdate).toLocaleDateString()}</h2>
    </div>;
}
export default StreakPage;