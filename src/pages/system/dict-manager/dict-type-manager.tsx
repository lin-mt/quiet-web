import React, { useEffect, useState } from 'react';
import {
  Card,
  PaginationProps,
  Button,
  Spin,
  Table,
  Modal,
} from '@arco-design/web-react';
import DictTypeSearchForm from '@/pages/system/dict-manager/dict-type-search-form';
import { enabled } from '@/utils/render';
import styles from './style/index.module.less';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { IconPlus } from '@arco-design/web-react/icon';
import {
  deleteDictType,
  pageDictType,
  saveDictType,
  updateDictType,
} from '@/service/system/quiet-dict-type';
import { QuietDictType } from '@/service/system/type';
import DictTypeForm, { DictTypeFormProps } from '@/components/DictTypeForm';

export type DictTypeManagerProps = {
  title?: string;
  visible?: boolean;
  okText?: string;
  onOk?: () => void;
  cancelText?: string;
  onCancel?: () => void;
};

function DictTypeManager(props: DictTypeManagerProps) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const [dictTypeFormProps, setDictTypeFormProps] = useState<DictTypeFormProps>(
    {
      visible: false,
    }
  );

  useEffect(() => {
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    setLoading(true);
    pageDictType({
      current: pagination.current,
      page_size: pagination.pageSize,
      ...formParams,
    })
      .then((res) => {
        setData(res.content);
        setPagination((pre) => ({ ...pre, total: res.total_elements }));
      })
      .finally(() => setLoading(false));
  }

  function onChangeTable({ current, pageSize }) {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPagination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const columns: ColumnProps<QuietDictType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 180,
    },
    {
      title: '服务ID',
      dataIndex: 'service_id',
      width: 180,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 130,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 60,
      render: (val) => enabled(val),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 300,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <div className={styles.operations}>
          <Button
            type="text"
            size="small"
            onClick={() =>
              setDictTypeFormProps({
                title: '更新字典类型',
                visible: true,
                formValues: record,
                onOk: async (values) => {
                  return await updateDictType(values).then(() => {
                    fetchData();
                    setDictTypeFormProps({ visible: false });
                  });
                },
                onCancel: () => setDictTypeFormProps({ visible: false }),
              })
            }
          >
            修改
          </Button>
          <Button
            type="text"
            status="danger"
            size="small"
            onClick={() =>
              Modal.confirm({
                title: `确认删除字典类型 ${record.name} 吗？`,
                onOk: () => deleteDictType(record.id).then(() => fetchData()),
              })
            }
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      footer={null}
      escToExit
      style={{ width: '90%' }}
      title={props.title}
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      okText={props.okText}
      cancelText={props.cancelText}
    >
      <Card style={{ height: '80vh' }}>
        <DictTypeSearchForm onSearch={handleSearch} />
        <div className={styles['button-group']}>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() =>
              setDictTypeFormProps({
                title: '新建字典类型',
                visible: true,
                onOk: (values) =>
                  saveDictType(values).then(() => {
                    fetchData();
                    setDictTypeFormProps({ visible: false });
                  }),
                onCancel: () => setDictTypeFormProps({ visible: false }),
              })
            }
          >
            {'新建字典类型'}
          </Button>
        </div>
        <Spin style={{ width: '100%' }}>
          <Table
            rowKey="id"
            data={data}
            loading={loading}
            onChange={onChangeTable}
            pagination={pagination}
            columns={columns}
            scroll={{
              x: true,
              y: true,
            }}
          />
        </Spin>
      </Card>

      <DictTypeForm {...dictTypeFormProps} />
    </Modal>
  );
}

export default DictTypeManager;
