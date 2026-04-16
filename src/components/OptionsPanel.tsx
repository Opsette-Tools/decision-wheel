import React, { useState } from 'react';
import { Input, Button, List, Popconfirm, Typography, Space, message, Empty } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  RetweetOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const EXAMPLES = ['Pizza', 'Sushi', 'Tacos', 'Burgers', 'Pasta', 'Salad', 'Ramen', 'Curry'];

interface OptionsPanelProps {
  options: string[];
  setOptions: (options: string[]) => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, setOptions }) => {
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const addOption = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (options.some((o) => o.toLowerCase() === trimmed.toLowerCase())) {
      message.warning('Duplicate option');
      return;
    }
    setOptions([...options, trimmed]);
    setInput('');
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(options[index]);
  };

  const confirmEdit = () => {
    if (editIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      message.warning('Option cannot be empty');
      return;
    }
    if (options.some((o, i) => i !== editIndex && o.toLowerCase() === trimmed.toLowerCase())) {
      message.warning('Duplicate option');
      return;
    }
    const newOptions = [...options];
    newOptions[editIndex] = trimmed;
    setOptions(newOptions);
    setEditIndex(null);
  };

  const loadExamples = () => {
    setOptions([...EXAMPLES]);
    message.success('Examples loaded');
  };

  const shuffle = () => {
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  };

  return (
    <div>
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input
          placeholder="Add an option…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={addOption}
          size="large"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={addOption} size="large">
          Add
        </Button>
      </Space.Compact>

      <Space wrap style={{ marginBottom: 16 }}>
        <Button icon={<ThunderboltOutlined />} onClick={loadExamples} size="small">
          Examples
        </Button>
        <Button icon={<RetweetOutlined />} onClick={shuffle} size="small" disabled={options.length < 2}>
          Shuffle
        </Button>
        <Popconfirm
          title="Clear all options?"
          onConfirm={() => {
            setOptions([]);
            message.info('Cleared');
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<ClearOutlined />} danger size="small" disabled={options.length === 0}>
            Clear All
          </Button>
        </Popconfirm>
      </Space>

      {options.length === 0 ? (
        <Empty description="No options yet" style={{ padding: '32px 0' }}>
          <Text type="secondary">Add at least 2 options to spin</Text>
        </Empty>
      ) : (
        <List
          size="small"
          dataSource={options}
          renderItem={(item, index) => (
            <List.Item
              style={{ padding: '6px 0', border: 'none' }}
              actions={
                editIndex === index
                  ? [
                      <Button
                        key="ok"
                        type="text"
                        icon={<CheckOutlined />}
                        onClick={confirmEdit}
                        style={{ color: '#52c41a' }}
                      />,
                      <Button
                        key="cancel"
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setEditIndex(null)}
                      />,
                    ]
                  : [
                      <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => startEdit(index)}
                      />,
                      <Button
                        key="del"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeOption(index)}
                      />,
                    ]
              }
            >
              {editIndex === index ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onPressEnter={confirmEdit}
                  size="small"
                  autoFocus
                  style={{ maxWidth: 200 }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: [
                        '#4F86F7', '#FF6B6B', '#51CF66', '#CC5DE8', '#FF922B',
                        '#20C997', '#F06595', '#FCC419', '#339AF0', '#FF8787',
                        '#69DB7C', '#DA77F2', '#FFA94D', '#38D9A9', '#E599F7',
                        '#FFD43B', '#74C0FC', '#FF6B6B', '#8CE99A', '#B197FC',
                      ][index % 20],
                      flexShrink: 0,
                    }}
                  />
                  <Text>{item}</Text>
                </div>
              )}
            </List.Item>
          )}
        />
      )}

      {options.length === 1 && (
        <Text type="warning" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
          Add at least one more option to spin
        </Text>
      )}
    </div>
  );
};

export default OptionsPanel;
