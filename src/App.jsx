import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router';

import TestPage from './pages/TestPage';
import AddGoal from './pages/AddGoal';
import './App.css'

function App() {
  
  const [streak, setStreak] = useState(0);
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', gap: '20px', display: 'flex' }}>
        <Link to="/">Home</Link>
        <Link to="/test">test</Link>
        <Link to="/addgoal">Add a goal</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Your Streak</h1>
            <h1>{streak}</h1>
            
             
            
          </div>
        } />
        <Route path="/test" element={<TestPage />} />
        <Route path="/addgoal" element={<AddGoal />} />
      </Routes>
    </BrowserRouter>


  )
}

export default App
