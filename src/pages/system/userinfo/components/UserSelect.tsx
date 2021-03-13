import React, { useState } from 'react';
import { Button, Modal, Select, Spin } from 'antd';
import { listUsersByName } from '@/services/system/QuietUser';
import multipleSelectTagRender from '@/utils/RenderUtils';

const { Option } = Select;

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
  const [fetchUsers, setFetchUsers] = useState<SystemEntities.QuietUser[] | undefined>([]);
  const [fetching, setFetching] = useState<boolean>(false);

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

  function findUserByName(name: string) {
    setFetching(true);
    listUsersByName(name).then((resp) => {
      setFetchUsers(resp.data);
      setFetching(false);
    });
  }

  function handleSelectedChange(value: any) {
    setSelectedUsers(value);
    setFetchUsers([]);
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
      <Select
        style={{ width: '100%' }}
        mode="multiple"
        labelInValue
        value={selectedUsers}
        tagRender={multipleSelectTagRender}
        placeholder="请输入用户名/昵称"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={findUserByName}
        onChange={handleSelectedChange}
        onBlur={() => setFetchUsers([])}
      >
        {fetchUsers?.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.nickname}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default UserSelect;
