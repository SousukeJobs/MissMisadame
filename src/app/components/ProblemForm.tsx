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

type MistakeType = typeof MISTAKE_TYPES[number];

interface ProblemData {
  question: string;
  answer: string;
  mistake_reason: string;
  mistake_type: MistakeType;
}

export default function ProblemForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState<ProblemData>({
    question: '',
    answer: '',
    mistake_reason: '',
    mistake_type: '計算ミス'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Token:', token);
      console.log('Sending data to API:', formData);
      console.log('Request URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/problems`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        alert('問題が登録されました！');
        setFormData({
          question: '',
          answer: '',
          mistake_reason: '',
          mistake_type: '計算ミス'
        });
      } else {
        alert(`問題の登録に失敗しました。\nエラー: ${responseData.message || '不明なエラー'}`);
      }
    } catch (error: unknown) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      alert(`エラーが発生しました。\n${error instanceof Error ? error.message : '不明なエラー'}\nコンソールで詳細を確認してください。`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y">
      <div>
      <h2 className="text-2xl font-bold">問題を登録</h2>
        <label htmlFor="question" className="text-sm font-medium">
          問題文
        </label>
        <textarea
          id="question"
          className="input-field"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="answer" className="text-sm font-medium">
          正しい解答
        </label>
        <textarea
          id="answer"
          className="input-field"
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          required
          rows={2}
        />
      </div>

      <div>
        <label htmlFor="mistake_reason" className="text-sm font-medium">
          ミスした理由
        </label>
        <textarea
          id="mistake_reason"
          className="input-field"
          value={formData.mistake_reason}
          onChange={(e) => setFormData({ ...formData, mistake_reason: e.target.value })}
          required
          rows={2}
        />
      </div>

      <div>
        <label htmlFor="mistake_type" className="text-sm font-medium">
          ミスの種類
        </label>
        <select
          id="mistake_type"
          className="input-field"
          value={formData.mistake_type}
          onChange={(e) => setFormData({ ...formData, mistake_type: e.target.value as MistakeType })}
          required
        >
          {MISTAKE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          登録
        </button>
      </div>
    </form>
  );
} 