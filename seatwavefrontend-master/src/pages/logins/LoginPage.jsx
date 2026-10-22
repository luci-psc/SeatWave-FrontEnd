// src/pages/LoginPage.jsx
import '../../styles/auth.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';

const LoginPage = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const update = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError(null); setLoading(true);
        try {
            await handleLogin(form);
            navigate('/concerts');
        } catch {
            setError('Login failed — check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={submit}>
                <h1>Log In</h1>
                {error && <div className="auth-error">{error}</div>}
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={update}
                           placeholder="you@example.com" autoComplete="email" required />                </div>
                <div className="input-group">
                    <label>Password</label>
                    <PasswordInput
                        name="password"
                        value={form.password}
                        onChange={update}
                        placeholder="Your password"
                        autoComplete="current-password"
                        minLength={5}
                    />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Logging in…' : 'Log In'}
                </button>
                <div className="auth-switch">
                    No account? <Link to="/register">Create one</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;