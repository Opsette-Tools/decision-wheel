import React, { useState } from 'react';
import { Input, Button, List, Popconfirm, Typography, Space, message, Empty, Tag, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  RetweetOutlined,
  UndoOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const COLORS = [
  '#6366F1', '#0EA5E9', '#8B5CF6', '#14B8A6', '#F59E0B',
  '#EC4899', '#10B981', '#F97316', '#06B6D4', '#A855F7',
  '#3B82F6', '#EF4444', '#84CC16', '#D946EF', '#0284C7',
  '#7C3AED', '#059669', '#E11D48', '#2563EB', '#9333EA',
];

const EXAMPLES = [
  'Strategy A',
  'Strategy B',
  'Option Alpha',
  'Option Beta',
  'Plan 1',
  'Plan 2',
  'Proposal X',
  'Proposal Y',
];

interface OptionsPanelProps {
  options: string[];
  setOptions: (options: string[]) => void;
  winCounts: Record<string, number>;
  onClearCounts: () => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, setOptions, winCounts, onClearCounts }) => {
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const totalWins = Object.values(winCounts).reduce((s, c) => s + c, 0);

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
          placeholder="Add an option..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={addOption}
          size="large"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={addOption} size="large">
          Add
        </Button>
      </Space.Compact>

      <Space style={{ marginBottom: 16 }}>
        <Tooltip title="Load examples">
          <Button icon={<StarOutlined />} onClick={loadExamples} size="small" />
        </Tooltip>
        <Tooltip title="Shuffle">
          <Button icon={<RetweetOutlined />} onClick={shuffle} size="small" disabled={options.length < 2} />
        </Tooltip>
        <Popconfirm
          title="Clear all options?"
          onConfirm={() => {
            setOptions([]);
            message.info('Cleared');
          }}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Clear all">
            <Button icon={<ClearOutlined />} danger size="small" disabled={options.length === 0} />
          </Tooltip>
        </Popconfirm>
        {totalWins > 0 && (
          <Popconfirm
            title="Reset all win counts?"
            onConfirm={onClearCounts}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Reset counts">
              <Button icon={<UndoOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        )}
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
                        style={{ color: '#10B981' }}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: COLORS[index % COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <Text ellipsis style={{ flex: 1, minWidth: 0 }}>{item}</Text>
                  {(winCounts[item] || 0) > 0 && (
                    <Tag
                      color="purple"
                      style={{ marginInlineEnd: 0, fontSize: 11, lineHeight: '18px', padding: '0 6px' }}
                    >
                      {winCounts[item]}
                    </Tag>
                  )}
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
