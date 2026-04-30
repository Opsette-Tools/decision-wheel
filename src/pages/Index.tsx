import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ConfigProvider, theme, Layout, Card, Switch, Space } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Wheel, { WheelHandle } from '../components/Wheel';
import OptionsPanel from '../components/OptionsPanel';
import ResultModal from '../components/ResultModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { OpsetteHeader } from '@/components/opsette-header';

const { Content, Footer } = Layout;

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

  const headerExtras = (
    <>
      <SunOutlined
        style={{
          opacity: isDark ? 0.4 : 1,
          fontSize: 13,
          color: isDark ? '#94A3B8' : '#64748B',
        }}
      />
      <Switch checked={isDark} onChange={setIsDark} size="small" />
      <MoonOutlined
        style={{
          opacity: isDark ? 1 : 0.4,
          fontSize: 13,
          color: isDark ? '#C4B5FD' : '#94A3B8',
        }}
      />
    </>
  );

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
          background: isDark ? '#000' : '#f5f5f5',
        }}
        className={isDark ? 'dark' : ''}
      >
        <OpsetteHeader theme={isDark ? 'dark' : 'light'} rightExtra={headerExtras} />

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
                  header: { borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}` },
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
