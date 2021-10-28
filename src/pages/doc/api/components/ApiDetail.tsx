import { Menu } from 'antd';
import ApiPreview from '@/pages/doc/project/detail/components/ApiPreview';
import ApiEdit from '@/pages/doc/project/detail/components/ApiEdit';
import { useEffect, useState } from 'react';
import type { ApiDetail } from '@/services/doc/EntityType';
import { getAiDetail } from '@/services/doc/DocApi';
import ApiRun from '@/pages/doc/project/detail/components/ApiRun';
import { EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';

interface ApiDetailProps {
  apiId: string;
  projectId: string;
  afterUpdate?: () => void;
}

export default (props: ApiDetailProps) => {
  const { apiId, projectId, afterUpdate } = props;

  const [apiDetail, setApiDetail] = useState<ApiDetail>();
  const [current, setCurrent] = useState<string>('preview');

  useEffect(() => {
    getAiDetail(apiId).then((detail) => setApiDetail(detail));
  }, [apiId]);

  function handleCurrentMenuChange(info: MenuInfo) {
    setCurrent(info.key);
  }

  return (
    <>
      <Menu selectedKeys={[current]} onClick={handleCurrentMenuChange} mode={'horizontal'}>
        <Menu.Item key={'preview'} icon={<EyeOutlined />}>
          预览
        </Menu.Item>
        <Menu.Item key={'edit'} icon={<EditOutlined />}>
          编辑
        </Menu.Item>
        <Menu.Item key={'run'} icon={<SendOutlined />}>
          运行
        </Menu.Item>
      </Menu>
      <div style={{ marginTop: 10 }}>
        {current === 'preview' && apiDetail && <ApiPreview apiDetail={apiDetail} />}
        {current === 'edit' && apiDetail && (
          <ApiEdit
            projectId={projectId}
            apiDetail={apiDetail}
            afterUpdate={() => {
              getAiDetail(apiId).then((detail) => setApiDetail(detail));
              if (afterUpdate) {
                afterUpdate();
              }
            }}
          />
        )}
        {current === 'run' && apiDetail && <ApiRun />}
      </div>
    </>
  );
};
