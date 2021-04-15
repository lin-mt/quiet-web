import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { listUsersByName } from '@/services/system/QuietUser';
import multipleSelectTagRender from '@/utils/RenderUtils';
import { DebounceSelect } from '@/pages/components/DebounceSelect';

type UserSelectProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (value: any) => void;
  modalTitle?: string;
  okText?: string;
  cancelText?: string;
  afterAction?: () => void;
  handleSelectedUsersChange?: (value: any) => void;
};

const UserSelect: React.FC<UserSelectProps> = (props) => {
  const { visible, onCancel, onOk, modalTitle, okText, cancelText, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  async function handleSubmit() {
    setSubmitting(true);
    onOk(selectedUsers);
    if (afterAction) {
      afterAction();
    }
    setSubmitting(false);
  }

  function handleModalCancel() {
    onCancel();
  }

  async function findUserByName(name: string) {
    return listUsersByName(name).then((resp) => {
      return resp.data.map((user) => ({
        label: user.fullName,
        value: user.id,
      }));
    });
  }

  return (
    <Modal
      destroyOnClose
      width={600}
      title={modalTitle || '用户信息'}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key="cancel" onClick={() => handleModalCancel()}>
          {cancelText || '取消'}
        </Button>,
        <Button
          loading={submitting}
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
        >
          {okText || '确定'}
        </Button>,
      ]}
    >
      <DebounceSelect
        style={{ width: '100%' }}
        mode="multiple"
        value={selectedUsers}
        tagRender={multipleSelectTagRender}
        placeholder="请输入用户名/姓名"
        fetchOptions={findUserByName}
        onChange={(newValue) => setSelectedUsers(newValue)}
      />
    </Modal>
  );
};

export default UserSelect;
