import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ConfigProvider, theme, Layout, Card, Switch, Typography, Space } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Wheel, { WheelHandle } from '../components/Wheel';
import OptionsPanel from '../components/OptionsPanel';
import ResultModal from '../components/ResultModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ShareAppButton } from '@/components/opsette-share';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useLocalStorage<string[]>('spin-wheel-options', []);
  const [isDark, setIsDark] = useLocalStorage<boolean>('spin-wheel-dark', false);
  const [winCounts, setWinCounts] = useLocalStorage<Record<string, number>>('spin-wheel-wins', {});
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [pendingSpin, setPendingSpin] = useState(false);
  const wheelRef = useRef<WheelHandle>(null);

  const handleSpinEnd = useCallback((winner: string, index: number) => {
    setResult(winner);
    setResultIndex(index);
    setShowResult(true);
    setWinCounts(prev => ({ ...prev, [winner]: (prev[winner] || 0) + 1 }));
  }, [setWinCounts]);

  const handleSpinAgain = () => {
    setShowResult(false);
    setPendingSpin(true);
  };

  const handleRemoveAndSpin = () => {
    if (resultIndex !== null) {
      setOptions(options.filter((_, i) => i !== resultIndex));
    }
    setShowResult(false);
    setPendingSpin(true);
  };

  const handleClearCounts = () => {
    setWinCounts({});
  };

  useEffect(() => {
    if (pendingSpin && !showResult && !spinning) {
      const timer = setTimeout(() => {
        wheelRef.current?.triggerSpin();
        setPendingSpin(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingSpin, showResult, spinning]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366F1',
          borderRadius: 8,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
          background: isDark ? '#0F172A' : '#F8FAFC',
        }}
        className={isDark ? 'dark' : ''}
      >
        <Header
          style={{
            background: isDark ? '#1E293B' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            height: 56,
            borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" fill="#6366F1" stroke="#4F46E5" strokeWidth="2"/>
                <path d="M32 2 A30 30 0 0 1 58.98 17L32 32Z" fill="#818CF8"/>
                <path d="M58.98 17 A30 30 0 0 1 58.98 47L32 32Z" fill="#A78BFA"/>
                <path d="M58.98 47 A30 30 0 0 1 32 62L32 32Z" fill="#C084FC"/>
                <path d="M32 62 A30 30 0 0 1 5.02 47L32 32Z" fill="#E879F9"/>
                <path d="M5.02 47 A30 30 0 0 1 5.02 17L32 32Z" fill="#8B5CF6"/>
                <path d="M5.02 17 A30 30 0 0 1 32 2L32 32Z" fill="#7C3AED"/>
                <circle cx="32" cy="32" r="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
              </svg>
              <Title level={4} style={{ margin: 0, fontSize: 18, letterSpacing: '-0.01em' }}>
                Decision Wheel
              </Title>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SunOutlined style={{ opacity: isDark ? 0.4 : 1, fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' }} />
              <Switch
                checked={isDark}
                onChange={setIsDark}
                size="small"
              />
              <MoonOutlined style={{ opacity: isDark ? 1 : 0.4, fontSize: 13, color: isDark ? '#C4B5FD' : '#94A3B8' }} />
            </div>

            <ShareAppButton size={32} />
          </div>
        </Header>

        <Content style={{ padding: '24px 16px', maxWidth: 960, margin: '0 auto', width: '100%', flex: 1 }}>
          <div
            className="app-layout"
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center' }}>
              <Wheel
                ref={wheelRef}
                options={options}
                onSpinEnd={handleSpinEnd}
                spinning={spinning}
                setSpinning={setSpinning}
                isDark={isDark}
              />
            </div>

            <div className="options-panel" style={{ flex: '0 0 340px', maxWidth: 400 }}>
              <Card
                title={`Options (${options.length})`}
                styles={{
                  body: { padding: 16 },
                  header: { borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` },
                }}
              >
                <OptionsPanel
                  options={options}
                  setOptions={setOptions}
                  winCounts={winCounts}
                  onClearCounts={handleClearCounts}
                />
              </Card>
            </div>
          </div>
        </Content>

        <Footer style={{
          textAlign: 'center',
          padding: '16px 20px',
          background: 'transparent',
          fontSize: 13,
          color: isDark ? '#64748B' : '#94A3B8',
        }}>
          <Space split={<span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>&middot;</span>}>
            <button
              onClick={() => navigate('/about')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'inherit', fontSize: 'inherit', padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#C4B5FD' : '#6366F1')}
              onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
            >
              How to Use
            </button>
            <button
              onClick={() => navigate('/privacy')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'inherit', fontSize: 'inherit', padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#C4B5FD' : '#6366F1')}
              onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
            >
              Privacy
            </button>
            <span>
              By{' '}
              <a
                href="https://opsette.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
                onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#C4B5FD' : '#6366F1')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
              >
                Opsette
              </a>
            </span>
          </Space>
        </Footer>

        <ResultModal
          open={showResult}
          result={result}
          winCount={result ? (winCounts[result] || 0) : 0}
          onClose={() => setShowResult(false)}
          onSpinAgain={handleSpinAgain}
          onRemoveAndSpin={handleRemoveAndSpin}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default Index;
