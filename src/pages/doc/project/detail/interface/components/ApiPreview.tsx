import { ApiTitle } from '@/pages/doc/project/detail';
import { Badge, Descriptions, Empty, Space, Table, Tag, Typography } from 'antd';
import type { DocApi, DocProject, FormParam, Header, PathParam } from '@/services/doc/EntityType';
import { getMethodTagColor } from '@/utils/doc/utils';
import { ApiState, HttpMethod } from '@/services/doc/Enums';
import styled from 'styled-components';
import type { ColumnsType } from 'antd/lib/table/interface';
import type { QueryParam } from '@/services/doc/EntityType';
import { SchemaTable } from '@/pages/doc/project/detail/interface/components/SchemaTable';
import MarkdownViewer from '@/pages/components/Markdown/MarkdownViewer';

const ContentContainer = styled.div`
  padding: 10px;
`;

const ReqTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  line-height: 23px;
  color: rgba(39, 56, 72, 0.92);
`;

interface ApiPreviewProps {
  apiDetail: DocApi;
  projectInfo: DocProject;
}

export default (props: ApiPreviewProps) => {
  const { apiDetail, projectInfo } = props;

  const pathColumns: ColumnsType<PathParam> = [
    { title: '参数名称', dataIndex: 'name' },
    {
      title: '参数示例',
      dataIndex: 'example',
    },
    { title: '备注', dataIndex: 'remark' },
  ];

  const headerColumns: ColumnsType<Header> = [
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
      render: (required) => (required ? '是' : '否'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  const queryColumns: ColumnsType<QueryParam> = [
    {
      title: '参数名称',
      dataIndex: 'name',
    },
    {
      title: '是否必须',
      dataIndex: 'required',
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

  const reqFormColumns: ColumnsType<FormParam> = [
    {
      title: '参数名称',
      dataIndex: 'name',
    },
    {
      title: '是否必须',
      dataIndex: 'required',
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
    <Space direction={'vertical'} style={{ width: '100%', marginBottom: 30 }} size={'middle'}>
      <ApiTitle>基本信息</ApiTitle>
      <ContentContainer>
        <Descriptions bordered={true} size={'middle'} column={2}>
          <Descriptions.Item label={'接口名称'}>{apiDetail.name}</Descriptions.Item>
          <Descriptions.Item label={'作者'}>{apiDetail.author_full_name}</Descriptions.Item>
          <Descriptions.Item label={'创建人'}>{apiDetail.creator_full_name}</Descriptions.Item>
          <Descriptions.Item label={'更新人'}>{apiDetail.updater_full_name}</Descriptions.Item>
          <Descriptions.Item label={'状态'}>
            <Badge
              status={apiDetail.api_state === ApiState.FINISHED ? 'success' : 'processing'}
              text={apiDetail.api_state === ApiState.FINISHED ? '已完成' : '未完成'}
            />
          </Descriptions.Item>
          <Descriptions.Item label={'更新时间'}>{apiDetail.gmt_update}</Descriptions.Item>
          <Descriptions.Item label={'接口路径'}>
            <Space direction={'horizontal'}>
              <Tag color={getMethodTagColor(apiDetail.method)}>{apiDetail.method}</Tag>
              <Typography.Text copyable={true}>
                {projectInfo.base_path}
                {apiDetail.path}
              </Typography.Text>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </ContentContainer>
      <ApiTitle>备注</ApiTitle>
      <ContentContainer
        style={{
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        {apiDetail.remark ? (
          <MarkdownViewer value={apiDetail.remark} />
        ) : (
          <Empty description={'无备注信息'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ContentContainer>
      <ApiTitle>请求参数</ApiTitle>
      <ContentContainer>
        {apiDetail.api_info?.path_param && (
          <>
            <ReqTitle>路径参数:</ReqTitle>
            <Table
              bordered={true}
              pagination={false}
              size={'small'}
              rowKey={(header) => header.name}
              dataSource={apiDetail.api_info?.path_param}
              columns={pathColumns}
            />
          </>
        )}
        <ReqTitle style={{ marginTop: apiDetail.api_info?.path_param ? 20 : 0 }}>Headers:</ReqTitle>
        <Table
          bordered={true}
          pagination={false}
          size={'small'}
          rowKey={(header) => header.name}
          dataSource={apiDetail.api_info?.headers}
          columns={headerColumns}
        />
        <ReqTitle style={{ marginTop: 20 }}>Query:</ReqTitle>
        <Table
          bordered={true}
          pagination={false}
          size={'small'}
          rowKey={(query) => query.name}
          dataSource={apiDetail.api_info?.req_query}
          columns={queryColumns}
        />
        {[HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.PATCH, HttpMethod.POST].includes(
          HttpMethod[apiDetail.method],
        ) && <ReqTitle style={{ marginTop: 20 }}>Body:</ReqTitle>}
        {apiDetail.api_info?.req_form && (
          <Table
            bordered={true}
            pagination={false}
            size={'small'}
            rowKey={(form) => form.name}
            dataSource={apiDetail.api_info.req_form}
            columns={reqFormColumns}
          />
        )}
        {apiDetail.api_info?.req_json_body && (
          <SchemaTable dataSource={apiDetail.api_info?.req_json_body} />
        )}
        {apiDetail.api_info?.req_file && apiDetail.api_info.req_file}
        {apiDetail.api_info?.req_raw && apiDetail.api_info.req_raw}
        {[HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.PATCH, HttpMethod.POST].includes(
          HttpMethod[apiDetail.method],
        ) &&
          !apiDetail.api_info?.req_form &&
          !apiDetail.api_info?.req_json_body &&
          !apiDetail.api_info?.req_file &&
          !apiDetail.api_info?.req_raw && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </ContentContainer>
      <ApiTitle>返回数据</ApiTitle>
      <ContentContainer>
        {apiDetail.api_info?.resp_json_body && (
          <SchemaTable dataSource={apiDetail.api_info.resp_json_body} />
        )}
        {apiDetail.api_info?.resp_raw && apiDetail.api_info?.resp_raw}
        {!apiDetail.api_info?.resp_json_body && !apiDetail.api_info?.resp_raw && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ContentContainer>
    </Space>
  );
};
