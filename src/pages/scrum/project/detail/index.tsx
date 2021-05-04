import React, { useEffect, useRef, useState } from 'react';
import { findProjectDetail } from '@/services/scrum/ScrumProject';
import { Col, Descriptions, Empty, message, Row, Spin, Tag } from 'antd';
import { tagColor } from '@/utils/RenderUtils';
import DemandPool from '@/pages/scrum/project/detail/components/DemandPool';
import DemandPlanning from '@/pages/scrum/project/detail/components/DemandPlanning';
import PlanningIteration from '@/pages/scrum/project/detail/components/PlanningIteration';
import { useModel } from 'umi';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import { findAllByTemplateId } from '@/services/scrum/ScrumPriority';
import type { ScrumProjectDetail } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { planning } from '@/services/scrum/ScrumDemand';

const ProjectDetail: React.FC<any> = (props) => {
  const {
    projectId,
    setProjectId,
    members,
    setMembers,
    setPriorities,
    selectedIterationId,
  } = useModel(PROJECT_DETAIL);

  const [loading, setLoading] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<ScrumProjectDetail>();
  const demandPoolRef = useRef();
  const demandPlanningRef = useRef();

  useEffect(() => {
    setProjectId(props.location.query.projectId);
    if (projectId) {
      setLoading(true);
      findProjectDetail(projectId).then(async (project) => {
        setProjectDetail(project);
        const membersDatum: Record<string, QuietUser> = {};
        project.teams.forEach((team) => {
          if (team.members) {
            team.members.forEach((member) => {
              membersDatum[member.id] = member;
            });
          }
        });
        setMembers(membersDatum);
        await findAllByTemplateId(project.project.templateId).then((priorities) => {
          setPriorities(priorities);
          setLoading(false);
        });
      });
    }
  }, [props.location.query.projectId, projectId, setProjectId, setMembers, setPriorities]);

  function handlePlanningResult(result: boolean) {
    if (!result) {
      message.error('操作失败，请联系管理员！').then();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  function handleDemandDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    const demandId = draggableId;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    if (destination?.droppableId === 'DemandPlanning') {
      if (!selectedIterationId) {
        message.warning('请选择需求要规划的迭代！').then();
        return;
      }
      planning(demandId, selectedIterationId).then((planningResult) => {
        handlePlanningResult(planningResult);
      });
      // @ts-ignore
      const operationDemand = demandPoolRef?.current?.getDemandById(demandId);
      // @ts-ignore
      demandPoolRef?.current?.removeDemand(source.index);
      // @ts-ignore
      demandPlanningRef?.current?.addDemand(operationDemand, destination.index);
    }
    if (destination?.droppableId === 'DemandPool') {
      planning(demandId).then((planningResult) => {
        handlePlanningResult(planningResult);
      });
      // @ts-ignore
      const operationDemand = demandPlanningRef?.current?.getDemandById(demandId);
      // @ts-ignore
      demandPlanningRef?.current?.removeDemand(source.index);
      // @ts-ignore
      demandPoolRef?.current?.addDemand(operationDemand, destination.index);
    }
  }

  return (
    <>
      {loading || !projectDetail ? (
        <Empty description={null} image={null}>
          <Spin size={'large'} />
        </Empty>
      ) : (
        <>
          <Descriptions title={projectDetail.project.name}>
            <Descriptions.Item span={3}>{projectDetail.project.description}</Descriptions.Item>
            <Descriptions.Item label={'项目经理'}>
              {projectDetail.project.managerName}
            </Descriptions.Item>
            <Descriptions.Item label={'创建时间'} span={2}>
              {projectDetail.project.gmtCreate}
            </Descriptions.Item>
            <Descriptions.Item label={'参与团队'}>
              {projectDetail.teams.map((team) => {
                return (
                  <Tag color={tagColor} key={team.id}>
                    {team.teamName}
                  </Tag>
                );
              })}
            </Descriptions.Item>
            <Descriptions.Item label={'项目成员'} span={2}>
              {Object.keys(members).map((id) => {
                return (
                  <Tag color={tagColor} key={id}>
                    {members[id].fullName}
                  </Tag>
                );
              })}
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={9}>
            <DragDropContext onDragEnd={handleDemandDragEnd}>
              <Col span={8}>
                <DemandPool ref={demandPoolRef} />
              </Col>
              <Col span={8}>
                <DemandPlanning ref={demandPlanningRef} />
              </Col>
            </DragDropContext>
            <Col span={8}>
              <PlanningIteration />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProjectDetail;
