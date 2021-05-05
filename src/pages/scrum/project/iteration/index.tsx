import type { PropsWithChildren } from 'react';

export default (props: PropsWithChildren<any>) => {
  return <>{props.location.query.iterationId}</>;
};
