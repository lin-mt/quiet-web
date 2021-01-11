import React, { useState } from 'react';
import { Button, Modal, Select, Spin, Tag } from 'antd';
import { listUsersByUsername } from '@/services/system/QuietUser';
import type { CustomTagProps } from 'rc-select/lib/interface/generator';

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

  function findUserByUserName(username: string) {
    setFetching(true);
    listUsersByUsername(username).then((resp) => {
      setFetchUsers(resp.data);
      setFetching(false);
    });
  }

  function handleSelectedChange(value: any) {
    setSelectedUsers(value);
    setFetchUsers([]);
  }

  function tagRender(tagProps: CustomTagProps) {
    const { label, closable, onClose } = tagProps;
    return (
      <Tag color={'#108EE9'} closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
  }

  return (
    <Modal
      destroyOnClose
      width={600}
      title={modalTitle || '用户信息'}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key="back" onClick={() => handleModalCancel()}>
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
        tagRender={tagRender}
        placeholder="请输入用户名"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={findUserByUserName}
        onChange={handleSelectedChange}
        onBlur={() => setFetchUsers([])}
      >
        {fetchUsers?.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.username}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default UserSelect;
