import React, { useEffect, useState } from 'react';
import { Card, Empty, Modal } from '@arco-design/web-react';
import SearchForm, { Params } from '@/pages/scrum/iteration-kanban/search-form';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';
import {
  ScrumDemand,
  ScrumIteration,
  ScrumPriority,
  ScrumTask,
  ScrumTaskStep,
} from '@/service/scrum/type';
import { findEnabledDict } from '@/service/system/quiet-dict';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';
import { listDemand } from '@/service/scrum/demand';
import { listTaskStep } from '@/service/scrum/task-step';
import { listTeamUser } from '@/service/system/quiet-user';
import { listTask, updateTask } from '@/service/scrum/task';
import _ from 'lodash';
import Kanban from '@/pages/scrum/iteration-kanban/kanban';
import { MoveTask } from '@/pages/scrum/iteration-kanban/kanban-row';
import { end, getIteration, start } from '@/service/scrum/iteration';
import NextIterationModal, {
  NextIterationModalProp,
} from '@/pages/scrum/iteration-kanban/next-iteration-modal';
import { QuietUser } from '@/service/system/type';

function IterationPlanning() {
  const [params, setParams] = useState<Params>({});
  const [initConfig, setInitConfig] = useState<boolean>();
  const [isDropDisabled, setIsDropDisabled] = useState<boolean>();
  const [iteration, setIteration] = useState<ScrumIteration>();
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);
  const [teamUsers, setTeamUsers] = useState<QuietUser[]>([]);
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
  const [nextIterationModalProps, setNextIterationModalProps] =
    useState<NextIterationModalProp>();

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

  useEffect(() => {
    setIsDropDisabled(!(iteration?.start_time && !iteration?.end_time));
  }, [iteration]);

  function initProjectConfig(projectId: string) {
    getProject(projectId)
      .then((project) => {
        listPriority(project.template_id).then((priorities) => {
          setPriorities(priorities);
          const id2color = {};
          priorities.forEach((p) => (id2color[p.id] = p.color));
          setPriorityId2color(id2color);
        });
        listTaskStep(project.template_id).then((steps) => {
          const id2info = {};
          steps.forEach((s) => (id2info[s.id] = s));
          setTaskStepId2info(id2info);
        });
        listTeamUser(project.team_id).then((users) => {
          setTeamUsers(users);
          const id2name = {};
          users.forEach((u) => (id2name[u.id] = u.full_name));
          setUserId2fullName(id2name);
        });
      })
      .finally(() => setInitConfig(true));
  }

  function handleSearch(values) {
    setParams((prevState) => {
      if (!values.project_id || !values.iteration_id) {
        return {};
      }
      if (!initConfig || prevState.project_id !== values.project_id) {
        initProjectConfig(values.project_id);
      }
      if (prevState.iteration_id !== values.iteration_id) {
        getIteration(values.iteration_id).then((resp) => {
          setIteration(resp);
        });
      }
      if (JSON.stringify(prevState) != JSON.stringify(values)) {
        loadDemandTask(values);
      }
      return values;
    });
  }

  function loadDemandTask(params) {
    listDemand(
      params.iteration_id,
      params.demand_title,
      params.priority_id
    ).then((demands) => {
      const id2info: Record<string, ScrumDemand> = {};
      demands.forEach((d) => (id2info[d.id] = d));
      setDemandId2info(id2info);
      listTask(Object.keys(id2info), [params.executor_id]).then((tasks) => {
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

  function handleNewTask(task) {
    const demandTasks = _.clone(demandId2TaskStepTasks);
    if (!demandTasks[task.demand_id]) {
      demandTasks[task.demand_id] = {};
    }
    if (!demandTasks[task.demand_id][task.task_step_id]) {
      demandTasks[task.demand_id][task.task_step_id] = [];
    }
    const taskStepId2tasks = demandTasks[task.demand_id];
    const tasks = taskStepId2tasks[task.task_step_id];
    demandTasks[task.demand_id][task.task_step_id] = [].concat(...tasks, task);
    setDemandId2TaskStepTasks(demandTasks);
  }

  function handleDeleteTask(task: ScrumTask) {
    const demandTasks = _.clone(demandId2TaskStepTasks);
    const tasks = demandTasks[task.demand_id][task.task_step_id];
    const index = tasks.findIndex((t) => t.id === task.id);
    tasks.splice(index, 1);
    demandTasks[task.demand_id][task.task_step_id] = tasks;
    setDemandId2TaskStepTasks(demandTasks);
  }

  function handleTaskMove(params: MoveTask) {
    const { demandId, fromTaskStepId, fromIndex, toTaskStepId, toIndex } =
      params;
    const demandTasks = _.clone(demandId2TaskStepTasks);
    const fromTasks = demandTasks[demandId][fromTaskStepId];
    let toTasks = demandTasks[demandId][toTaskStepId];
    const taskMoved = fromTasks.splice(fromIndex, 1)[0];
    taskMoved.task_step_id = toTaskStepId;
    updateTask(taskMoved).then((resp) => {
      if (!toTasks) {
        toTasks = [];
      }
      toTasks.splice(toIndex, 0, resp);
      demandTasks[demandId][fromTaskStepId] = fromTasks;
      demandTasks[demandId][toTaskStepId] = toTasks;
      setDemandId2TaskStepTasks(demandTasks);
    });
  }

  function handleStartIteration(iteration: ScrumIteration) {
    Modal.confirm({
      title: '开始迭代',
      content: `确认开始当前迭代 ${iteration.name} 吗？`,
      onConfirm: () => start(iteration.id).then((resp) => setIteration(resp)),
    });
  }

  function handleEndIteration(iteration: ScrumIteration) {
    const demandIds = Object.keys(demandId2info);
    const taskStepIds = Object.keys(taskStepId2info);
    const lastStep = taskStepIds[taskStepIds.length - 1];
    let allDemandFinish = true;
    demandIds.every((id) => {
      const taskStep2tasks = demandId2TaskStepTasks[id];
      if (!taskStep2tasks) {
        allDemandFinish = false;
        return false;
      }
      taskStepIds.every((tsId) => {
        if (tsId === lastStep) {
          if (taskStep2tasks[tsId]?.length === 0) {
            allDemandFinish = false;
          }
          return true;
        }
        if (taskStep2tasks[tsId]?.length !== 0) {
          allDemandFinish = false;
          return false;
        }
        return true;
      });
      return allDemandFinish;
    });
    if (allDemandFinish) {
      Modal.confirm({
        title: '结束迭代',
        content: `确认结束当前迭代（${iteration.name}）吗？`,
        onConfirm: () => end(iteration.id).then((resp) => setIteration(resp)),
      });
    } else {
      setNextIterationModalProps({
        visible: true,
        title: '结束迭代',
        currentId: params.iteration_id,
        projectId: params.project_id,
        onOk: (id) =>
          end(iteration.id, id).then((resp) => {
            loadDemandTask(params);
            setIteration(resp);
            setNextIterationModalProps({ visible: false });
          }),
        onCancel: () => {
          setNextIterationModalProps({ visible: false });
        },
      });
    }
  }

  return (
    <div className={styles['container']}>
      <Card>
        <SearchForm
          iteration={iteration}
          priorities={priorities}
          teamUsers={teamUsers}
          onSearch={handleSearch}
          startIteration={handleStartIteration}
          endIteration={handleEndIteration}
        />
        {!params.iteration_id && !params.project_id ? (
          <Empty description={'请选择项目迭代'} />
        ) : (
          <Kanban
            isDropDisabled={isDropDisabled}
            demandId2TaskStepTasks={demandId2TaskStepTasks}
            demandId2info={demandId2info}
            taskStepId2info={taskStepId2info}
            priorityId2color={priorityId2color}
            taskTypeKey2name={taskTypeKey2name}
            demandTypeKey2name={demandTypeKey2name}
            userId2fullName={userIdId2fullName}
            handleNewTask={handleNewTask}
            handleDeleteTask={handleDeleteTask}
            handleMoveTask={handleTaskMove}
          />
        )}
      </Card>

      <NextIterationModal {...nextIterationModalProps} />
    </div>
  );
}

export default IterationPlanning;
