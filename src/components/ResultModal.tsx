import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ResultModalProps {
  open: boolean;
  result: string | null;
  winCount: number;
  onClose: () => void;
  onSpinAgain: () => void;
  onRemoveAndSpin: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ open, result, winCount, onClose, onSpinAgain, onRemoveAndSpin }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#10024;</div>
        <Text type="secondary" style={{ fontSize: 14 }}>The wheel has spoken!</Text>
        <Title level={2} style={{ margin: '12px 0 8px', color: '#6366F1' }}>{result}</Title>
        {winCount > 1 && (
          <Text type="secondary" style={{ fontSize: 13 }}>
            Won {winCount} time{winCount !== 1 ? 's' : ''}
          </Text>
        )}
        <div style={{ marginTop: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              size="large"
              block
              onClick={onSpinAgain}
            >
              Spin Again
            </Button>
            <Button
              icon={<DeleteOutlined />}
              size="large"
              block
              onClick={onRemoveAndSpin}
            >
              Remove &amp; Spin Again
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ResultModal;
