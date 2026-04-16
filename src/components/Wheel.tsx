import React, { useRef, useEffect, useState, useCallback } from 'react';

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

const Wheel: React.FC<WheelProps> = ({ options, onSpinEnd, spinning, setSpinning, isDark }) => {
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

      // border between segments
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // text
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

    // center circle
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
      // Determine winner: pointer is at top (270° in standard canvas coords)
      // The wheel rotates clockwise via CSS transform
      const normalizedAngle = ((newRotation % 360) + 360) % 360;
      const segDeg = 360 / options.length;
      // pointer at top = 0° of rotation display, segments start at right (0°/3 o'clock on canvas)
      // CSS rotation: segment at top corresponds to (360 - normalizedAngle) mod 360 from canvas 0°
      // But pointer is at top, so we need the segment at (270° - normalizedAngle) in canvas terms
      // Simpler: after rotation R degrees clockwise, the segment under the top pointer is:
      // Pointer is at top (270° in canvas coords). After clockwise rotation R,
      // the canvas angle under the pointer is (270 - R).
      const canvasAngle = ((270 - normalizedAngle) % 360 + 360) % 360;
      const idx = Math.floor(canvasAngle / segDeg) % options.length;
      onSpinEnd(options[idx], idx);
      setSpinning(false);
    }, 4200);
  }, [spinning, options, rotation, onSpinEnd, setSpinning]);

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
};

export default Wheel;
