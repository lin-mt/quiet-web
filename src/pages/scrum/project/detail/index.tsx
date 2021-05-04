import React, { useEffect, useState } from 'react';
import { findProjectDetail } from '@/services/scrum/ScrumProject';
import { Col, Descriptions, Empty, Row, Spin, Tag } from 'antd';
import { tagColor } from '@/utils/RenderUtils';
import DemandPool from '@/pages/scrum/project/detail/components/DemandPool';
import DemandPlanning from '@/pages/scrum/project/detail/components/DemandPlanning';
import PlanningIteration from '@/pages/scrum/project/detail/components/PlanningIteration';
import { useModel } from 'umi';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import { findAllByTemplateId } from '@/services/scrum/ScrumPriority';
import type { ScrumProjectDetail } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';

const ProjectDetail: React.FC<any> = (props) => {
  const { projectId, setProjectId, members, setMembers, setPriorities } = useModel(PROJECT_DETAIL);

  const [loading, setLoading] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<ScrumProjectDetail>();

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
            <Col span={8}>
              <DemandPool />
            </Col>
            <Col span={8}>
              <DemandPlanning />
            </Col>
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
