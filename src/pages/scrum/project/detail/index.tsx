import React, { useEffect, useState } from 'react';
import { findProjectDetail } from '@/services/scrum/ScrumProject';
import { Col, Descriptions, Empty, Row, Spin, Tag } from 'antd';
import { tagColor } from '@/utils/RenderUtils';
import DemandPoolList from '@/pages/scrum/project/detail/components/DemandPool';
import DemandPlanning from '@/pages/scrum/project/detail/components/DemandPlanning';
import PlanningIteration from '@/pages/scrum/project/detail/components/PlanningIteration';
import { useModel } from 'umi';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';

const ProjectDetail: React.FC<any> = (props) => {
  const { projectId, setProjectId, members, setMembers } = useModel(PROJECT_DETAIL);

  const [loading, setLoading] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<ScrumEntities.ScrumProjectDetail>();

  useEffect(() => {
    setProjectId(props.location.query.projectId);
    if (projectId) {
      setLoading(true);
      findProjectDetail(projectId).then((project) => {
        setProjectDetail(project);
        const membersDatum: Record<string, string> = {};
        project.teams.forEach((team) => {
          if (team.members) {
            team.members.forEach((member) => {
              membersDatum[member.id] = member.fullName;
            });
          }
        });
        setMembers(membersDatum);
        setLoading(false);
      });
    }
  }, [projectId, props.location.query.projectId, setMembers, setProjectId]);

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
                    {members[id]}
                  </Tag>
                );
              })}
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={9}>
            <Col span={8}>
              <DemandPoolList />
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
