import { Button } from 'antd';
import type { ApiDetail, DocProject } from '@/services/doc/EntityType';

interface ApiRunProps {
  apiDetail: ApiDetail;
  projectInfo: DocProject;
}

export default function ApiRun(props: ApiRunProps) {
  return (
    <div>
      {props.apiDetail.api.id}
      {props.projectInfo.id}
      <Button>运行</Button>
    </div>
  );
}
