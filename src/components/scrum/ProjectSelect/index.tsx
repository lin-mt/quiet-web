import React, { useEffect, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { Button, Empty, Select, Space } from '@arco-design/web-react';
import { listProject } from '@/service/scrum/project';
import { IconPlus } from '@arco-design/web-react/icon';
import NProgress from 'nprogress';
import { useHistory } from 'react-router';

export function ProjectSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      groupId?: string;
    }
) {
  const history = useHistory();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listProject(props.groupId, '')
      .then((resp) => {
        return setOptions(
          resp.map((project) => ({
            label: project.name,
            value: project.id,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [props.groupId]);

  return (
    <Select
      loading={loading}
      showSearch
      options={options}
      filterOption={false}
      notFoundContent={
        <Empty
          description={
            <Space direction={'vertical'}>
              该项目组下无项目信息
              <Button
                type={'text'}
                icon={<IconPlus />}
                onClick={() => {
                  NProgress.start();
                  history.push('/scrum/project-manager');
                  NProgress.done();
                }}
              >
                创建项目
              </Button>
            </Space>
          }
        />
      }
      {...props}
    />
  );
}

export default ProjectSelect;
