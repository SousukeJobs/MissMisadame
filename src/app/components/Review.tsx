import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5001'; // バックエンドのベースURL

export default function Review() {
  const { getToken } = useAuth();
  const [currentProblem, setCurrentProblem] = useState<{
    id: number;
    question: string;
  } | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{
    is_correct: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomProblem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/problems/random`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '問題の取得に失敗しました');
      }
      
      const data = await response.json();
      setCurrentProblem(data);
      setAnswer('');
      setResult(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : '問題の取得に失敗しました');
      console.error('Error fetching random problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentProblem) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/problems/verify/${currentProblem.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '解答の検証に失敗しました');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : '解答の検証に失敗しました');
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">復習</h2>
        <button
          onClick={fetchRandomProblem}
          className="btn-primary"
          disabled={loading}
        >
          新しい問題を取得
        </button>
      </div>
      <br/>
      {currentProblem ? (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">問題</h3>
          <p className="text-lg mb-6">{currentProblem.question}</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium mb-2">
                解答
              </label>
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input-field"
                placeholder="解答を入力してください"
                disabled={loading || !!result}
              />
            </div>
            
            {!result && (
              <button
                onClick={submitAnswer}
                className="btn-primary w-full"
                disabled={loading || !answer.trim()}
              >
                解答を送信
              </button>
            )}
          </div>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.is_correct 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <p className="font-medium">{result.message}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          「新しい問題を取得」ボタンをクリックして復習を開始してください
        </div>
      )}
    </div>
  );
} 