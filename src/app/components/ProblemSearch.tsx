'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MISTAKE_TYPES = [
  '計算ミス',
  '符号の間違い',
  '問題の読み間違い',
  '解法の誤り',
  '単位の間違い',
  'その他'
] as const;

interface SearchParams {
  query: string;
  mistake_type: string;
  sort_by: 'created_at';
  order: 'asc' | 'desc';
}

interface Problem {
  id: number;
  question: string;
  answer: string;
  mistake_reason: string;
  mistake_type: string;
  created_at: string;
}

export default function ProblemSearch() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    mistake_type: '',
    sort_by: 'created_at',
    order: 'desc'
  });
  const [problems, setProblems] = useState<Problem[]>([]);
  const [message, setMessage] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      const queryParams = new URLSearchParams({
        ...searchParams,
        query: searchParams.query.trim()
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/problems/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProblems(data);
        setMessage(data.length === 0 ? '問題が見つかりませんでした' : '');
      } else {
        const error = await response.json();
        setMessage(error.message || '検索中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('検索中にエラーが発生しました');
    }
  };

  return (
    <div className="space-y">
      <h2 className="text-2xl font-bold">検索</h2>
      <form onSubmit={handleSearch} className="space-y">
        <div>
          <label htmlFor="query" className="text-sm font-medium">
            検索キーワード
          </label>
          <input
            type="text"
            id="query"
            className="input-field"
            value={searchParams.query}
            onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
            placeholder="問題文、解答、ミスの理由で検索"
          />
        </div>

        <div>
          <label htmlFor="mistake_type" className="text-sm font-medium">
            ミスの種類
          </label>
          <select
            id="mistake_type"
            className="input-field"
            value={searchParams.mistake_type}
            onChange={(e) => setSearchParams({ ...searchParams, mistake_type: e.target.value })}
          >
            <option value="">すべて</option>
            {MISTAKE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order" className="text-sm font-medium">
            並び順
          </label>
          <select
            id="order"
            className="input-field"
            value={searchParams.order}
            onChange={(e) => setSearchParams({ ...searchParams, order: e.target.value as 'asc' | 'desc' })}
          >
            <option value="desc">新しい順</option>
            <option value="asc">古い順</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          検索
        </button>
      </form>

      {message && (
        <div className="alert">
          {message}
        </div>
      )}

      <div className="space-y">
        {problems.map((problem) => (
          <div key={problem.id} className="card">
            <div>
              <h3 className="text-lg font-medium">{problem.question}</h3>
              <p className="text-sm text-gray-600">
                ミスの種類: {problem.mistake_type}
              </p>
              <p className="text-sm text-gray-600">
                作成日時: {new Date(problem.created_at).toLocaleString('ja-JP')}
              </p>
            </div>
            <div className="mt-2">
              <p><strong>解答:</strong> {problem.answer}</p>
              <p><strong>ミスの理由:</strong> {problem.mistake_reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 