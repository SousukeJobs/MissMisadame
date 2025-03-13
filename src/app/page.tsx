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
import { FiPlusCircle, FiArchive, FiSearch, FiRepeat, FiBarChart2, FiUser } from 'react-icons/fi';

export default function Home() {
  const { isAuthenticated, username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'search' | 'stats' | 'profile' | 'review'>('list');

  if (!isAuthenticated()) {
    return <Login />;
  }

  const tabConfig = [
    { id: 'list', label: '間違い博物館', icon: <FiArchive /> },
    { id: 'form', label: '問題を登録', icon: <FiPlusCircle /> },
    { id: 'search', label: '問題を検索', icon: <FiSearch /> },
    { id: 'review', label: '復習', icon: <FiRepeat /> },
    { id: 'stats', label: '統計', icon: <FiBarChart2 /> },
    { id: 'profile', label: 'プロフィール', icon: <FiUser /> }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="header-section">
        <h1 className="header-title">
          <span>ようこそ、</span>
          <span>{username}</span>
          <span>さん</span>
        </h1>
        {/* <button onClick={logout} className="btn-secondary">
          ログアウト
        </button> */}
        <br />
        <br />
        
      </div>

      <div className="mb-8">
        <nav className="tab-navigation">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="content-area">
        {activeTab === 'form' && <ProblemForm />}
        {activeTab === 'list' && <ProblemList />}
        {activeTab === 'search' && <ProblemSearch />}
        {activeTab === 'review' && <Review />}
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'profile' && <Profile onLogout={logout} />}
      </div>
    </main>
  );
}
