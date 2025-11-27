import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route, Link} from 'react-router-dom'
import HomePage from './pages/HomePage'
import FocusPage from './pages/Focus/FocusPage'
import TosPage from './pages/TosPage'
import SeedsPage from './pages/SeedsPage'
import ReflectionPage from './pages/ReflectionPage'
import TailPage from './pages/TailPage'
import TailSymbolPage from './pages/TailSymbolPage'
import SymbolUnlockToast from './components/SymbolUnlockToast/SymbolUnlockToast'

function App() {
  

  return (
    <>
      <div>
        <header>
          <h1>Neon Tigre 🐅</h1>
          <nav>
            <Link to="/">Home</Link> | {""}
            <Link to="/focus">Focus</Link> | {""}
            <Link to="/tos">TOS</Link> | {""}
            <Link to="/seeds">Seeds</Link> | {""}
            <Link to="reflection/">Reflection</Link> | {""}
            <Link to="/tail">Tail</Link> | {""}
          </nav>
        </header>
        {/** Toast lives here so it is visible on every page */}
        <SymbolUnlockToast/>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/focus" element={<FocusPage />}/>
            <Route path="/tos" element={<TosPage />}/>
            <Route path="/seeds" element={<SeedsPage />}/>
            <Route path="/reflection" element={<ReflectionPage />}/>
            <Route path="/tail" element={<TailPage />}/>
            <Route path="/tail/:symbolId" element={<TailSymbolPage />}/>
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
