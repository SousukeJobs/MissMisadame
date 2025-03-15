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

interface ProblemModalProps {
  problem: Problem;
  onClose: () => void;
}



const ProblemModal = ({ problem, onClose }: ProblemModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">問題の詳細</h3>
        <div className="modal-body">
          <div className="modal-field">
            <h4>問題文</h4>
            <p>{problem.question}</p>
          </div>
          <div className="modal-field">
            <h4>解答</h4>
            <p>{problem.answer}</p>
          </div>
          <div className="modal-field">
            <h4>ミスした理由</h4>
            <p>{problem.mistake_reason}</p>
          </div>
          <div className="modal-field">
            <h4>ミスの種類</h4>
            <p>{problem.mistake_type}</p>
          </div>
          <div className="modal-field">
            <h4>登録日時</h4>
            <p>{new Date(problem.created_at).toLocaleString('ja-JP')}</p>
          </div>
        </div>
        <button onClick={onClose} className="modal-close">
          閉じる
        </button>
      </div>
    </div>
  );
};

export default function ProblemList() {
  const { token } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 9;

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/problems`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

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
      setProblems([]);
    }
  };


  
  const handleDelete = async (id: number) => {
    if (!confirm('この問題を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/problems/${id}`, {
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

  // ページネーション用の計算
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(problems.length / problemsPerPage);

  return (
    <div className="container">
      <h2 className="text-2xl font-bold">間違い博物館</h2>
      <div className="problem-grid">
        {currentProblems.map((problem) => (
          <div key={problem.id} className="problem-card">
            <h3 className="problem-title">{problem.question}</h3>
            <div className="problem-info">
              <p className="problem-type">
                ミスの種類: {problem.mistake_type}
              </p>
              <p className="problem-date">
                {new Date(problem.created_at).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="problem-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(problem.id);
                }}
                className="delete-button"
              >
                削除
              </button>
              <button
                onClick={() => setSelectedProblem(problem)}
                className="view-button"
              >
                詳細
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          前へ
        </button>
        <span className="pagination-info">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          次へ
        </button>
      </div>

      {/* モーダル */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
} 