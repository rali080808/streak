import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router';


import StreakPage from './pages/streakPage';
import TestPage from './pages/TestPage';
import AddGoal from './pages/AddGoal';
import {DataProvider} from './DataProvider'
import './App.css'

function App() {
  return (
    <DataProvider>
    <BrowserRouter>
      <nav style={{ padding: '10px', gap: '20px', display: 'flex' }}>
        <Link to="/">Home</Link>
        <Link to="/test">test</Link>
        <Link to="/addgoal">Add a goal</Link>
      </nav>
      <Routes>
        <Route path="/" element={<StreakPage/>
        } />
        <Route path="/test" element={<TestPage />} />
        <Route path="/addgoal" element={<AddGoal />} />
      </Routes>
    </BrowserRouter>
</DataProvider>
  )
}

export default App
