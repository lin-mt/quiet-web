import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type {
  ScrumDemand,
  ScrumIteration,
  ScrumPriority,
  ScrumTask,
  ScrumTaskStep,
} from '@/services/scrum/EntitiyType';
import type { ScrumVersion } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';
import { getProjectDetail } from '@/services/scrum/ScrumProject';
import { findAllByTemplateId } from '@/services/scrum/ScrumPriority';
import { start, end } from '@/services/scrum/ScrumIteration';
import { useModel } from '@@/plugin-model/useModel';
import { DICTIONARY } from '@/constant/system/ModelNames';
import { DictionaryType } from '@/types/Type';
import { findAllByIterationId } from '@/services/scrum/ScrumDemand';
import { findAllTaskByDemandIds } from '@/services/scrum/ScrumTask';
import { findDetailsByProjectId } from '@/services/scrum/ScrumVersion';
import { disableVersionNode, getIterationInfo, iterationsAddToChildren } from '@/utils/scrum/utils';
import { getAllByTemplateId as getAllTaskStepByTemplateId } from '@/services/scrum/ScrumTaskStep';
import { Button, Card, Empty, message, Popconfirm, Space, Spin, Tooltip, TreeSelect } from 'antd';
import { ProFormField, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-form';
import styled from 'styled-components';
import IterationTaskRow from '@/pages/scrum/project/iteration/components/IterationTaskRow';
import { FastForwardOutlined, PauseOutlined } from '@ant-design/icons';

const TitleCard = styled(Card)`
  width: 260px;
  text-align: center;
  border-radius: 5px;
  background-color: #bad9ef;
`;

const MainContainer = styled.div`
  white-space: nowrap;
  overflow-x: scroll;
  padding-bottom: 13px;
`;

interface DemandAndTaskFilter {
  demandTitle?: string;
  priorityId?: string;
  demandType?: string;
  executorId?: string;
}

export default (props: PropsWithChildren<any>) => {
  const { projectId, iterationId } = props.location.query;

  const { getDictionaryLabels } = useModel(DICTIONARY);

  const [loading, setLoading] = useState<boolean>(true);
  const [demandAndTaskLoading, setDemandAndTaskLoading] = useState<boolean>(true);
  const [taskSteps, setTaskSteps] = useState<ScrumTaskStep[]>([]);
  const [versions, setVersions] = useState<ScrumVersion[]>([]);
  const [demands, setDemands] = useState<ScrumDemand[]>([]);
  const [allDemands, setAllDemands] = useState<ScrumDemand[]>([]);
  // <demandId, <taskStepId, scrumTask[]>>
  const [demandTasks, setDemandTasks] = useState<Record<string, Record<string, ScrumTask[]>>>({});
  const [allDemandTasks, setAllDemandTasks] = useState<Record<string, Record<string, ScrumTask[]>>>(
    {},
  );
  const [members, setMembers] = useState<Record<string, QuietUser>>({});
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);
  const [priorityColors, setPriorityColors] = useState<Record<string, string>>({});
  const [demandTypeLabels, setDemandTypeLabels] = useState<Record<string, string>>({});
  const [taskTypeLabels, setTaskTypeLabels] = useState<Record<string, string>>({});
  const [selectedIterationId, setSelectedIterationId] = useState<string>(iterationId);

  const init = useCallback(() => {
    setLoading(true);
    getProjectDetail(projectId).then(async (project) => {
      // 加载团队成员信息
      const membersDatum: Record<string, QuietUser> = {};
      project.teams.forEach((team) => {
        if (team.members) {
          team.members.forEach((member) => {
            membersDatum[member.id] = member;
          });
        }
      });
      setMembers(membersDatum);
      // 加载优先级ID与颜色的对应关系
      await findAllByTemplateId(project.project.templateId).then((scrumPriorities) => {
        setPriorities(scrumPriorities);
        const datum: Record<string, string> = {};
        scrumPriorities.forEach((priority) => {
          datum[priority.id] = priority.colorHex;
        });
        setPriorityColors(datum);
      });
      // 加载任务步骤
      await getAllTaskStepByTemplateId(project.project.templateId).then((scrumTaskSteps) => {
        setTaskSteps(scrumTaskSteps);
      });
      // 加载版本信息
      await findDetailsByProjectId(projectId).then((projectVersions) => {
        setVersions(iterationsAddToChildren(projectVersions));
      });
      // 查询需求类型
      await getDictionaryLabels(DictionaryType.DemandType).then((labels) =>
        setDemandTypeLabels(labels),
      );
      // 查询任务类型
      await getDictionaryLabels(DictionaryType.TaskType).then((labels) =>
        setTaskTypeLabels(labels),
      );
      setLoading(false);
    });
  }, [getDictionaryLabels, projectId]);

  const loadDemandsAndTasks = useCallback(() => {
    if (selectedIterationId) {
      setDemandAndTaskLoading(true);
      // 加载需求
      findAllByIterationId(selectedIterationId).then(async (scrumDemands) => {
        const demandIds: string[] = [];
        setDemands(scrumDemands);
        setAllDemands(scrumDemands);
        scrumDemands.forEach((datum) => {
          demandIds.push(datum.id);
        });
        // 加载任务
        await findAllTaskByDemandIds(demandIds).then((tasks) => {
          setDemandTasks(tasks);
          setAllDemandTasks(tasks);
        });
        setDemandAndTaskLoading(false);
      });
    }
  }, [selectedIterationId]);

  useEffect(() => {
    if (projectId) {
      init();
    }
  }, [init, projectId]);

  useEffect(() => {
    loadDemandsAndTasks();
  }, [loadDemandsAndTasks]);

  async function filterDemandAndTask(filter: DemandAndTaskFilter) {
    const scrumDemands: ScrumDemand[] = [];
    const demandIds: string[] = [];
    const scrumDemandTasks: Record<string, Record<string, ScrumTask[]>> = {};
    if (filter.executorId) {
      Object.keys(allDemandTasks).forEach((demandId) => {
        const demandTasksDatum: Record<string, ScrumTask[]> = {};
        Object.keys(allDemandTasks[demandId]).forEach((taskStepId) => {
          allDemandTasks[demandId][taskStepId].forEach((task) => {
            if (task.executorId === filter.executorId) {
              if (!demandTasksDatum[taskStepId]) {
                demandTasksDatum[taskStepId] = [];
              }
              demandTasksDatum[taskStepId].push(task);
            }
          });
        });
        if (Object.keys(demandTasksDatum).length > 0) {
          demandIds.push(demandId);
          scrumDemandTasks[demandId] = demandTasksDatum;
        }
      });
    }
    allDemands.forEach((demand) => {
      if (filter.executorId && !demandIds.includes(demand.id)) {
        return;
      }
      if (filter.demandTitle && !demand.title.includes(filter.demandTitle)) {
        return;
      }
      if (filter.demandType && demand.type !== filter.demandType) {
        return;
      }
      if (filter.priorityId && demand.priorityId !== filter.priorityId) {
        return;
      }
      scrumDemands.push(demand);
    });
    setDemands(scrumDemands);
  }

  function getIterationOperationTooltip(): string {
    if (selectedIterationId) {
      const iterationInfo = selectedIteration();
      if (!iterationInfo?.startTime) {
        return '开始迭代';
      }
      if (iterationInfo?.endTime) {
        return '迭代已结束';
      }
      return '结束迭代';
    }
    return '请选择迭代';
  }

  function selectedIteration(): ScrumIteration | undefined {
    return getIterationInfo(versions, selectedIterationId);
  }

  async function handleStartIteration() {
    if (selectedIterationId) {
      const iterationInfo = selectedIteration();
      if (!iterationInfo?.startTime) {
        await start(selectedIterationId);
        findDetailsByProjectId(projectId).then((projectVersions) => {
          setVersions(iterationsAddToChildren(projectVersions));
        });
      }
    }
  }

  function taskCanBeCreated(): boolean {
    const iterationInfo = selectedIteration();
    if (!iterationInfo?.startTime) {
      message.warn('迭代还未开始，无法创建任务').then();
      return false;
    }
    if (iterationInfo?.endTime) {
      message.warn('迭代已结束，无法创建任务').then();
      return false;
    }
    return true;
  }

  async function endSelectedIteration() {
    if (selectedIterationId) {
      const iterationInfo = selectedIteration();
      if (iterationInfo?.startTime && !iterationInfo?.endTime) {
        await end(selectedIterationId);
        findDetailsByProjectId(projectId).then((projectVersions) => {
          setVersions(iterationsAddToChildren(projectVersions));
        });
        loadDemandsAndTasks();
      }
    }
  }

  return (
    <>
      <QueryFilter submitter={false}>
        <ProFormField name={'iterationId'} label={'当前迭代'} initialValue={iterationId}>
          <TreeSelect<string>
            virtual={false}
            treeIcon={true}
            showSearch={true}
            loading={loading}
            treeNodeFilterProp={'title'}
            onSelect={(value) => setSelectedIterationId(value)}
            placeholder={'请选择迭代'}
            treeData={disableVersionNode(versions)}
          />
        </ProFormField>
        <Tooltip title={getIterationOperationTooltip} placement={'right'}>
          <Popconfirm
            title={'结束当前迭代，未完成的需求将会进入下一个迭代'}
            disabled={!selectedIteration()?.startTime || !!selectedIteration()?.endTime}
            onConfirm={endSelectedIteration}
          >
            <Button
              loading={loading}
              type={'primary'}
              style={{ width: 50 }}
              disabled={!selectedIterationId || !!selectedIteration()?.endTime}
              danger={!!selectedIteration()?.startTime}
              onClick={handleStartIteration}
              icon={selectedIteration()?.startTime ? <PauseOutlined /> : <FastForwardOutlined />}
            />
          </Popconfirm>
        </Tooltip>
      </QueryFilter>
      <QueryFilter<DemandAndTaskFilter>
        span={4}
        onFinish={filterDemandAndTask}
        onReset={() => setSelectedIterationId(iterationId)}
      >
        <ProFormText name={'demandTitle'} label={'需求标题'} />
        <ProFormSelect
          name={'priorityId'}
          label={'优先级'}
          options={priorities.map((priority) => ({ label: priority.name, value: priority.id }))}
        />
        <ProFormSelect
          name={'demandType'}
          label={'需求类型'}
          options={Object.keys(demandTypeLabels).map((key) => ({
            label: demandTypeLabels[key],
            value: key,
          }))}
        />
        <ProFormSelect
          name={'executorId'}
          label={'执行者'}
          options={Object.keys(members).map((memberId) => ({
            label: members[memberId].fullName,
            value: memberId,
          }))}
        />
      </QueryFilter>
      {demandAndTaskLoading ? (
        <Empty description={null} image={null}>
          <Spin size={'large'} />
        </Empty>
      ) : (
        <MainContainer>
          <Space direction={'vertical'}>
            <Space>
              <TitleCard key={'demandInfo'} size={'small'} bodyStyle={{ padding: 6 }}>
                需求信息
              </TitleCard>
              {taskSteps.map((taskStep) => {
                return (
                  <TitleCard key={taskStep.id} size={'small'} bodyStyle={{ padding: 6 }}>
                    {taskStep.name}
                  </TitleCard>
                );
              })}
            </Space>
            {demands.map((demand) => {
              return (
                <IterationTaskRow
                  key={demand.id}
                  demand={demand}
                  taskDragDisabled={
                    !selectedIteration()?.startTime || !!selectedIteration()?.endTime
                  }
                  taskCanBeCreated={taskCanBeCreated}
                  members={members}
                  demandTypeLabels={demandTypeLabels}
                  taskTypeLabels={taskTypeLabels}
                  priorityColors={priorityColors}
                  taskSteps={taskSteps}
                  taskStepTasks={demandTasks[demand.id]}
                />
              );
            })}
          </Space>
        </MainContainer>
      )}
    </>
  );
};
