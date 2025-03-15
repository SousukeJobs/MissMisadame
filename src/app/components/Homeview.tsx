"use client";

import React, { useEffect, useState } from "react";
import QuoteDisplay from '../../../src/components/QuoteDisplay';
import { useAuth } from '../contexts/AuthContext';
import { FiPlusCircle, FiRepeat, FiBarChart2 } from 'react-icons/fi';
import axios from 'axios';
import { ImLibrary } from "react-icons/im";

type HomeviewProps = {
  setActiveTab: (tab: 'homeview' | 'form' | 'list' | 'search' | 'stats' | 'profile' | 'review') => void;
};

const Home = ({ setActiveTab }: HomeviewProps): React.ReactNode => {
  const { username, token } = useAuth();
  const [mistakeCount, setMistakeCount] = useState<number>(0);

  useEffect(() => {
    const fetchMistakeCount = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/problems`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMistakeCount(response.data.length);
      } catch (error) {
        console.error('Error fetching mistake count:', error);
      }
    };

    fetchMistakeCount();
  }, [token]);

  return (
    <div className="main p-4">
      <h2 className="text-xl font-bold mb-3" style={{ textAlign: 'left' }}>ホーム</h2>
      <h1 className="header-title2 mb-6">
          <span>ようこそ、</span>
          <span className="text-primary-color">{username}</span>
          <span>さん</span>
      </h1>
      <div className="home-container">
        <div className="content-wrapper">
          <div className="today-quote mb-6 transform hover:scale-105 transition-transform duration-300">
            <QuoteDisplay />
          </div>
          <div className="direction mb-6">
            <div className="nav-grid">
              <button
                onClick={() => setActiveTab('list')}
                className="nav-link"
              >
                <ImLibrary className="nav-icon" />
                <span className="nav-text">間違い博物館</span>
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className="nav-link"
              >
                <FiPlusCircle className="nav-icon" />
                <span className="nav-text">問題を登録</span>
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className="nav-link"
              >
                <FiRepeat className="nav-icon" />
                <span className="nav-text">復習</span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className="nav-link"
              >
                <FiBarChart2 className="nav-icon" />
                <span className="nav-text">統計</span>
              </button>
            </div>
          </div>
          <div>
            <p className="text-base mb-2">今日までのミス数は<span className="count-number text-primary-color">{mistakeCount}</span>です。</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .main {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .home-container {
          width: 100%;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }

        .content-wrapper {
          width: 100%;
          padding: 0 0.5rem;
          box-sizing: border-box;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          width: 100%;
          box-sizing: border-box;
        }

        .nav-link {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: var(--card-background);
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
          min-height: 90px;
          width: 100%;
          box-sizing: border-box;
        }

        .nav-link:nth-child(1) {
          background: linear-gradient(135deg, #10b981, #3b82f6);
        }

        .nav-link:nth-child(2) {
          background: linear-gradient(135deg, #f472b6, #db2777);
        }

        .nav-link:nth-child(3) {
          background: linear-gradient(135deg, #f59e0b, #10b981);
        }

        .nav-link:nth-child(4) {
          background: linear-gradient(135deg, #60a5fa, #2563eb);
        }

        .nav-link:active {
          transform: scale(0.95);
        }

        .nav-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
          color: white;
        }

        .nav-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          text-align: center;
        }

        .count {
          background: linear-gradient(135deg, white, #f8f9ff);
          box-sizing: border-box;
          width: 100%;
        }

        .count-number {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color-1));
          -webkit-background-clip: text;
          color: transparent;
          padding: 0 0.25rem;
        }

        .today-quote {
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95));
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.1);
          padding: 1rem;
          width: 100%;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};

export default Home;