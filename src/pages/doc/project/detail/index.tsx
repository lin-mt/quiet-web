import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import styled from 'styled-components';
import { getProjectInfo } from '@/services/doc/DocProject';
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import Interface from '@/pages/doc/project/detail/interface';
import Setting from '@/pages/doc/project/detail/setting';
import type { MenuInfo } from 'rc-menu/es/interface';
import type { DocProject } from '@/services/doc/EntityType';

const DetailContainer = styled.div`
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  background-color: white;
`;

export const ApiTitle = styled.h2`
  display: flex;
  align-items: center;
  height: 32px;
  float: left;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
  font-weight: 399;
  margin: 0;
`;

const ProjectDetails: React.FC<any> = (props) => {
  const { projectId } = props.location.query;

  const [current, setCurrent] = useState<string>('interface');
  const [projectInfo, setProjectInfo] = useState<DocProject>();

  useEffect(() => {
    getProjectInfo(projectId).then((info) => setProjectInfo(info));
  }, [projectId]);

  function handleCurrentMenuChange(info: MenuInfo) {
    setCurrent(info.key);
  }

  return (
    <DetailContainer>
      <div style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 195px)' }}>
        <Menu selectedKeys={[current]} onClick={handleCurrentMenuChange} mode={'horizontal'}>
          <Menu.Item key={'interface'} icon={<FileTextOutlined />}>
            接口
          </Menu.Item>
          <Menu.Item key={'setting'} icon={<SettingOutlined />}>
            设置
          </Menu.Item>
        </Menu>
        {current === 'interface' && projectInfo && <Interface projectInfo={projectInfo} />}
        {current === 'setting' && projectInfo && (
          <div style={{ marginTop: 10 }}>
            <Setting projectInfo={projectInfo} />
          </div>
        )}
      </div>
    </DetailContainer>
  );
};

export default ProjectDetails;
