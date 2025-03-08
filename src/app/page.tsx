'use client';

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ProblemForm from './components/ProblemForm';
import ProblemList from './components/ProblemList';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import ProblemSearch from './components/ProblemSearch';
import Review from './components/Review';

export default function Home() {
  const { isAuthenticated, username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'search' | 'stats' | 'profile' | 'review'>('form');

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="header-section">
        <h1 className="header-title">
          <span>ようこそ、</span>
          <span>{username}</span>
          <span>さん</span>
        </h1>
        <button onClick={logout} className="btn-secondary">
          ログアウト
        </button>
      </div>

      <div className="mb-8">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            問題を登録
          </button>
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            間違い博物館
          </button>
          <button
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            問題を検索
          </button>
          <button
            className={`tab-button ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            復習
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            統計
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            プロフィール
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'form' && <ProblemForm />}
        {activeTab === 'list' && <ProblemList />}
        {activeTab === 'search' && <ProblemSearch />}
        {activeTab === 'review' && <Review />}
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'profile' && <Profile />}
      </div>
    </main>
  );
}
