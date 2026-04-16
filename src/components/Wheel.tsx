import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

// Elegant, muted palette — professional but distinct
const COLORS = [
  '#6366F1', // Indigo
  '#0EA5E9', // Sky blue
  '#8B5CF6', // Violet
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#A855F7', // Purple
  '#3B82F6', // Blue
  '#EF4444', // Red (muted)
  '#84CC16', // Lime
  '#D946EF', // Fuchsia
  '#0284C7', // Dark sky
  '#7C3AED', // Deep violet
  '#059669', // Deep emerald
  '#E11D48', // Rose
  '#2563EB', // Royal blue
  '#9333EA', // Deep purple
];

interface WheelProps {
  options: string[];
  onSpinEnd: (result: string, index: number) => void;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
  isDark: boolean;
}

export interface WheelHandle {
  triggerSpin: () => void;
}

const Wheel = forwardRef<WheelHandle, WheelProps>(({ options, onSpinEnd, spinning, setSpinning, isDark }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(320);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      setSize(Math.min(w < 768 ? w - 48 : 380, 420));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || options.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    const segAngle = (2 * Math.PI) / options.length;

    options.forEach((opt, i) => {
      const startAngle = i * segAngle;
      const endAngle = startAngle + segAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${Math.max(10, Math.min(15, 200 / options.length))}px Inter, -apple-system, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;
      const maxLen = r - 20;
      let text = opt;
      if (ctx.measureText(text).width > maxLen - 10) {
        while (ctx.measureText(text + '...').width > maxLen - 10 && text.length > 1) {
          text = text.slice(0, -1);
        }
        text += '...';
      }
      ctx.fillText(text, r - 14, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(18, r * 0.1), 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#1E1B4B' : '#fff';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#4338CA' : '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [options, size, isDark]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (spinning || options.length < 2) return;
    setSpinning(true);

    const extraSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraSpins * 360 + randomAngle;
    setRotation(newRotation);

    setTimeout(() => {
      const normalizedAngle = ((newRotation % 360) + 360) % 360;
      const segDeg = 360 / options.length;
      const canvasAngle = ((270 - normalizedAngle) % 360 + 360) % 360;
      const idx = Math.floor(canvasAngle / segDeg) % options.length;
      onSpinEnd(options[idx], idx);
      setSpinning(false);
    }, 4200);
  }, [spinning, options, rotation, onSpinEnd, setSpinning]);

  useImperativeHandle(ref, () => ({
    triggerSpin: spin,
  }), [spin]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div ref={containerRef} className="wheel-container">
        <div className="wheel-pointer">&#9660;</div>
        <canvas
          ref={canvasRef}
          className="wheel-canvas"
          style={{
            transform: `rotate(${rotation}deg)`,
            borderRadius: '50%',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 3px rgba(99,102,241,0.3)'
              : '0 8px 32px rgba(0,0,0,0.10), 0 0 0 3px rgba(99,102,241,0.15)',
          }}
        />
      </div>
      <button
        onClick={spin}
        disabled={spinning || options.length < 2}
        className="spin-button"
        style={{
          padding: '14px 56px',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.02em',
          borderRadius: 10,
          border: 'none',
          cursor: spinning || options.length < 2 ? 'not-allowed' : 'pointer',
          background: spinning ? '#94A3B8' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          color: '#fff',
          boxShadow: spinning ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
          transition: 'all 0.2s',
          opacity: options.length < 2 ? 0.5 : 1,
        }}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
});

export default Wheel;
