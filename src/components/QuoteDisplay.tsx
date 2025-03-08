'use client';

import React, { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: '人間の最大の弱点は、諦めることである', author: 'トーマス・エジソン' },
  { text: '失敗は終わりではなく、より賢く始めるチャンスだ', author: 'ヘンリー・フォード' },
  { text: '過ちを改めざる、これを過ちという', author: '孔子' },
  { text: '成功とは、情熱を失わずに失敗を繰り返すことである', author: 'ウィンストン・チャーチル' },
  { text: 'ミスをしない人間は、新しいことに挑戦していない人間だ', author: 'アルベルト・アインシュタイン' },
  { text: '間違いを犯したと認めることは、知恵の始まりである', author: 'トーマス・エジソン' },
  { text: '人間の最大の弱点は、諦めることである', author: 'トーマス・エジソン' }, // 日曜日用
];

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<Quote>({ text: '', author: '' });

  useEffect(() => {
    const dayOfWeek = new Date().getDay();
    setQuote(quotes[dayOfWeek]);
  }, []);

  return (
    <div className="daily-quote">
      今日の格言：{quote.text}（{quote.author}）
    </div>
  );
};

export default QuoteDisplay; 