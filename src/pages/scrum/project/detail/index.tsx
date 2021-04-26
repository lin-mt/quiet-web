import React, { useEffect, useState } from 'react';
import { findProjectDetail } from '@/services/scrum/ScrumProject';
import { Card, Col, Descriptions, Row, Tag } from 'antd';
import { quietColor } from '@/utils/RenderUtils';
import DemandPoolList from '@/pages/scrum/project/detail/components/DemandPoolList';

type ScrumProjectDetail = {
  project: ScrumEntities.ScrumProject;
  teams: SystemEntities.QuietTeam[];
  versions: ScrumEntities.ScrumPriority[];
};

const ProjectDetail: React.FC<any> = (props) => {
  const [projectDetail, setProjectDetail] = useState<ScrumProjectDetail>();

  useEffect(() => {
    const fetchProjectDetail = async () => {
      setProjectDetail(await findProjectDetail(props.location.query.projectId));
    };
    fetchProjectDetail();
  }, [props.location.query.projectId]);

  return (
    <>
      <Descriptions title={projectDetail?.project.name}>
        <Descriptions.Item span={3}>{projectDetail?.project.description}</Descriptions.Item>
        <Descriptions.Item label={'项目经理'}>
          {projectDetail?.project.managerName}
        </Descriptions.Item>
        <Descriptions.Item label={'创建时间'} span={2}>
          {projectDetail?.project.gmtCreate}
        </Descriptions.Item>
        <Descriptions.Item label={'参与团队'}>
          {projectDetail?.teams.map((team) => {
            return (
              <Tag color={quietColor} key={team.id}>
                {team.teamName}
              </Tag>
            );
          })}
        </Descriptions.Item>
        <Descriptions.Item label={'项目成员'} span={2}>
          {projectDetail?.teams.map((team) => {
            return team.members?.map((member) => {
              return (
                <Tag color={quietColor} key={member.id}>
                  {member.fullName}
                </Tag>
              );
            });
          })}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={8}>
          <DemandPoolList />
        </Col>
        <Col span={8}>
          <Card title="需求管理" bordered={false}>
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="版本管理" bordered={false}>
            Card content
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProjectDetail;
