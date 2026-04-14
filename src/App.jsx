import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router';


import StreakPage from './pages/streakPage';
import TestPage from './pages/TestPage';
import SupaBaseTest from './pages/SupaBaseTest';
import AddGoal from './pages/AddGoal';
import Completed from './pages/Completed'
import Login from './pages/Login'

import {DataProvider} from './DataProvider'
import './styles/App.css'

function App() {
  return (
    <DataProvider>
    <BrowserRouter>
      <nav style={{ padding: '10px', gap: '20px', display: 'flex' }}>
        <Link to="/">Home</Link>
        <Link to="/addgoal">Add a goal</Link>
        <Link to="/completed">Completed</Link>
        <Link to="/login">Log in</Link>
      </nav>
      <Routes>
        <Route path="/" element={<StreakPage/>} />
        <Route path="/addgoal" element={<AddGoal />} />
        <Route path="/completed" element={<Completed/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
</DataProvider>
  )
}

export default App
