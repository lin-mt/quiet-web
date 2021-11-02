import { Button, Col, Input, Row, Select } from 'antd';
import type { ApiDetail, DocProject } from '@/services/doc/EntityType';
import type { DocProjectEnvironment } from '@/services/doc/EntityType';
import { useEffect, useState } from 'react';
import { listByProjectId } from '@/services/doc/DocProjectEnvironment';
import { HttpProtocol } from '@/services/doc/Enums';

interface ApiRunProps {
  apiDetail: ApiDetail;
  projectInfo: DocProject;
}

export default function ApiRun(props: ApiRunProps) {
  const { apiDetail, projectInfo } = props;
  const [environments, setEnvironments] = useState<DocProjectEnvironment[]>([]);

  useEffect(() => {
    if (projectInfo.id) {
      listByProjectId(projectInfo.id).then((resp) => setEnvironments(resp));
    }
  }, [projectInfo.id]);

  return (
    <div>
      <Input.Group style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Input
          value={apiDetail.api.method}
          disabled={true}
          style={{ color: 'rgba(0, 0, 0, 0.69)', width: '8%', textAlign: 'center' }}
        />
        {environments.length > 0 ? (
          <Select value={environments[0].id} style={{ width: '20%' }}>
            {environments.map((environment) => {
              if (environment.id) {
                return (
                  <Select.Option key={environment.id} value={environment.id}>{`${
                    environment.name
                  }：${environment.protocol === HttpProtocol.HTTP ? 'http://' : 'https://'}${
                    environment.base_path
                  }`}</Select.Option>
                );
              }
              return;
            })}
          </Select>
        ) : (
          <Input
            value={'http://127.0.0.1'}
            disabled={true}
            style={{ color: 'rgba(0, 0, 0, 0.69)', width: '20%' }}
          />
        )}
        <Input
          value={projectInfo.base_path + apiDetail.api.path}
          disabled={true}
          style={{ color: 'rgba(0, 0, 0, 0.69)', width: '60%' }}
        />
        <Button type={'primary'} style={{ width: '8%', float: 'right' }}>
          运行
        </Button>
      </Input.Group>
      <Row gutter={21} style={{ marginTop: 20 }}>
        <Col span={12}>{props.apiDetail.api.id}</Col>
        <Col span={12}>{props.projectInfo.id}</Col>
      </Row>
    </div>
  );
}
