import React from 'react';

const ProjectDetail: React.FC<any> = (props) => {
  return <>{props.location.query.projectId}</>;
};

export default ProjectDetail;
