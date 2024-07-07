import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// pages and components 
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Lesson from './pages/Lesson';
import Friends from './pages/Friends';
import Leaderboard from './pages/Leaderboard';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <AuthContextProvider> {/* Wrap with AuthContextProvider */}
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AuthContextProvider>
  );
}

export default App;