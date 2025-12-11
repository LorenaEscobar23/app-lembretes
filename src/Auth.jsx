import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import './Auth.css';

export default function Auth({ onAuthStateChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      onAuthStateChange(user);
    });
    return () => unsubscribe();
  }, [onAuthStateChange]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>📋 Gestor de Lembretes</h1>
        <p className="subtitle">Organize seus lembretes pessoais</p>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading
              ? 'Processando...'
              : isLogin
                ? 'Entrar'
                : 'Criar Conta'}
          </button>
        </form>

        <button
          className="toggle-auth"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin
            ? 'Não tem conta? Criar uma'
            : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}

export function LogoutButton({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert('Erro ao fazer logout: ' + error.message);
    }
  };

  return (
    <div className="user-info">
      <span>👤 {user.email}</span>
      <button onClick={handleLogout} className="logout-btn">
        🚪 Logout
      </button>
    </div>
  );
}
