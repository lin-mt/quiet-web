import React, { useEffect, useRef, useState } from 'react';
import { Card, Empty, Grid, Message } from '@arco-design/web-react';
import ScrumPlanningSelect, {
  LocalParamKeys,
} from '@/components/scrum/ScrumPlanningSelect';
import DemandPool, {
  DemandPoolRefProps,
} from '@/pages/scrum/demand-planning/demand-pool';
import { ScrumPriority } from '@/service/scrum/type';
import { findEnabledDict } from '@/service/system/quiet-dict';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import IterationPlanning, {
  IterationPlanningRefProps,
} from '@/pages/scrum/demand-planning/iteration-planning';
import { updateDemand } from '@/service/scrum/demand';

const { Row, Col } = Grid;

export enum DroppableId {
  IterationPlanning = 'IterationPlanning',
  DemandPool = 'DemandPool',
}

function DemandPlanning() {
  const [projectId, setProjectId] = useState<string>();
  const [versionId, setVersionId] = useState<string>();
  const [iterationId, setIterationId] = useState<string>();
  const [iterations, setIterations] = useState([]);
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);
  const [priorityId2Color, setPriorityId2Color] = useState<
    Record<string, string>
  >({});
  const [typeKey2Name, setTypeKey2Name] = useState<Record<string, string>>({});
  const demandPoolRef = useRef<DemandPoolRefProps>();
  const iterationPlanningRef = useRef<IterationPlanningRefProps>();

  useEffect(() => {
    findEnabledDict(null, 'quiet-scrum', 'demand-type').then((resp) => {
      const key2Name: Record<string, string> = {};
      resp.forEach((p) => (key2Name[p.key] = p.name));
      setTypeKey2Name(key2Name);
    });
  }, []);

  useEffect(() => {
    if (!projectId) {
      setPriorities([]);
      return;
    }
    getProject(projectId).then((resp) => {
      listPriority(resp.template_id).then((sps) => {
        const id2Color: Record<string, string> = {};
        sps.forEach((p) => (id2Color[p.id] = p.color_hex));
        setPriorityId2Color(id2Color);
        setPriorities(sps);
      });
    });
  }, [projectId]);

  function handleVersionChange(vId, is) {
    setVersionId(vId);
    setIterationId(undefined);
    setIterations(is?.map((i) => ({ value: i.id, label: i.name })));
  }

  function handleDemandDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    if (destination.droppableId === DroppableId.IterationPlanning) {
      if (!iterationId) {
        Message.warning('请选择需求要规划的迭代！');
        return;
      }
      const operationDemand =
        demandPoolRef.current.getDemandByDraggableId(draggableId);
      operationDemand.iteration_id = iterationId;
      updateDemand(operationDemand).then((resp) => {
        demandPoolRef.current.updateDemand(resp, source.index);
        iterationPlanningRef.current.addDemand(resp, destination.index);
      });
    }
    if (destination.droppableId === DroppableId.DemandPool) {
      const operationDemand =
        iterationPlanningRef.current.getDemandByDraggableId(draggableId);
      operationDemand.iteration_id = undefined;
      updateDemand(operationDemand).then((resp) => {
        iterationPlanningRef.current.removeDemand(source.index);
        demandPoolRef.current.updateDemand(resp, destination.index);
      });
    }
  }

  function handleDemandPoolUpdateDemand(demand) {
    iterationPlanningRef.current.updateDemand(demand);
  }

  function handleDemandPoolDeleteDemand(id) {
    iterationPlanningRef.current.removeDemandById(id);
  }

  function handleIterationPlanningUpdateDemand(demand) {
    demandPoolRef.current.updateDemand(demand, -1);
  }

  function handleIterationPlanningDeleteDemand(id) {
    demandPoolRef.current.removeDemandById(id);
  }

  return (
    <Card>
      <ScrumPlanningSelect
        localParamKey={LocalParamKeys.DEMAND_PLANNING}
        localParams={(params) => {
          setProjectId(params.projectId);
          setVersionId(params.versionId);
        }}
        onProjectChange={(id) => setProjectId(id)}
        onVersionIdChange={handleVersionChange}
        handleIterationsChange={(is) => {
          setIterations(is?.map((i) => ({ value: i.id, label: i.name })));
        }}
      />
      {!projectId ? (
        <Empty description={'请选择规划项目'} />
      ) : (
        <Row gutter={15}>
          <DragDropContext onDragEnd={handleDemandDragEnd}>
            <Col span={12}>
              <DemandPool
                ref={demandPoolRef}
                projectId={projectId}
                priorities={priorities}
                priorityId2Color={priorityId2Color}
                typeKey2Name={typeKey2Name}
                afterUpdate={handleDemandPoolUpdateDemand}
                afterDelete={handleDemandPoolDeleteDemand}
              />
            </Col>
            <Col span={12}>
              {!versionId ? (
                <Card>
                  <Empty
                    style={{ paddingTop: 60 }}
                    description={'请选择规划版本'}
                  />
                </Card>
              ) : (
                <IterationPlanning
                  ref={iterationPlanningRef}
                  iterations={iterations}
                  iterationId={iterationId}
                  priorityId2Color={priorityId2Color}
                  typeKey2Name={typeKey2Name}
                  handleIterationSelected={(id) => setIterationId(id)}
                  afterUpdate={handleIterationPlanningUpdateDemand}
                  afterDelete={handleIterationPlanningDeleteDemand}
                />
              )}
            </Col>
          </DragDropContext>
        </Row>
      )}
    </Card>
  );
}

export default DemandPlanning;
