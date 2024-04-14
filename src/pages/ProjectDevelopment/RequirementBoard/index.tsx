import { getProjectDetail, listCurrentUserProject } from '@/services/quiet/projectController';
import { listCurrentUserProjectGroup } from '@/services/quiet/projectGroupController';
import { requirementTask } from '@/services/quiet/requirementController';
import { getTemplateDetail } from '@/services/quiet/templateController';
import { treeVersionDetail } from '@/services/quiet/versionController';
import { idName, idUsername, planningStatusColor } from '@/util/Utils';
import { SearchOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormItem,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Card, Col, Empty, Form, Popover, Row, Spin, Tag, TreeSelect, theme } from 'antd';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import BoardRow from './BoardRow';

type BoardIteration = {
  groupId: string;
  projectId: string;
  iterationId: string;
  iterationName: string;
};

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
      label: (
        <>
          <Tag bordered={false} color={planningStatusColor(version.status)}>
            版本
          </Tag>
          {version.name}
        </>
      ),
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

const RequirementBoard: React.FC = () => {
  const { token } = theme.useToken();
  const [iterationForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [projectGroups, setProjectGroups] = useState<API.SimpleProjectGroup[]>();
  const [boardIteration, setBoardIteration] = useState<BoardIteration>();
  const preBoardIterationRef = useRef<BoardIteration>();
  const [projectDetail, setProjectDetail] = useState<API.ProjectDetail>();
  const [templateDetail, setTemplateDetail] = useState<API.TemplateDetail>();
  const [projects, setProjects] = useState<API.SimpleProject[]>();
  const [planningTree, setPlanningTree] = useState<PlanningTreeNode[]>();
  const [requirementTasks, setRequirementTasks] = useState<API.RequirementTask[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [iterationName, setIterationName] = useState<string>('');
  const [iterationOpen, setIterationOpen] = useState<boolean>(false);

  useEffect(() => {
    listCurrentUserProjectGroup().then((resp) => {
      setProjectGroups(resp);
    });
  }, []);

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

  function queryRequirementTask() {
    if (!boardIteration) {
      return;
    }
    const { iterationId } = boardIteration;
    if (preBoardIterationRef.current?.iterationId !== iterationId) {
      setLoading(true);
      requirementTask({ listRequirementTask: { iterationId, ...filterForm.getFieldsValue() } })
        .then((resp) => {
          setRequirementTasks(resp);
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    if (!boardIteration) {
      setProjects(undefined);
      setPlanningTree(undefined);
      return;
    }
    queryRequirementTask();
  }, [boardIteration]);

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
                <Button type="primary" onClick={queryRequirementTask} icon={<SearchOutlined />}>
                  查询
                </Button>
              ),
            }}
          >
            <Popover
              open={iterationOpen}
              trigger={'click'}
              placement="bottom"
              content={
                <ProForm
                  style={{ width: 300 }}
                  form={iterationForm}
                  submitter={{
                    searchConfig: {
                      submitText: '确定',
                    },
                    render: (_, dom) => {
                      return [
                        <div key="fill" style={{ width: '100%' }} />,
                        dom[0],
                        <Button key="cancle" onClick={() => setIterationOpen(false)}>
                          取消
                        </Button>,
                      ];
                    },
                  }}
                  onReset={() => iterationForm.resetFields()}
                  onFinish={async () => {
                    const values = await iterationForm.validateFields();
                    setIterationOpen(false);
                    setBoardIteration({ ...values, iterationName });
                    return true;
                  }}
                >
                  <ProFormSelect<string>
                    name="groupId"
                    placeholder={'请选择项目组'}
                    options={projectGroups}
                    rules={[{ required: true, message: '请选择项目组' }]}
                    fieldProps={{ fieldNames: idName }}
                    onChange={(groupId) => {
                      listCurrentUserProject({ projectGroupId: groupId }).then((resp) => {
                        setProjects(resp);
                        iterationForm.setFieldValue('projectId', undefined);
                        iterationForm.setFieldValue('iterationId', undefined);
                      });
                    }}
                  />
                  <ProFormSelect<string>
                    name="projectId"
                    placeholder={'请选择项目'}
                    options={projects}
                    rules={[{ required: true, message: '请选择项目' }]}
                    fieldProps={{ fieldNames: idName }}
                    onChange={(projectId) => {
                      getProjectDetail({ id: projectId }).then((resp) => {
                        setProjectDetail(resp);
                        getTemplateDetail({ id: resp.template.id }).then((tem) =>
                          setTemplateDetail(tem),
                        );
                        treeVersionDetail({ projectId }).then((resp) => {
                          setPlanningTree(buildPlanningTreeData(resp));
                          iterationForm.setFieldValue('iterationId', undefined);
                        });
                      });
                    }}
                  />
                  <ProFormItem
                    name={'iterationId'}
                    rules={[{ required: true, message: '请选择迭代' }]}
                  >
                    <TreeSelect
                      treeLine
                      treeDefaultExpandAll
                      treeData={planningTree}
                      placeholder={'请选择迭代'}
                      onSelect={async (_, node) => {
                        const values = await iterationForm.validateFields();
                        setIterationOpen(false);
                        setIterationName(node.name);
                        setBoardIteration({ ...values, iterationName: node.name });
                        return true;
                      }}
                    />
                  </ProFormItem>
                </ProForm>
              }
            >
              <ProFormItem label={'当前迭代'}>
                <div style={{ backgroundColor: '#f0f0f0' }}>
                  <Button
                    type="text"
                    style={{ width: 216, textAlign: 'left', color: token.colorTextSecondary }}
                    onClick={() => setIterationOpen(!iterationOpen)}
                  >
                    {boardIteration?.iterationName
                      ? boardIteration?.iterationName
                      : '请选择项目迭代'}
                  </Button>
                </div>
              </ProFormItem>
            </Popover>
            <ProFormText width={'sm'} allowClear name="title" label="标题" />
            <ProFormSelect
              name="priorityId"
              width={'sm'}
              allowClear
              label="优先级"
              options={templateDetail?.requirementPriorities}
              fieldProps={{ fieldNames: idName }}
            />
            <ProFormSelect
              width={'sm'}
              allowClear
              name="handlerId"
              label="处理人"
              options={projectDetail?.members}
              fieldProps={{ fieldNames: idUsername }}
            />
          </ProForm>
        }
      >
        {boardIteration?.iterationId ? (
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
