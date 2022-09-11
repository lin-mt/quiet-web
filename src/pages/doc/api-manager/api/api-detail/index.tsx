import React from 'react';
import { Card } from '@arco-design/web-react';
import { BlockTitle } from '@/components/doc/styled';

export type ApiDetailProps = {
  apiId: string;
};

function ApiDetail(props: ApiDetailProps) {
  return (
    <Card>
      <BlockTitle>ApiDetail : {props.apiId}</BlockTitle>
    </Card>
  );
}

export default ApiDetail;
