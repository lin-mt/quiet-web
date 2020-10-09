import React from 'react';
import { Modal } from 'antd';

interface UserFormProps {
  modalVisible: boolean;
  type: 'create' | 'update';
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = (props) => {
  const { modalVisible, onCancel, type } = props;
  return (
    <Modal
      destroyOnClose
      title={type === 'create' ? '创建用户' : '更新用户信息'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default UserForm;
