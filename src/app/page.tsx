'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ProblemForm from './components/ProblemForm';
import ProblemList from './components/ProblemList';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import ProblemSearch from './components/ProblemSearch';
import Review from './components/Review';
import Homeview from './components/Homeview';
import { FiPlusCircle, FiSearch, FiRepeat, FiBarChart2, FiUser, FiHome } from 'react-icons/fi';
import { ImLibrary } from "react-icons/im";

export default function Home() {
  const { isAuthenticated, username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'homeview' | 'form' | 'list' | 'search' | 'stats' | 'profile' | 'review'>('list');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth < 480;
      setIsSmallScreen(smallScreen);
      setActiveTab(smallScreen ? 'homeview' : 'list'); // 画面サイズに応じて初期状態を設定
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const tabConfig = [
    { id: 'homeview', label: 'ホーム', icon: <FiHome /> },
    { id: 'list', label: '間違い博物館', icon: <ImLibrary /> },
    { id: 'form', label: '問題を登録', icon: <FiPlusCircle /> },
    { id: 'search', label: '問題を検索', icon: <FiSearch /> },
    { id: 'review', label: '復習', icon: <FiRepeat /> },
    { id: 'stats', label: '統計', icon: <FiBarChart2 /> },
    { id: 'profile', label: 'プロフィール', icon: <FiUser /> }
  ];

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="air"><br /></div>
      <div className="header-section">
        <h1 className="header-title">
          <span>ようこそ、</span>
          <span>{username}</span>
          <span>さん</span>
        </h1>
      </div>
      <div className="air"><br /></div>
      <div className="mb-8">
        <nav className="tab-navigation">
          {tabConfig
            .filter((tab) => tab.id !== 'homeview' || isSmallScreen)
            .map((tab) => (
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
        {activeTab === 'homeview' && <Homeview setActiveTab={setActiveTab} />}
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
