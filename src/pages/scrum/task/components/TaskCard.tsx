import type { ScrumTask } from '@/services/scrum/EntitiyType';
import { Card, Col, Menu, Row } from 'antd';
import { AlignCenterOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import styled from 'styled-components';
import type { CSSProperties } from 'react';

interface TaskCardProps {
  task: ScrumTask;
  taskTypeLabels: Record<string, string>;
  executorName: string;
  cardStyle?: CSSProperties;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const CustomStyleCard = styled(Card)`
  font-size: 12px;
  border-width: 1px 1px 1px 9px;
  border-style: solid;
  border-color: lightgray;
  border-radius: 3px;
  border-image: initial;
  transition: box-shadow 0.3s, border-color 0.3s;
  &:hover {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
      0 5px 12px 4px rgba(0, 0, 0, 0.09);
  }
`;

const OperationContainer = styled.div`
  width: 100%;
  text-align: center;
  &:hover {
    background-color: #f1f4f5;
    cursor: pointer;
  }
`;

export default ({
  task,
  taskTypeLabels,
  executorName,
  cardStyle,
  onEditClick,
  onDeleteClick,
}: TaskCardProps) => {
  const showOperation: boolean = !!onEditClick || !!onDeleteClick;
  // noinspection DuplicatedCode
  return (
    <CustomStyleCard style={cardStyle} size={'small'} bodyStyle={{ padding: '9px' }}>
      <Row>
        <Col span={22}>
          <div>标题：{task.title}</div>
          <div>类型：{taskTypeLabels[task.type]}</div>
          <div>执行者：{executorName}</div>
        </Col>
        {showOperation && (
          <Col span={2}>
            <Dropdown
              placement={'bottomCenter'}
              trigger={['click']}
              overlay={() => {
                return (
                  <Menu>
                    {onEditClick && (
                      <Menu.Item
                        key="edit"
                        icon={<EditOutlined />}
                        style={{ fontSize: 'smaller', color: '#1890ff' }}
                        onClick={() => {
                          onEditClick();
                        }}
                      >
                        编辑
                      </Menu.Item>
                    )}
                    {onDeleteClick && (
                      <Menu.Item
                        key="delete"
                        icon={<DeleteOutlined />}
                        style={{ fontSize: 'smaller', color: 'red' }}
                        onClick={() => {
                          onDeleteClick();
                        }}
                      >
                        删除
                      </Menu.Item>
                    )}
                  </Menu>
                );
              }}
            >
              <OperationContainer>
                <a onClick={(e) => e.preventDefault()}>
                  <AlignCenterOutlined />
                </a>
              </OperationContainer>
            </Dropdown>
          </Col>
        )}
      </Row>
    </CustomStyleCard>
  );
};
