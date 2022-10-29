import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import {
  Button,
  Card,
  Typography,
  Modal,
  Switch,
  Grid,
  Space,
} from '@arco-design/web-react';
import { IconCopy } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { ScrumTemplate } from '@/service/scrum/type';
import { enabledTemplate } from '@/service/scrum/template';
import { enabled } from '@/utils/render';
const { Row, Col } = Grid;

interface CardTemplateProps {
  template: ScrumTemplate;
  onDelete?: (id: string) => void;
  onEdit?: (template: ScrumTemplate) => void;
  loading?: boolean;
}

function CardTemplate(props: CardTemplateProps) {
  const [loading, setLoading] = useState(props.loading);
  const [templateEnabled, setTemplateEnabled] = useState(
    props.template.enabled
  );

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  const className = cs(styles['card-block'], styles['template-card']);

  function handleTemplateEnabledChange(value: boolean) {
    setLoading(true);
    enabledTemplate({ id: props.template.id, enabled: value })
      .then(() => {
        setTemplateEnabled(value);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Card
      bordered
      className={className}
      style={{ height: 170 }}
      size="small"
      title={
        <Row>
          <Col flex={'32px'}>
            <div className={styles.icon}>
              <IconCopy />
            </div>
          </Col>
          <Col flex={'auto'}>
            <Space
              size={3}
              direction={'vertical'}
              className={cs(styles.title, {
                [styles['title-more']]: true,
              })}
            >
              <div className={cs(styles.title)}>{props.template.name}</div>
              <div className={styles.time}>{props.template.gmt_create}</div>
            </Space>
          </Col>
          <Col flex={'39px'}>
            <div style={{ marginRight: 0 }}>
              <Switch
                checked={templateEnabled}
                checkedText={enabled(true)}
                uncheckedText={enabled(false)}
                onChange={handleTemplateEnabledChange}
              />
            </div>
          </Col>
        </Row>
      }
    >
      <div className={styles.content}>
        <Typography.Text
          ellipsis={{
            cssEllipsis: true,
            rows: 2,
            showTooltip: { type: 'tooltip' },
          }}
          style={{ height: 50 }}
        >
          {props.template.remark}
        </Typography.Text>
      </div>
      <div className={styles.extra}>
        <Button
          type="primary"
          loading={loading}
          style={{ marginLeft: '12px' }}
          onClick={() => {
            if (props.onEdit) {
              props.onEdit(props.template);
            }
          }}
        >
          {'编辑'}
        </Button>
        <Button
          loading={loading}
          status={'danger'}
          onClick={() =>
            Modal.confirm({
              title: `确认删除模板 ${props.template.name} 吗？`,
              onOk: () => {
                if (props.onDelete) {
                  props.onDelete(props.template.id);
                }
              },
            })
          }
        >
          {'删除'}
        </Button>
      </div>
    </Card>
  );
}

export default CardTemplate;
