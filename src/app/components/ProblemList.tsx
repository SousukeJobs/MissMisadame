'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Problem {
  id: number;
  question: string;
  answer: string;
  mistake_reason: string;
  mistake_type: string;
  created_at: string;
}

export default function ProblemList() {
  const { token } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  useEffect(() => {
    fetchProblems();
  }, [token]);

  const fetchProblems = async () => {
    try {
      const currentToken = token;
      if (!currentToken) {
        console.error('トークンがありません');
        setProblems([]);
        return;
      }

      console.log('Token:', currentToken);
      console.log('Request URL:', 'http://localhost:5001/api/problems');
      
      const response = await fetch('http://localhost:5001/api/problems', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.status === 401) {
        console.error('認証エラー: トークンが無効または期限切れです');
        setProblems([]);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('APIエラー:', errorData);
        setProblems([]);
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // レスポンスデータの形式をチェック
      if (Array.isArray(data)) {
        setProblems(data);
      } else if (data.problems && Array.isArray(data.problems)) {
        setProblems(data.problems);
      } else {
        console.error('予期しないレスポンス形式:', data);
        setProblems([]);
      }
    } catch (error: unknown) {
      console.error('Error fetching problems:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      setProblems([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この問題を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/problems/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProblems(problems.filter(p => p.id !== id));
        if (selectedProblem?.id === id) {
          setSelectedProblem(null);
        }
      }
    } catch (error: unknown) {
      console.error('Error deleting problem:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="space-y">
      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="space-y">
          <h2 className="font-semibold" style={{ fontSize: '1.125rem' }}>問題一覧</h2>
          <div className="space-y">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selectedProblem?.id === problem.id ? '2px solid var(--primary-color)' : 'none'
                }}
                onClick={() => setSelectedProblem(problem)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p className="font-medium" style={{ marginBottom: '0.5rem' }}>{problem.question}</p>
                    <p className="text-sm text-gray">
                      ミスの種類: {problem.mistake_type}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(problem.id);
                    }}
                    className="delete-btn"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y">
          <h2 className="font-semibold" style={{ fontSize: '1.125rem' }}>問題の詳細</h2>
          {selectedProblem ? (
            <div className="card space-y">
              <div>
                <h3 className="text-sm font-medium">問題文</h3>
                <p style={{ marginTop: '0.25rem' }}>{selectedProblem.question}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">解答</h3>
                <p style={{ marginTop: '0.25rem' }}>{selectedProblem.answer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">ミスした理由</h3>
                <p style={{ marginTop: '0.25rem' }}>{selectedProblem.mistake_reason}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">ミスの種類</h3>
                <p style={{ marginTop: '0.25rem' }}>{selectedProblem.mistake_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">登録日時</h3>
                <p style={{ marginTop: '0.25rem' }}>
                  {new Date(selectedProblem.created_at).toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <p className="text-gray">問題を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 