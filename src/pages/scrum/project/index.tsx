import React, { useEffect, useState } from 'react';
import { allMyProjects } from '@/services/scrum/ScrumProject';
import ProjectList from '@/pages/scrum/project/components/ProjectList';

const Project: React.FC<any> = () => {
  const [projectManaged, setProjectManaged] = useState<ScrumEntities.ScrumProject[]>([]);
  const [projectInvolved, setProjectInvolved] = useState<ScrumEntities.ScrumProject[]>([]);

  function loadAllMyProject() {
    allMyProjects().then((resp) => {
      setProjectManaged(resp.projectManaged);
      setProjectInvolved(resp.projectInvolved);
    });
  }

  useEffect(() => {
    loadAllMyProject();
  }, []);

  return (
    <>
      <ProjectList
        title={'管理的项目'}
        projects={projectManaged}
        newProject={true}
        canSetting={true}
        canEdit={true}
        canDelete={true}
        cardSize={'small'}
        afterUpdateAction={loadAllMyProject}
      />
      {projectInvolved.length > 0 && (
        <ProjectList title={'参与的项目'} projects={projectInvolved} />
      )}
    </>
  );
};
export default Project;
