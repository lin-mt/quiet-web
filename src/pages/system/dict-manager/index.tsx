import React, { useEffect, useState } from 'react';
import {
  Card,
  PaginationProps,
  Button,
  Spin,
  Table,
  Modal,
  Typography,
} from '@arco-design/web-react';
import SearchForm from '@/pages/system/dict-manager/search-form';
import { IconPlus } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { QuietDict } from '@/service/system/type';
import DictForm, { DictFormProps } from '@/components/DictForm';
import {
  deleteDict,
  pageDict,
  saveDict,
  updateDict,
} from '@/service/system/quiet-dict';
import { enabled } from '@/utils/render';
import DictTypeManager from '@/pages/system/dict-manager/dict-type-manager';

function DictManager() {
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
  const [dictFormProps, setDictFormProps] = useState<DictFormProps>({
    visible: false,
  });
  const [dictTypeManagerVisible, setDictTypeManagerVisible] = useState(false);

  useEffect(() => {
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    setLoading(true);
    pageDict({
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

  const columns: ColumnProps<QuietDict>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 185,
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '字典key',
      dataIndex: 'key',
      width: 180,
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '字典类型',
      dataIndex: 'type_id',
      width: 185,
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: 100,
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
              setDictFormProps({
                title: '更新字典',
                visible: true,
                dict: record,
                onOk: async (values) => {
                  return await updateDict(values).then(() => {
                    fetchData();
                    setDictFormProps({ visible: false });
                  });
                },
                onCancel: () => setDictFormProps({ visible: false }),
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
                title: `确认删除字典 ${record.name} 吗？`,
                onOk: () => deleteDict(record.id).then(() => fetchData()),
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
    <Card style={{ height: '80vh' }}>
      <SearchForm onSearch={handleSearch} />
      <div className={styles['button-group']}>
        <Button
          type={'primary'}
          onClick={() => setDictTypeManagerVisible(true)}
        >
          字典类型管理
        </Button>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={() =>
            setDictFormProps({
              title: '新建字典',
              visible: true,
              onOk: (values) =>
                saveDict(values).then(() => {
                  fetchData();
                  setDictFormProps({ visible: false });
                }),
              onCancel: () => setDictFormProps({ visible: false }),
            })
          }
        >
          {'新建字典'}
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

      <DictForm {...dictFormProps} />
      <DictTypeManager
        visible={dictTypeManagerVisible}
        onCancel={() => setDictTypeManagerVisible(false)}
      />
    </Card>
  );
}

export default DictManager;
