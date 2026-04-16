import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

const COLORS = [
  '#4F86F7', '#FF6B6B', '#51CF66', '#CC5DE8', '#FF922B',
  '#20C997', '#F06595', '#FCC419', '#339AF0', '#FF8787',
  '#69DB7C', '#DA77F2', '#FFA94D', '#38D9A9', '#E599F7',
  '#FFD43B', '#74C0FC', '#FF6B6B', '#8CE99A', '#B197FC',
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

      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(10, Math.min(16, 200 / options.length))}px -apple-system, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      const maxLen = r - 20;
      let text = opt;
      if (ctx.measureText(text).width > maxLen - 10) {
        while (ctx.measureText(text + '…').width > maxLen - 10 && text.length > 1) {
          text = text.slice(0, -1);
        }
        text += '…';
      }
      ctx.fillText(text, r - 14, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(18, r * 0.1), 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#1f1f1f' : '#fff';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#444' : '#ddd';
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
        <div className="wheel-pointer">▼</div>
        <canvas
          ref={canvasRef}
          className="wheel-canvas"
          style={{
            transform: `rotate(${rotation}deg)`,
            borderRadius: '50%',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.5)'
              : '0 8px 32px rgba(0,0,0,0.12)',
          }}
        />
      </div>
      <button
        onClick={spin}
        disabled={spinning || options.length < 2}
        style={{
          padding: '14px 56px',
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 12,
          border: 'none',
          cursor: spinning || options.length < 2 ? 'not-allowed' : 'pointer',
          background: spinning ? '#999' : 'linear-gradient(135deg, #4F86F7, #339AF0)',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(79,134,247,0.3)',
          transition: 'all 0.2s',
          opacity: options.length < 2 ? 0.5 : 1,
        }}
      >
        {spinning ? 'Spinning…' : '🎯 Spin'}
      </button>
    </div>
  );
});

export default Wheel;
