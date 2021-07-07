import React, { useEffect, useState } from 'react';
import { myProjects } from '@/services/doc/DocProject';
import ProjectList from '@/pages/doc/project/components/ProjectList';
import type { DocProject } from '@/services/doc/EntityType';
import { Empty, Spin } from 'antd';

const Project: React.FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [responsibleProject, setResponsibleProjects] = useState<DocProject[]>([]);
  const [accessibleProjects, setAccessibleProjects] = useState<DocProject[]>([]);

  function loadAllMyProject() {
    setLoading(true);
    myProjects().then((resp) => {
      setResponsibleProjects(resp.responsibleProjects);
      setAccessibleProjects(resp.accessibleProjects);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadAllMyProject();
  }, []);

  return (
    <>
      {loading ? (
        <Empty description={null} image={<Spin size={'large'} />} />
      ) : (
        <>
          <ProjectList
            title={'负责的项目'}
            projects={responsibleProject}
            newProject={true}
            editable={true}
            cardSize={'small'}
            afterAction={loadAllMyProject}
          />
          {accessibleProjects.length > 0 && (
            <ProjectList title={'可访问的项目'} projects={accessibleProjects} />
          )}
        </>
      )}
    </>
  );
};
export default Project;
