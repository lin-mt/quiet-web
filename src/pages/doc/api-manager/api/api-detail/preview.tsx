import React, { useEffect, useState } from 'react';
import {
  ApiState,
  DocApi,
  DocProject,
  FormParam,
  Header,
  HttpMethod,
  PathParam,
  QueryParam,
} from '@/service/doc/type';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import {
  Badge,
  Descriptions,
  Empty,
  Space,
  Table,
  Tag,
  Typography,
} from '@arco-design/web-react';
import { BlockTitle } from '@/components/doc/styled';
import styled from 'styled-components';
import { getMethodTagColor } from '@/utils/render';
import { SchemaTable } from '@/pages/doc/api-manager/api/api-detail/schema-table';
import MarkdownViewer from '@/components/Markdown/MarkdownViewer';
import { DataType } from '@arco-design/web-react/es/Descriptions/interface';

const ReqTitle = styled.div`
  padding: 10px 0;
  font-size: 15px;
  font-weight: 420;
  line-height: 23px;
  :first-child {
    padding-top: 2px;
  }
`;

const ContentContainer = styled.div`
  padding: 0 10px 10px 10px;
`;

interface PreviewProps {
  api: DocApi;
  projectInfo: DocProject;
}

export default (props: PreviewProps) => {
  const { api } = props;

  const [description, setDescription] = useState<DataType>([]);

  useEffect(() => {
    setDescription([
      {
        label: '接口名称',
        value: props.api.name,
      },
      {
        label: '作者',
        value: props.api.author_full_name,
      },
      {
        label: '创建人',
        value: props.api.creator_full_name,
      },
      {
        label: '更新人',
        value: props.api.updater_full_name,
      },
      {
        label: '状态',
        value: (
          <Badge
            status={
              props.api.api_state === ApiState.FINISHED
                ? 'success'
                : 'processing'
            }
            text={
              props.api.api_state === ApiState.FINISHED ? '已完成' : '未完成'
            }
          />
        ),
      },
      {
        label: '更新时间',
        value: props.api.gmt_update,
      },
      {
        label: '接口路径',
        value: (
          <Space direction={'horizontal'}>
            <Tag color={getMethodTagColor(props.api.method)}>
              {props.api.method}
            </Tag>
            <Typography.Text copyable={true}>
              {props.projectInfo.base_path}
              {props.api.path}
            </Typography.Text>
          </Space>
        ),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.api)]);

  const pathColumns: ColumnProps<PathParam>[] = [
    { title: '参数名称', dataIndex: 'name' },
    {
      title: '参数示例',
      dataIndex: 'example',
    },
    { title: '备注', dataIndex: 'remark' },
  ];

  const headerColumns: ColumnProps<Header>[] = [
    {
      title: '参数名称',
      dataIndex: 'name',
    },
    {
      title: '参数值',
      dataIndex: 'value',
    },
    {
      title: '是否必须',
      dataIndex: 'required',
      width: 88,
      render: (required) => (required ? '是' : '否'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  const queryColumns: ColumnProps<QueryParam>[] = [
    {
      title: '参数名称',
      dataIndex: 'name',
    },
    {
      title: '是否必须',
      dataIndex: 'required',
      width: 88,
      render: (required) => (required ? '是' : '否'),
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      render: (text) => text.toLowerCase(),
    },
    {
      title: '最小长度（值）',
      dataIndex: 'min',
    },
    { title: '最大长度（值）', dataIndex: 'max' },
    {
      title: '示例参数',
      dataIndex: 'example',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  const reqFormColumns: ColumnProps<FormParam>[] = [
    {
      title: '参数名称',
      dataIndex: 'name',
    },
    {
      title: '是否必须',
      dataIndex: 'required',
      width: 88,
      render: (required) => (required ? '是' : '否'),
    },
    {
      title: '参数类型',
      dataIndex: 'type',
    },
    {
      title: 'ContentType',
      dataIndex: 'content_type',
    },
    {
      title: '最小长度',
      dataIndex: 'min_length',
    },
    { title: '最大长度', dataIndex: 'max_length' },
    {
      title: '示例参数',
      dataIndex: 'example',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <BlockTitle>基本信息</BlockTitle>
      <ContentContainer>
        <Descriptions border data={description} />
      </ContentContainer>
      <BlockTitle>备注</BlockTitle>
      <ContentContainer
        style={{
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        {api.remark ? (
          <MarkdownViewer value={api.remark} />
        ) : (
          <Empty description={'无备注信息'} />
        )}
      </ContentContainer>
      <BlockTitle>请求参数</BlockTitle>
      <ContentContainer>
        {api.api_info?.path_param && (
          <>
            <ReqTitle>Path</ReqTitle>
            <Table
              border
              pagination={false}
              size={'small'}
              rowKey={(header) => header.name}
              data={api.api_info?.path_param}
              columns={pathColumns}
            />
          </>
        )}
        <ReqTitle>Headers</ReqTitle>
        <Table
          border
          pagination={false}
          size={'small'}
          rowKey={(header) => header.name}
          data={api.api_info?.headers}
          columns={headerColumns}
        />
        <ReqTitle>Query</ReqTitle>
        <Table
          border
          pagination={false}
          size={'small'}
          rowKey={(query) => query.name}
          data={api.api_info?.req_query}
          columns={queryColumns}
        />
        {[
          HttpMethod.PUT,
          HttpMethod.DELETE,
          HttpMethod.PATCH,
          HttpMethod.POST,
        ].includes(HttpMethod[api.method]) && <ReqTitle>Body</ReqTitle>}
        {api.api_info?.req_form && (
          <Table
            border
            pagination={false}
            size={'small'}
            rowKey={(form) => form.name}
            data={api.api_info.req_form}
            columns={reqFormColumns}
          />
        )}
        {api.api_info?.req_json_body && (
          <SchemaTable data={api.api_info?.req_json_body} />
        )}
        {api.api_info?.req_file && api.api_info.req_file}
        {api.api_info?.req_raw && api.api_info.req_raw}
        {[
          HttpMethod.PUT,
          HttpMethod.DELETE,
          HttpMethod.PATCH,
          HttpMethod.POST,
        ].includes(HttpMethod[api.method]) &&
          !api.api_info?.req_form &&
          !api.api_info?.req_json_body &&
          !api.api_info?.req_file &&
          !api.api_info?.req_raw && <Empty />}
      </ContentContainer>
      <BlockTitle>返回数据</BlockTitle>
      <ContentContainer>
        {api.api_info?.resp_json_body && (
          <SchemaTable data={api.api_info.resp_json_body} />
        )}
        {api.api_info?.resp_raw && api.api_info?.resp_raw}
        {!api.api_info?.resp_json_body && !api.api_info?.resp_raw && <Empty />}
      </ContentContainer>
    </Space>
  );
};
