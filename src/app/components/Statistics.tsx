'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StatData {
  mistake_type: string;
  count: number;
}

export default function Statistics() {
  const { token } = useAuth();
  const [stats, setStats] = useState<StatData[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, [token]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'APIエラーが発生しました');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className="space-y">
      <h2 className="font-semibold" style={{ fontSize: '1.125rem' }}>ミスの種類別統計</h2>
      <div className="card" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mistake_type"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="var(--primary-color)" name="回数" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="card">
        <h3 className="font-semibold" style={{ fontSize: '1rem', marginBottom: '1rem' }}>詳細データ</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ミスの種類</th>
                <th>回数</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.mistake_type}>
                  <td>{stat.mistake_type}</td>
                  <td>{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 