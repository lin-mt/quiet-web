import React, {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Card, Empty, Grid } from '@arco-design/web-react';
import ApiGroupManager, {
  ApiGroupManagerRefProps,
  ClickNode,
  NodeType,
} from '@/pages/doc/api-manager/api/api-group-manager';
import ApiGroupListApi from '@/pages/doc/api-manager/api/api-group-list-api';
import ApiDetail from '@/pages/doc/api-manager/api/api-detail';
import { getQueryParams } from '@/utils/getUrlParams';
import { DocProject } from '@/service/doc/type';
import { getProjectInfo } from '@/service/doc/project';

const { Row, Col } = Grid;

export type ApiProps = {
  projectId: string;
};

export type ApiContextProps = {
  reloadApiGroupInfo?: () => void;
};

export const ApiContext = createContext<ApiContextProps>({});

function Api(props: ApiProps) {
  const [selectedApi, setSelectedApi] = useState<string>();
  const [projectInfo, setProjectInfo] = useState<DocProject>();
  const [content, setContent] = useState<ReactNode>();
  const query = getQueryParams();

  const apiGroupManagerRef = useRef<ApiGroupManagerRefProps>(null);

  useEffect(() => {
    buildContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getProjectInfo(props.projectId).then((project) => setProjectInfo(project));
  }, [props.projectId]);

  function buildContent(node?: ClickNode) {
    let result: ReactNode;
    let apiId: string;
    let apiGroupId: string;
    if (node) {
      setSelectedApi(node.id);
      if (NodeType.API === node.type) {
        apiId = node.id;
      } else {
        apiGroupId = node.id;
      }
    } else {
      apiId = query.apiId;
      apiGroupId = query.apiGroupId;
    }
    if (apiId) {
      result = projectInfo && (
        <ApiDetail apiId={apiId} projectInfo={projectInfo} />
      );
    }
    if (apiGroupId || (node && NodeType.API_GROUP === node.type)) {
      result = (
        <ApiGroupListApi
          projectId={props.projectId}
          groupId={apiGroupId}
          onClickApi={(api) => {
            buildContent({
              type: NodeType.API,
              id: api.id,
              name: api.name,
            });
          }}
          name={node ? node.name : undefined}
        />
      );
    }
    if (!result) {
      result = (
        <Card>
          <Empty description={'请选择接口分组或接口'} />
        </Card>
      );
    }
    setContent(result);
    let url = `/doc/api-manager?projectId=${props.projectId}`;
    if (node && NodeType.API === node.type) {
      url = `${url}&apiId=${node.id}`;
    } else {
      if (node && node.id) {
        url = `${url}&apiGroupId=${node.id}`;
      }
    }
    history.replaceState(null, null, `${url}`);
  }

  function reloadApiGroupInfo() {
    apiGroupManagerRef.current.reload();
  }

  return (
    <Row gutter={16}>
      <Col span={5}>
        <ApiGroupManager
          ref={apiGroupManagerRef}
          projectId={props.projectId}
          activeId={selectedApi}
          onTreeNodeClick={(node) => buildContent(node)}
        />
      </Col>
      <ApiContext.Provider value={{ reloadApiGroupInfo }}>
        <Col span={19}>{content}</Col>
      </ApiContext.Provider>
    </Row>
  );
}

export default Api;
