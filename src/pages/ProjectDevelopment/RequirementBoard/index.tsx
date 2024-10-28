import { getProjectDetail, listCurrentUserProject } from '@/services/quiet/projectController';
import { requirementTask } from '@/services/quiet/requirementController';
import { getTemplateDetail } from '@/services/quiet/templateController';
import { treeVersionDetail } from '@/services/quiet/versionController';
import { IdName, IdUsername, planningStatusColor } from '@/util/Utils';
import { SearchOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormCascader,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Card, Col, Empty, Form, Row, Spin, Tag } from 'antd';
import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import BoardRow from './BoardRow';

type PlanningTreeNode = {
  value: string;
  label: ReactNode;
  name: string;
  disabled?: boolean;
  versionId?: string;
  versionStatus?: string;
  iterationId?: string;
  iterationStatus?: string;
  children?: PlanningTreeNode[];
};

function buildPlanningTreeData(versions?: API.TreeVersionDetail[]): PlanningTreeNode[] | undefined {
  return versions?.map((version) => {
    const node: PlanningTreeNode = {
      value: version.id,
      name: version.name,
      label: <>{version.name}</>,
      disabled: true,
      versionId: version.id,
      versionStatus: version.status,
    };
    if (version.children) {
      node.children = buildPlanningTreeData(version.children);
    }
    if (version.iterations) {
      node.children = node.children || [];
      node.children.push(
        ...version.iterations.map((iteration) => {
          return {
            value: iteration.id,
            name: iteration.name,
            label: (
              <>
                <Tag bordered={false} color={planningStatusColor(iteration.status)}>
                  迭代
                </Tag>
                {iteration.name}
              </>
            ),
            iterationId: iteration.id,
            iterationStatus: iteration.status,
          };
        }),
      );
    }
    return node;
  });
}

const colWidth = 330;
const colGutter = 20;
const radius = 3;
const colBackgroundColor = '#ebecf0';
const titleContainerStyle: CSSProperties = {
  backgroundColor: colBackgroundColor,
  borderTopLeftRadius: radius,
  borderTopRightRadius: radius,
  padding: 8,
};
const containerStyle: CSSProperties = {
  width: `${colWidth - colGutter}px`,
  height: '100%',
  backgroundColor: colBackgroundColor,
  padding: '4px 8px',
};
const colBottomStyle: CSSProperties = {
  backgroundColor: colBackgroundColor,
  borderBottomLeftRadius: radius,
  borderBottomRightRadius: radius,
  height: 5,
};
const titleStyle = {
  margin: 0,
  color: '#172b4d',
  fontStyle: 'inherit',
  lineHeight: 1.25,
  fontSize: '16px',
};

const RequirementBoard: React.FC = () => {
  const [filterForm] = Form.useForm();
  const [userProjects, setUserProjects] = useState<API.UserProject[]>([]);
  const [projectDetail, setProjectDetail] = useState<API.ProjectDetail>();
  const [templateDetail, setTemplateDetail] = useState<API.TemplateDetail>();
  const [planningTree, setPlanningTree] = useState<PlanningTreeNode[]>();
  const [requirementTasks, setRequirementTasks] = useState<API.RequirementTask[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showBoard, setShowBoard] = useState<boolean>(false);

  function handleIterationChange() {
    setShowBoard(true);
    filterForm.validateFields().then((values) => {
      delete values.projectId;
      setLoading(true);
      requirementTask({ listRequirementTask: { ...values } })
        .then((resp) => {
          setRequirementTasks(resp);
        })
        .finally(() => setLoading(false));
    });
  }

  useEffect(() => {
    listCurrentUserProject().then((resp) => setUserProjects(resp));
  }, []);

  return (
    <PageContainer title={false}>
      <Card
        styles={{ title: { fontWeight: 'normal' }, body: { overflowX: 'scroll' } }}
        title={
          <ProForm
            layout="inline"
            form={filterForm}
            rowProps={{
              gutter: [16, 0],
            }}
            submitter={{
              render: () => (
                <Button type="primary" onClick={handleIterationChange} icon={<SearchOutlined />}>
                  查询
                </Button>
              ),
            }}
          >
            <ProFormCascader
              width={'sm'}
              name="projectId"
              allowClear={false}
              placeholder="请选择项目"
              rules={[{ required: true, message: '' }]}
              fieldProps={{
                expandTrigger: 'hover',
                options: userProjects,
                fieldNames: { label: 'name', value: 'id', children: 'projects' },
                onChange: (val) => {
                  const projectId = val[val?.length - 1];
                  getProjectDetail({ id: projectId }).then((resp) => {
                    setProjectDetail(resp);
                    getTemplateDetail({ id: resp.templateId }).then((tem) =>
                      setTemplateDetail(tem),
                    );
                    treeVersionDetail({ projectId }).then((resp) => {
                      setPlanningTree(buildPlanningTreeData(resp));
                    });
                  });
                },
              }}
            />
            <ProFormTreeSelect
              width={'sm'}
              name="iterationId"
              rules={[{ required: true, message: '' }]}
              fieldProps={{
                treeLine: true,
                allowClear: false,
                treeDefaultExpandAll: true,
                treeData: planningTree,
                placeholder: '请选择迭代',
                onChange: () => handleIterationChange(),
              }}
            />
            <ProFormText width={'sm'} allowClear name="title" label="标题" />
            <ProFormSelect
              name="priorityId"
              width={'sm'}
              allowClear
              label="优先级"
              options={templateDetail?.requirementPriorities}
              fieldProps={{ fieldNames: IdName }}
            />
            <ProFormSelect
              width={'sm'}
              allowClear
              name="handlerId"
              label="处理人"
              options={projectDetail?.members}
              fieldProps={{ fieldNames: IdUsername }}
            />
          </ProForm>
        }
      >
        {showBoard ? (
          <Spin delay={10} spinning={loading}>
            <Row
              gutter={[20, 0]}
              style={{
                width: `${
                  colWidth *
                  (templateDetail?.taskSteps.length ? templateDetail?.taskSteps.length + 1 : 1)
                }px`,
              }}
            >
              <Col key={'req'} flex={`${colWidth}px`}>
                <div style={titleContainerStyle}>
                  <h4 style={titleStyle}>需求</h4>
                </div>
              </Col>
              {templateDetail?.taskSteps.map((step) => {
                return (
                  <Col key={step.id} flex={`${colWidth}px`}>
                    <div style={titleContainerStyle}>
                      <h4 style={titleStyle}>{step.name}</h4>
                    </div>
                  </Col>
                );
              })}
            </Row>
            {requirementTasks?.map((requirementTask) => {
              return (
                projectDetail &&
                templateDetail && (
                  <BoardRow
                    key={requirementTask.id}
                    requirementTask={requirementTask}
                    colGutter={colGutter}
                    colWidth={colWidth}
                    projectDetail={projectDetail}
                    templateDetail={templateDetail}
                    containerStyle={containerStyle}
                  />
                )
              );
            })}
            <Row
              gutter={[20, 0]}
              style={{
                width: `${
                  colWidth *
                  (templateDetail?.taskSteps.length ? templateDetail?.taskSteps.length + 1 : 1)
                }px`,
              }}
            >
              <Col key={'req_bottom'} flex={`${colWidth}px`}>
                <div style={colBottomStyle}></div>
              </Col>
              {templateDetail?.taskSteps.map((step) => {
                return (
                  <Col key={step.id + '_bottom'} flex={`${colWidth}px`}>
                    <div style={colBottomStyle}></div>
                  </Col>
                );
              })}
            </Row>
          </Spin>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'请选择项目迭代'} />
        )}
      </Card>
    </PageContainer>
  );
};

export default RequirementBoard;
