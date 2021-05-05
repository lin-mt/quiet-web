import React, { useEffect, useState } from 'react';
import { allMyProjects } from '@/services/scrum/ScrumProject';
import ProjectList from '@/pages/scrum/project/components/ProjectList';
import type { ScrumProject } from '@/services/scrum/EntitiyType';
import { useModel } from 'umi';
import { DICTIONARY } from '@/constant/system/Modelnames';
import { DictionaryType } from '@/types/Type';

const Project: React.FC<any> = () => {
  const { initDictionaries } = useModel(DICTIONARY);

  const [projectManaged, setProjectManaged] = useState<ScrumProject[]>([]);
  const [projectInvolved, setProjectInvolved] = useState<ScrumProject[]>([]);

  function loadAllMyProject() {
    allMyProjects().then((resp) => {
      setProjectManaged(resp.projectManaged);
      setProjectInvolved(resp.projectInvolved);
    });
  }

  useEffect(() => {
    initDictionaries([DictionaryType.DemandType]);
    loadAllMyProject();
  }, [initDictionaries]);

  return (
    <>
      <ProjectList
        title={'管理的项目'}
        projects={projectManaged}
        newProject={true}
        editable={true}
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
