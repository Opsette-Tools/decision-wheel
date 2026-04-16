import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Privacy: React.FC = () => {
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
        <Title level={4} style={{ margin: 0 }}>Privacy Policy</Title>
      </header>

      <div style={{ flex: 1, padding: '24px 16px' }}>
        <Typography>
          <Paragraph strong style={{ fontSize: 16 }}>Decision Wheel respects your privacy.</Paragraph>

          <Title level={5}>No Data Collection</Title>
          <Paragraph type="secondary">
            Decision Wheel runs entirely in your browser. We do not collect, store, or transmit any
            personal information. All interactions happen locally on your device.
          </Paragraph>

          <Title level={5}>No Cookies or Tracking</Title>
          <Paragraph type="secondary">
            We do not use cookies, analytics, or any third-party tracking services.
          </Paragraph>

          <Title level={5}>No Account Required</Title>
          <Paragraph type="secondary">
            There is no sign-up, no login, and no data stored on any server.
            Your options and preferences are stored locally in your browser and never shared with anyone.
          </Paragraph>

          <Title level={5}>Contact</Title>
          <Paragraph type="secondary">
            If you have questions about this policy, you can reach us through the app's repository.
          </Paragraph>
        </Typography>
      </div>
    </div>
  );
};

export default Privacy;
