import './styles/App.css';
import { Routes, Route, NavLink } from 'react-router-dom';
import CreateConcertPage from './pages/concerts/CreateConcertPage.jsx';
import EditConcertPage from "./pages/concerts/EditConcertPage.jsx";
import ConcertsList from "./components/concerts/ConcertsList.jsx";
import AdminPage from "./pages/concerts/AdminPage.jsx";
import RegisterPage from "./pages/logins/RegisterPage.jsx";
import LoginPage from "./pages/logins/LoginPage.jsx";
import { useAuth } from './auth/AuthContext.jsx';
import { RequireAdmin } from "./auth/RequireAdmin.jsx";
import LocationsPage from './pages/locations/LocationsPage.jsx';
import CreateLocationPage from './pages/locations/CreateLocationPage.jsx';
import EditLocationPage from './pages/locations/EditLocationPage.jsx';
import PaymentPage from './pages/payment/PaymentPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';

function App() {
    const { isLoggedIn, isAdmin, logout } = useAuth();

    return (
        <div className="App">
            <nav style={{ padding: '1rem', background: '#111', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <NavLink to="/concerts" className="book-button">View Concerts</NavLink>
                {isAdmin && <NavLink to="/admin" className="book-button">Concert Changes</NavLink>}
                {isLoggedIn
                    ? <>
                        <NavLink to="/profile" className="book-button">My Profile</NavLink>
                        <button onClick={logout} className="book-button">Log Out</button>
                    </>
                    : <>
                        <NavLink to="/login" className="book-button">Log In</NavLink>
                        <NavLink to="/register" className="book-button">Register</NavLink>
                    </>}
                {isAdmin && <NavLink to="/locations" className="book-button">Location Changes</NavLink>}
            </nav>

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/concerts" element={<ConcertsList />} />
                <Route path="/concerts/add" element={<RequireAdmin><CreateConcertPage /></RequireAdmin>} />
                <Route path="/concerts/:id/edit" element={<RequireAdmin><EditConcertPage /></RequireAdmin>} />
                <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/locations" element={<RequireAdmin><LocationsPage /></RequireAdmin>} />
                <Route path="/locations/add" element={<RequireAdmin><CreateLocationPage /></RequireAdmin>} />
                <Route path="/locations/:id/edit" element={<RequireAdmin><EditLocationPage /></RequireAdmin>} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </div>
    );
}

export default App;