import React from 'react';
import { Button, Modal } from 'antd';

interface UserFormProps {
  modalVisible: boolean;
  type: 'create' | 'update';
  onCancel: () => void;
  onSubmit: () => void;
}

const UserForm: React.FC<UserFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit, type } = props;
  return (
    <Modal
      destroyOnClose
      width={900}
      title={type === 'create' ? '创建用户' : '更新用户信息'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={[
        <Button key="back" onClick={() => onCancel()}>
          取消
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={() => onSubmit()}>
          {type === 'create' ? '保存' : '更新'}
        </Button>,
      ]}
    >
      {props.children}
    </Modal>
  );
};

export default UserForm;
