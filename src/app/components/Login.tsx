'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          login(data.token, data.username);
        } else {
          alert('登録が完了しました。ログインしてください。');
          setIsLogin(true);
        }
      } else {
        alert(data.message || 'エラーが発生しました。');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="font-semibold" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
        {isLogin ? 'ログイン' : 'アカウント登録'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y">
        <div>
          <label htmlFor="username" className="text-sm font-medium">
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            className="input-field"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isLogin ? 'ログイン' : '登録'}
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="btn-primary"
            style={{ width: '50%' }}
          >
            {isLogin ? 'アカウントを作成' : 'ログインに戻る'}
          </button>
        </div>
      </form>
    </div>
  );
} 