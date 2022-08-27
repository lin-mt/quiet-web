import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import {
  Button,
  Card,
  Typography,
  Skeleton,
  Modal,
} from '@arco-design/web-react';
import { IconUserGroup } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { QuietTeam } from '@/service/system/type';

interface CardTeamProps {
  team: QuietTeam;
  onDelete?: (id: string) => void;
  onEdit?: (team: QuietTeam) => void;
  loading?: boolean;
}

function CardTeam(props: CardTeamProps) {
  const [loading, setLoading] = useState(props.loading);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  const className = cs(styles['card-block'], styles['team-card']);

  return (
    <Card
      bordered={true}
      className={className}
      style={{ height: 170 }}
      size="small"
      title={
        loading ? (
          <Skeleton
            animation
            text={{ rows: 1, width: ['100%'] }}
            style={{ width: '120px', height: '24px' }}
            className={styles['card-block-skeleton']}
          />
        ) : (
          <>
            <div
              className={cs(styles.title, {
                [styles['title-more']]: true,
              })}
            >
              <div className={styles.icon}>
                <IconUserGroup />
              </div>
              <div className={cs(styles.title)}>{props.team.team_name}</div>
            </div>
            <div className={styles.time}>{props.team.gmt_create}</div>
          </>
        )
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
          {props.team.slogan}
        </Typography.Text>
      </div>
      <div className={styles.extra}>
        <Button
          type="primary"
          style={{ marginLeft: '12px' }}
          loading={loading}
          onClick={() => {
            if (props.onEdit) {
              props.onEdit(props.team);
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
              title: `确认删除团队 ${props.team.team_name} 吗？`,
              onOk: () => {
                if (props.onDelete) {
                  props.onDelete(props.team.id);
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

export default CardTeam;
