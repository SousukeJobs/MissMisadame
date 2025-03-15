'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  onLogout?: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const { token, username: currentUsername, updateProfile } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: currentUsername || '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('プロフィールが更新されました');
        if (updateProfile) {
          updateProfile(data.user);
        }
      } else {
        setMessage(data.message || 'エラーが発生しました');
      }
    } catch (error) {
      setMessage('エラーが発生しました');
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('新しいパスワードが一致しません');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
      }
    } catch (error) {
      setMessage('エラーが発生しました');
      console.error(error);
    }
  };

  return (
    <div className="space-y">
      <h2 className="text-xl font-bold mb-4">プロフィール設定</h2>
      
      {message && (
        <div className="alert mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y">
        <div>
          <label htmlFor="username" className="text-sm font-medium">
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            className="input-field"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="input-field"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-primary">
          プロフィールを更新
        </button>
      </form>

      <div className="profile-actions">
        <button
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="btn-secondary"
        >
          {isChangingPassword ? 'パスワード変更をキャンセル' : 'パスワードを変更'}
        </button>

        {onLogout && (
          <button onClick={onLogout} className="btn-danger">
            ログアウト
          </button>
        )}
      </div>

      {isChangingPassword && (
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y">
          <div>
            <label htmlFor="currentPassword" className="text-sm font-medium">
              現在のパスワード
            </label>
            <input
              type="password"
              id="currentPassword"
              className="input-field"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="text-sm font-medium">
              新しいパスワード
            </label>
            <input
              type="password"
              id="newPassword"
              className="input-field"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              新しいパスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            パスワードを変更
          </button>
        </form>
      )}
    </div>
  );
} 