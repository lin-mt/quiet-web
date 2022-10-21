import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Grid,
  Space,
  Card,
  Typography,
  Trigger,
  Select,
} from '@arco-design/web-react';
import {
  IconPause,
  IconPlayArrow,
  IconRefresh,
  IconSearch,
} from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { getQueryParams, updateUrlParam } from '@/utils/urlParams';
import { LocalStorage } from '@/constant/scrum';
import ProjectGroupSelect, {
  PERSONAL_SPACE_VALUE,
} from '@/components/scrum/ProjectGroupSelect';
import ProjectSelect from '@/components/scrum/ProjectSelect';
import VersionSelect from '@/components/scrum/VersionSelect';
import { ScrumIteration, ScrumPriority } from '@/service/scrum/type';
import { getIteration } from '@/service/scrum/iteration';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';

const { Row, Col } = Grid;
const { useForm } = Form;

export type Params = {
  group_id?: string;
  project_id?: string;
  version_id?: string;
  iteration_id?: string;
};

function getParams(): Params {
  const query = getQueryParams();
  let local: Params = {};
  if (query.group_id || query.project_id) {
    local = { ...query };
  } else {
    const params = localStorage.getItem(LocalStorage.IterationKanban);
    if (params) {
      local = JSON.parse(params);
    }
  }
  return local;
}

function SearchForm(props: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onSearch: (values: Record<string, any>) => void;
}) {
  const [searchForm] = useForm();
  const [iterationForm] = useForm();
  const groupId = Form.useWatch('group_id', iterationForm);
  const projectId = Form.useWatch('project_id', iterationForm);
  const [iteration, setIteration] = useState<ScrumIteration>();
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);
  const [visible, setVisible] = useState<boolean>();
  const [searchParam, setSearchParam] = useState<Record<string, any>>({});

  useEffect(() => {
    iterationForm.setFieldsValue({
      project_id: undefined,
      iteration_id: undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    iterationForm.setFieldValue('iteration_id', undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    setSearchParam(getParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params: Params = {
      ...searchParam,
      group_id:
        PERSONAL_SPACE_VALUE === searchParam.group_id
          ? undefined
          : searchParam.group_id,
    };
    if (params.iteration_id) {
      getIteration(params.iteration_id).then((resp) => setIteration(resp));
    }
    if (params.project_id) {
      getProject(params.project_id).then((project) => {
        listPriority(project.template_id).then((resp) => setPriorities(resp));
      });
    }
    if (props.onSearch) {
      props.onSearch(params);
    }
    searchForm.setFieldsValue(params);
    updateUrlParam(params);
    localStorage.setItem(LocalStorage.IterationKanban, JSON.stringify(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParam)]);

  const handleSearchSubmit = () => {
    setSearchParam((prevState) => {
      return { ...prevState, ...searchForm.getFieldsValue() };
    });
  };

  const handleStartEndIteration = () => {
    console.log('TODO');
  };

  function handleIterationSubmit() {
    setVisible(false);
    searchForm.resetFields();
    setSearchParam({ ...iterationForm.getFieldsValue() });
  }

  const colSpan = 6;

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={searchForm}
        className={styles['search-form']}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={'需求名称'} field="demand_name">
              <Input allowClear placeholder={'请输入需求名称'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'优先级'} field="priority_id">
              <Select
                allowClear
                placeholder={'请选择优先级'}
                options={priorities.map((p) => ({
                  label: p.name,
                  value: p.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'执行者'} field="executor_id">
              <Input allowClear placeholder={'请选择执行者'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'当前迭代'}>
              <Trigger
                popupAlign={{
                  bottom: 10,
                }}
                popupVisible={visible}
                trigger={'click'}
                position={'bottom'}
                onClickOutside={() => setVisible(false)}
                popup={() => {
                  return (
                    <Card className={styles['iteration-select-trigger-popup']}>
                      <Form
                        style={{ width: 500 }}
                        form={iterationForm}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        onSubmit={handleIterationSubmit}
                      >
                        <Form.Item
                          required
                          label={'项目组'}
                          field={'group_id'}
                          initialValue={PERSONAL_SPACE_VALUE}
                        >
                          <ProjectGroupSelect placeholder={'请选择项目组'} />
                        </Form.Item>
                        <Form.Item
                          label={'项目'}
                          field={'project_id'}
                          rules={[{ required: true, message: '请选择项目' }]}
                        >
                          <ProjectSelect
                            placeholder={'请选择项目'}
                            groupId={
                              groupId === PERSONAL_SPACE_VALUE
                                ? undefined
                                : groupId
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label={'迭代'}
                          field={'iteration_id'}
                          rules={[{ required: true, message: '请选择迭代' }]}
                        >
                          <VersionSelect
                            iterationAsChildren
                            versionSelectable={false}
                            placeholder={'请选择迭代'}
                            projectId={projectId}
                          />
                        </Form.Item>
                        <Form.Item label=" ">
                          <Space size={24}>
                            <Button type="primary" htmlType="submit">
                              确定
                            </Button>
                            <Button
                              icon={<IconRefresh />}
                              onClick={() => {
                                iterationForm.resetFields();
                              }}
                            >
                              重置
                            </Button>
                          </Space>
                        </Form.Item>
                      </Form>
                    </Card>
                  );
                }}
              >
                <Button
                  status={iteration ? 'default' : 'danger'}
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => {
                    setVisible(!visible);
                  }}
                >
                  <Typography.Text
                    style={{
                      marginBottom: 0,
                      color: iteration ? '' : 'var(--color-text-3)',
                    }}
                    ellipsis={{ cssEllipsis: true, showTooltip: true }}
                  >
                    {iteration ? iteration.name : '请选择迭代'}
                  </Typography.Text>
                </Button>
              </Trigger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button
          type={'primary'}
          icon={<IconSearch />}
          onClick={() => handleSearchSubmit()}
        >
          查询
        </Button>
        <Button
          type={'primary'}
          disabled={!!(iteration?.start_time && iteration?.end_time)}
          status={iteration?.start_time ? 'warning' : 'default'}
          className={styles['start-end-button']}
          onClick={handleStartEndIteration}
        >
          {!iteration?.start_time && (
            <>
              开始迭代
              <IconPlayArrow />
            </>
          )}
          {iteration?.start_time && !iteration?.end_time && (
            <>
              结束迭代
              <IconPause />
            </>
          )}
          {iteration?.start_time && iteration?.end_time && '迭代已结束'}
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
