'use client';

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ProblemForm from './components/ProblemForm';
import ProblemList from './components/ProblemList';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import ProblemSearch from './components/ProblemSearch';

export default function Home() {
  const { isAuthenticated, username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'search' | 'stats' | 'profile'>('form');

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">間違い博物館へようこそ、{username}さん</h1>
        <button onClick={logout} className="btn-secondary">
          ログアウト
        </button>
      </div>

      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'form' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            問題を登録
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'list' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            問題一覧
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'search' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            問題を検索
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            統計
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-primary font-medium' : ''}`}
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
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'profile' && <Profile />}
      </div>
    </main>
  );
}
