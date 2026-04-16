import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ConfigProvider, theme, Layout, Card, Switch, Typography, Space } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import Wheel, { WheelHandle } from '../components/Wheel';
import OptionsPanel from '../components/OptionsPanel';
import ResultModal from '../components/ResultModal';
import { useLocalStorage } from '../hooks/useLocalStorage';

const { Header, Content } = Layout;
const { Title } = Typography;

const Index: React.FC = () => {
  const [options, setOptions] = useLocalStorage<string[]>('spin-wheel-options', []);
  const [isDark, setIsDark] = useLocalStorage<boolean>('spin-wheel-dark', false);
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
  }, []);

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

  // Trigger spin after modal closes and wheel re-renders
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
          colorPrimary: '#4F86F7',
          borderRadius: 10,
        },
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
          background: isDark ? '#141414' : '#f5f5f5',
        }}
        className={isDark ? 'dark' : ''}
      >
        <Header
          style={{
            background: isDark ? '#1f1f1f' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            height: 56,
            borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
          }}
        >
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>
            🎡 Decision Wheel
          </Title>
          <Space>
            <SunOutlined style={{ opacity: isDark ? 0.4 : 1 }} />
            <Switch
              checked={isDark}
              onChange={setIsDark}
              size="small"
            />
            <MoonOutlined style={{ opacity: isDark ? 1 : 0.4 }} />
          </Space>
        </Header>

        <Content style={{ padding: '20px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
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

            <div style={{ flex: '0 0 340px', width: '100%', maxWidth: 400 }}>
              <Card
                title={`Options (${options.length})`}
                styles={{
                  body: { padding: 16 },
                  header: { borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}` },
                }}
              >
                <OptionsPanel options={options} setOptions={setOptions} />
              </Card>
            </div>
          </div>
        </Content>

        <ResultModal
          open={showResult}
          result={result}
          onClose={() => setShowResult(false)}
          onSpinAgain={handleSpinAgain}
          onRemoveAndSpin={handleRemoveAndSpin}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default Index;
