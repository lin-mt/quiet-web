import React, { useEffect, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import NProgress from 'nprogress';
import { Button, Empty, Select, Space } from '@arco-design/web-react';
import { listProjectGroup } from '@/service/scrum/project-group';
import { IconPlus } from '@arco-design/web-react/icon';
import { useHistory } from 'react-router';

export const PERSONAL_SPACE_VALUE = 'personal-space';

export function ProjectGroupSelect(
  props: SelectProps & React.RefAttributes<SelectHandle>
) {
  const personalSpace = { label: '个人空间', value: PERSONAL_SPACE_VALUE };
  const history = useHistory();
  const [options, setOptions] = useState([personalSpace]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listProjectGroup()
      .then((resp) => {
        setOptions(
          [personalSpace].concat(
            ...resp.map((projectGroup) => ({
              label: projectGroup.name,
              value: projectGroup.id,
            }))
          )
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      showSearch
      loading={loading}
      options={options}
      filterOption={(value, option) =>
        option.props.value.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
        option.props.children.toLowerCase().indexOf(value.toLowerCase()) >= 0
      }
      notFoundContent={
        <Empty
          description={
            <Space direction={'vertical'}>
              无项目组信息
              <Button
                type={'text'}
                icon={<IconPlus />}
                onClick={() => {
                  NProgress.start();
                  history.push('/scrum/project-manager');
                  NProgress.done();
                }}
              >
                创建项目组
              </Button>
            </Space>
          }
        />
      }
      {...props}
    />
  );
}

export default ProjectGroupSelect;
