import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  PaginationProps,
  Space,
  Table,
  Tag,
  Typography,
} from '@arco-design/web-react';
import { pageApi, saveApi } from '@/service/doc/api';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { ApiState, DocApi } from '@/service/doc/type';
import { getMethodTagColor } from '@/utils/doc/render';
import { BlockTitle } from '@/components/doc/styled';
import { getApiGroup } from '@/service/doc/api-group';
import ApiForm from '@/components/doc/ApiForm';
import { QuietFormProps } from '@/components/type';

export type ApiGroupListApiProps = {
  projectId: string;
  groupId?: string;
  onClickApi?: (api: DocApi) => void;
  name?: string;
};

function ApiGroupListApi(props: ApiGroupListApiProps) {
  const [data, setData] = useState([]);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [apiFormProps, setApiFormProps] = useState<QuietFormProps<DocApi>>();
  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: false,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  useEffect(() => {
    if (props.name) {
      setName(props.name);
    } else {
      if (props.groupId) {
        getApiGroup(props.groupId).then((apiGroup) => setName(apiGroup.name));
      } else {
        setName('未知分组');
      }
    }
  }, [props.groupId, props.name]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, props.groupId]);

  function onChangeTable({ current, pageSize }) {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const columns: ColumnProps<DocApi>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 210,
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      render: (_, record) => {
        return (
          <span
            style={{ color: 'rgb(var(--primary-6))', cursor: 'pointer' }}
            onClick={() => {
              if (props.onClickApi) {
                props.onClickApi(record);
              }
            }}
          >
            {record.name}
          </span>
        );
      },
    },
    {
      title: '接口路径',
      dataIndex: 'path',
      render: (_, record) => {
        return (
          <Space>
            <Tag color={getMethodTagColor(record.method)}> {record.method}</Tag>
            {record.path}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'api_state',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        const isFinished = ApiState[record.api_state] === ApiState.FINISHED;
        return (
          <Badge
            status={isFinished ? 'success' : 'processing'}
            text={isFinished ? '完成' : '未完成'}
          />
        );
      },
    },
  ];

  function fetchData() {
    setLoading(true);
    pageApi({
      current: pagination.current,
      page_size: pagination.pageSize,
      project_id: props.projectId,
      api_group_id: props.groupId ? props.groupId : 0,
    })
      .then((res) => {
        setData(res.content);
        setPagination((pre) => ({ ...pre, total: res.total_elements }));
      })
      .finally(() => setLoading(false));
  }

  function handleAddApi() {
    setApiFormProps({
      visible: true,
      title: '新增接口',
      onCancel: () => setApiFormProps({}),
      onOk: (values) =>
        saveApi(values)
          .then(() => fetchData())
          .finally(() => setApiFormProps({})),
    });
  }

  return (
    <Card>
      <Space direction={'vertical'}>
        <div style={{ height: 32 }}>
          <Space align={'end'}>
            <BlockTitle>{name}</BlockTitle>
            <span style={{ fontSize: 12, color: 'rgb(var(--primary-6))' }}>
              共 {pagination.total} 个接口
            </span>
          </Space>
          <Space style={{ float: 'right' }}>
            <Button type={'primary'} onClick={() => handleAddApi()}>
              添加接口
            </Button>
          </Space>
        </div>
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
      </Space>
      <ApiForm
        projectId={props.projectId}
        groupId={props.groupId}
        {...apiFormProps}
      />
    </Card>
  );
}

export default ApiGroupListApi;
