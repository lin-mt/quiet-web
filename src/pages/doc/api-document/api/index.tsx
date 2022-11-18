import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Card, Empty, Grid } from '@arco-design/web-react';
import ApiGroupManager, {
  ApiGroupManagerRefProps,
  ClickNode,
  NodeType,
} from '@/pages/doc/api-document/api/api-group-manager';
import ApiGroupListApi from '@/pages/doc/api-document/api/api-group-list-api';
import ApiDetail from '@/pages/doc/api-document/api/api-detail';
import {
  ApiManagerContext,
  ApiManagerContextProps,
} from '@/pages/doc/api-document';

const { Row, Col } = Grid;

export type ApiContextProps = {
  reloadApiGroupInfo?: () => void;
};

export const ApiContext = createContext<ApiContextProps>({});

function Api() {
  const apiManagerContext =
    useContext<ApiManagerContextProps>(ApiManagerContext);
  const [content, setContent] = useState<ReactNode>();

  const apiGroupManagerRef = useRef<ApiGroupManagerRefProps>(null);

  useEffect(() => {
    buildContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiManagerContext.queryParams.project_id]);

  function buildContent(node?: ClickNode) {
    let result: ReactNode;
    let apiId: string;
    let apiGroupId: string;
    if (node) {
      if (NodeType.API === node.type) {
        apiId = node.id;
        apiManagerContext.setQueryParams((prevState) => {
          return {
            ...prevState,
            api_id: node.id,
            api_group_id: node.api_group_id,
          };
        });
      } else {
        apiGroupId = node.id;
        apiManagerContext.setQueryParams((prevState) => {
          return { ...prevState, api_group_id: node.id, api_id: undefined };
        });
      }
    } else {
      apiId = apiManagerContext.queryParams.api_id;
      apiGroupId = apiManagerContext.queryParams.api_group_id;
    }
    if (apiId) {
      result = <ApiDetail apiId={apiId} />;
    } else if (apiGroupId || (node && NodeType.API_GROUP === node.type)) {
      result = (
        <ApiGroupListApi
          groupId={apiGroupId}
          tableDataVersion={node?.refreshContent ? Math.random() : undefined}
          onClickApi={(api) => {
            buildContent({
              type: NodeType.API,
              id: api.id,
              name: api.name,
            });
            apiManagerContext.setQueryParams((prevState) => {
              return {
                ...prevState,
                api_group_id: api.api_group_id,
                api_id: api.id,
              };
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
  }

  function reloadApiGroupInfo() {
    apiGroupManagerRef.current.reload();
  }

  return (
    <Row gutter={16}>
      <Col span={5}>
        <ApiGroupManager
          ref={apiGroupManagerRef}
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
