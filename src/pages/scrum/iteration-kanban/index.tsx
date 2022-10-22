import React, { useEffect, useState } from 'react';
import { Card, Empty } from '@arco-design/web-react';
import SearchForm, { Params } from '@/pages/scrum/iteration-kanban/search-form';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';
import { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/service/scrum/type';
import { findEnabledDict } from '@/service/system/quiet-dict';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';
import { listDemand } from '@/service/scrum/demand';
import { listTaskStep } from '@/service/scrum/task-step';
import { listTeamUser } from '@/service/system/quiet-user';
import { listTask } from '@/service/scrum/task';
import Kanban from '@/pages/scrum/iteration-kanban/kanban';

function IterationPlanning() {
  const [params, setParams] = useState<Params>({});
  const [initConfig, setInitConfig] = useState<boolean>();
  const [userIdId2fullName, setUserId2fullName] = useState<
    Record<string, string>
  >({});
  const [taskTypeKey2name, setTaskTypeKey2name] = useState<
    Record<string, string>
  >({});
  const [demandTypeKey2name, setDemandTypeKey2name] = useState<
    Record<string, string>
  >({});
  const [taskStepId2info, setTaskStepId2info] = useState<
    Record<string, ScrumTaskStep>
  >({});
  const [priorityId2color, setPriorityId2color] = useState<
    Record<string, string>
  >({});
  const [demandId2info, setDemandId2info] = useState<
    Record<string, ScrumDemand>
  >({});
  const [demandId2TaskStepTasks, setDemandId2TaskStepTasks] = useState<
    Record<string, Record<string, ScrumTask[]>>
  >({});

  useEffect(() => {
    findEnabledDict(undefined, 'quiet-scrum', 'task-type').then((resp) => {
      const key2name = {};
      resp.forEach((dict) => (key2name[dict.key] = dict.name));
      setTaskTypeKey2name(key2name);
    });
    findEnabledDict(undefined, 'quiet-scrum', 'demand-type').then((resp) => {
      const key2name = {};
      resp.forEach((dict) => (key2name[dict.key] = dict.name));
      setDemandTypeKey2name(key2name);
    });
  }, []);

  function initProjectConfig(projectId: string) {
    getProject(projectId)
      .then((project) => {
        listPriority(project.template_id).then((priorities) => {
          const id2color = {};
          priorities.forEach((p) => (id2color[p.id] = p.color_hex));
          setPriorityId2color(id2color);
        });
        listTaskStep(project.template_id).then((steps) => {
          const id2info = {};
          steps.forEach((s) => (id2info[s.id] = s));
          setTaskStepId2info(id2info);
        });
        listTeamUser(project.team_id).then((users) => {
          const id2name = {};
          users.forEach((u) => (id2name[u.id] = u.full_name));
          setUserId2fullName(id2name);
        });
      })
      .finally(() => setInitConfig(true));
  }

  function handleSearch(values) {
    console.log(values);
    setParams((prevState) => {
      if (!values.project_id || !values.iteration_id) {
        return {};
      }
      if (!initConfig || prevState.project_id !== values.project_id) {
        initProjectConfig(values.project_id);
      }
      if (JSON.stringify(prevState) != JSON.stringify(values)) {
        listDemand(
          values.iteration_id,
          values.demand_title,
          values.priority_id
        ).then((demands) => {
          const id2info: Record<string, ScrumDemand> = {};
          demands.forEach((d) => (id2info[d.id] = d));
          setDemandId2info(id2info);
          listTask(Object.keys(id2info)).then((tasks) => {
            const datum: Record<string, Record<string, ScrumTask[]>> = {};
            tasks.forEach((task) => {
              if (!datum[task.demand_id]) {
                datum[task.demand_id] = {};
              }
              if (!datum[task.demand_id][task.task_step_id]) {
                datum[task.demand_id][task.task_step_id] = [];
              }
              datum[task.demand_id][task.task_step_id].push(task);
            });
            setDemandId2TaskStepTasks(datum);
          });
        });
      }
      return values;
    });
  }

  return (
    <div className={styles['container']}>
      <Card>
        <SearchForm onSearch={handleSearch} />
        {!params.iteration_id && !params.project_id ? (
          <Empty description={'请选择项目迭代'} />
        ) : (
          <Kanban
            demandId2TaskStepTasks={demandId2TaskStepTasks}
            demandId2info={demandId2info}
            taskStepId2info={taskStepId2info}
            priorityId2color={priorityId2color}
            taskTypeKey2name={taskTypeKey2name}
            demandTypeKey2name={demandTypeKey2name}
            userId2fullName={userIdId2fullName}
          />
        )}
      </Card>
    </div>
  );
}

export default IterationPlanning;
