import React, { MouseEventHandler } from 'react';
import { Card } from '@arco-design/web-react';
import cs from 'classnames';
import { IconPlus } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';

interface AddTemplateCardProps {
  description?: string;
  onClick?: MouseEventHandler;
}
function CardAddTemplate(props: AddTemplateCardProps) {
  return (
    <Card
      className={cs(styles['card-block'], styles['add-card'])}
      title={null}
      style={{ height: 170 }}
      bordered
      onClick={props.onClick}
      size="small"
    >
      <div className={styles.content}>
        <div className={styles['add-icon']}>
          <IconPlus />
        </div>
        <div className={styles.description}>{props.description}</div>
      </div>
    </Card>
  );
}

export default CardAddTemplate;