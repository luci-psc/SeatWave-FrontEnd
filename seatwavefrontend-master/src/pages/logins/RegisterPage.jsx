// src/pages/RegisterPage.jsx
import '../../styles/auth.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import PasswordInput from "../../components/common/PasswordInput.jsx";

const EMPTY = { firstName: '', lastName: '', email: '', password: '', age: '' };

const RegisterPage = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const update = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError(null); setLoading(true);
        try {
            await handleRegister({ ...form, age: parseInt(form.age, 10) });
            navigate('/concerts');
        } catch {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={submit}>
                <h1>Create Account</h1>
                {error && <div className="auth-error">{error}</div>}
                <div className="input-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={form.firstName} placeholder="e.g. Alex" onChange={update} required />
                </div>
                <div className="input-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={form.lastName} placeholder="e.g. Jansen" onChange={update} required />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} placeholder="you@example.com" onChange={update} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <PasswordInput
                        name="password"
                        value={form.password}
                        onChange={update}
                        placeholder="At least 5 characters"
                        autoComplete="new-password"
                        minLength={5}
                    />
                </div>
                <div className="input-group">
                    <label>Age</label>
                    <input type="number" name="age" value={form.age} onChange={update} placeholder="Must be 18 or older" required min={18} max={100} />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Creating…' : 'Create Account'}
                </button>
                <div className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;