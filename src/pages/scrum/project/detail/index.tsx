import React, { useEffect, useState } from 'react';
import { findProjectDetail } from '@/services/scrum/ScrumProject';
import { Col, Descriptions, Result, Row, Spin, Tag } from 'antd';
import { tagColor } from '@/utils/RenderUtils';
import DemandPoolList from '@/pages/scrum/project/detail/components/DemandPool';
import DemandPlanning from '@/pages/scrum/project/detail/components/DemandPlanning';
import PlanningIteration from '@/pages/scrum/project/detail/components/PlanningIteration';

const ProjectDetail: React.FC<any> = (props) => {
  const [projectDetail, setProjectDetail] = useState<ScrumEntities.ScrumProjectDetail>();
  const [projectMembers, setProjectMembers] = useState<Map<string, string>>(
    new Map<string, string>(),
  );

  useEffect(() => {
    findProjectDetail(props.location.query.projectId).then((project) => {
      setProjectDetail(project);
      const membersDatum: Map<string, string> = new Map<string, string>();
      project.teams.forEach((team) => {
        if (team.members) {
          team.members.forEach((member) => {
            if (!membersDatum.has(member.id)) {
              membersDatum.set(member.id, member.fullName);
            }
          });
        }
      });
      setProjectMembers(membersDatum);
    });
  }, [props.location.query.projectId]);

  return (
    <>
      {!projectDetail ? (
        <Result title={<Spin size={'large'} />} />
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
              {[...projectMembers.entries()].map(([id, fullName]) => {
                return (
                  <Tag color={tagColor} key={id}>
                    {fullName}
                  </Tag>
                );
              })}
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={16}>
            <Col span={8}>
              <DemandPoolList projectId={projectDetail.project.id} />
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
