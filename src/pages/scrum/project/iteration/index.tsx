import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type {
  ScrumDemand,
  ScrumPriority,
  ScrumTask,
  ScrumTaskStep,
} from '@/services/scrum/EntitiyType';
import type { ScrumVersion } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';
import { findProjectDetail } from '@/services/scrum/ScrumProject';
import { findAllByTemplateId } from '@/services/scrum/ScrumPriority';
import { useModel } from '@@/plugin-model/useModel';
import { DICTIONARY } from '@/constant/system/Modelnames';
import { DictionaryType } from '@/types/Type';
import { findAllByIterationId } from '@/services/scrum/ScrumDemand';
import { findAllTaskByDemandIds } from '@/services/scrum/ScrumTask';
import { findDetailsByProjectId } from '@/services/scrum/ScrumVersion';
import { disableVersionNode, iterationsAddToChildren } from '@/utils/scrum/utils';
import { getAllByTemplateId as getAllTaskStepByTemplateId } from '@/services/scrum/ScrumTaskStep';
import { Card, Empty, Space, Spin, TreeSelect } from 'antd';
import { ProFormField, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-form';
import styled from 'styled-components';
import IterationTaskRow from '@/pages/scrum/project/iteration/components/IterationTaskRow';

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

  const [loading, setLoading] = useState<boolean>(false);
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

  const init = useCallback(async () => {
    setLoading(true);
    const project = await findProjectDetail(projectId);
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
    await getDictionaryLabels(DictionaryType.TaskType).then((labels) => setTaskTypeLabels(labels));
    setLoading(false);
  }, [getDictionaryLabels, projectId]);

  useEffect(() => {
    if (projectId) {
      init().then();
    }
  }, [init, projectId]);

  useEffect(() => {
    if (selectedIterationId) {
      // 加载需求
      findAllByIterationId(selectedIterationId).then((scrumDemands) => {
        const demandIds: string[] = [];
        setDemands(scrumDemands);
        setAllDemands(scrumDemands);
        scrumDemands.forEach((datum) => {
          demandIds.push(datum.id);
        });
        // 加载任务
        findAllTaskByDemandIds(demandIds).then((tasks) => {
          setDemandTasks(tasks);
          setAllDemandTasks(tasks);
        });
      });
    }
  }, [selectedIterationId, versions]);

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

  return (
    <>
      <QueryFilter submitter={false}>
        <ProFormField name={'iterationId'} label={'当前迭代'} initialValue={iterationId}>
          <TreeSelect
            virtual={false}
            showSearch={true}
            treeNodeFilterProp={'title'}
            defaultValue={iterationId}
            onSelect={(value) => setSelectedIterationId(value.toString())}
            placeholder={'请选择迭代'}
            treeData={disableVersionNode(versions)}
          />
        </ProFormField>
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
      {loading ? (
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
