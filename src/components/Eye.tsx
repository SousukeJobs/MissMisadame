'use client';

import React, { useEffect, useState, useRef } from 'react';

const Eye = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getEyePosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    const rect = eyeRef.current.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;

    const deltaX = mousePos.x - eyeX;
    const deltaY = mousePos.y - eyeY;
    
    // 目の動きの最大範囲（ピクセル）
    const maxMove = 4;
    
    // 距離に基づいて移動量を計算
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const scale = Math.min(maxMove / Math.max(distance, maxMove), 1);
    
    return {
      x: deltaX * scale,
      y: deltaY * scale
    };
  };

  const position = getEyePosition();

  return (
    <div className="eye" ref={eyeRef}>
      <div 
        className="pupil" 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`
        }} 
      />
    </div>
  );
};

export default Eye; 