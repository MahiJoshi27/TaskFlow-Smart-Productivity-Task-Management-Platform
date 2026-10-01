import { useState } from 'react'
import './App.css'
import Login from './components/login'
import Dashboard from './components/Dashboard'

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    function handleLogout() {

        localStorage.removeItem("token")

        setIsLoggedIn(false)
    }

    return (
        <div>

            {isLoggedIn ? (

                <Dashboard onLogout={handleLogout} />

            ) : (

                <Login
                    onLogin={() => setIsLoggedIn(true)}
                />

            )}

        </div>
    )
}

export default App