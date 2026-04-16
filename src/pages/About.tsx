import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px', position: 'sticky', top: 0,
        background: 'inherit', zIndex: 10,
        borderBottom: '1px solid var(--border-color, #f0f0f0)',
      }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} />
        <Title level={4} style={{ margin: 0 }}>How to Use</Title>
      </header>

      <div style={{ flex: 1, padding: '24px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" fill="#6366F1" stroke="#4F46E5" strokeWidth="2"/>
            <path d="M32 2 A30 30 0 0 1 58.98 17L32 32Z" fill="#818CF8"/>
            <path d="M58.98 17 A30 30 0 0 1 58.98 47L32 32Z" fill="#A78BFA"/>
            <path d="M58.98 47 A30 30 0 0 1 32 62L32 32Z" fill="#C084FC"/>
            <path d="M32 62 A30 30 0 0 1 5.02 47L32 32Z" fill="#E879F9"/>
            <path d="M5.02 47 A30 30 0 0 1 5.02 17L32 32Z" fill="#8B5CF6"/>
            <path d="M5.02 17 A30 30 0 0 1 32 2L32 32Z" fill="#7C3AED"/>
            <circle cx="32" cy="32" r="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
          </svg>
        </div>

        <Typography>
          <Paragraph strong style={{ fontSize: 16, textAlign: 'center' }}>
            Make team decisions quickly and fairly — let the wheel decide.
          </Paragraph>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            <div>
              <Paragraph strong style={{ margin: 0 }}>1. Add your options</Paragraph>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Type each option into the input field and press Add. Use the Examples button for a quick start with sample choices.
              </Paragraph>
            </div>
            <div>
              <Paragraph strong style={{ margin: 0 }}>2. Spin the wheel</Paragraph>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Press the Spin button and watch the wheel choose for you. The result appears in a popup when it stops.
              </Paragraph>
            </div>
            <div>
              <Paragraph strong style={{ margin: 0 }}>3. Act on the result</Paragraph>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Choose to spin again, or remove the winner and spin again to narrow down choices through elimination rounds.
              </Paragraph>
            </div>
            <div>
              <Paragraph strong style={{ margin: 0 }}>4. Manage your list</Paragraph>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Edit, delete, shuffle, or clear options at any time. Your list is saved automatically in your browser.
              </Paragraph>
            </div>
          </div>

          <Paragraph type="secondary" style={{ textAlign: 'center', fontSize: 12, marginTop: 24 }}>
            All data stays in your browser — nothing is sent to any server.
          </Paragraph>

          <Paragraph type="secondary" style={{ textAlign: 'center', fontSize: 12, marginTop: 8 }}>
            A business tool from Opsette Marketplace. Find more tools at{' '}
            <a href="https://opsette.io" target="_blank" rel="noopener noreferrer">opsette.io</a>.
          </Paragraph>
        </Typography>
      </div>
    </div>
  );
};

export default About;
