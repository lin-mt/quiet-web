import type { PropsWithChildren } from 'react';

export default (props: PropsWithChildren<any>) => {
  return (
    <>
      ProjectId: {props.location.query.projectId}
      <br />
      iterationId: {props.location.query.iterationId}
    </>
  );
};
