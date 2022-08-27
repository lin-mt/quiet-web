import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@arco-design/web-react';
import SearchForm from '@/pages/system/team-manager/search-form';
import styles from '@/pages/system/team-manager/style/index.module.less';
import CardAddTeam from '@/pages/system/team-manager/card-add-team';
import CardTeam from '@/pages/system/team-manager/card-team';
import { QuietTeam } from '@/service/system/type';
import {
  deleteTeam,
  getTeam,
  listTeams,
  saveTeam,
  updateTeam,
} from '@/service/system/quiet-team';
import TeamForm, { TeamFormProps } from '@/components/TeamForm';

const { Row, Col } = Grid;

function TeamManager() {
  const [teams, setTeams] = useState<QuietTeam[]>([]);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(true);
  const [teamFormProps, setTeamFormProps] = useState<TeamFormProps>({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  function fetchData() {
    setLoading(true);
    listTeams(params)
      .then((resp) => setTeams(resp))
      .finally(() => setLoading(false));
  }

  return (
    <div className={styles.container}>
      <Card>
        <SearchForm onSearch={(value) => setParams(value)} />
        <Row gutter={24} className={styles['card-content']}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
            <CardAddTeam
              description={'创建团队'}
              onClick={() =>
                setTeamFormProps({
                  visible: true,
                  title: '创建团队',
                  onOk: (newTeam) => {
                    return saveTeam(newTeam).then(() => {
                      fetchData();
                      setTeamFormProps({ visible: false });
                    });
                  },
                  onCancel: () => setTeamFormProps({ visible: false }),
                })
              }
            />
          </Col>
          {teams?.map((team) => {
            return (
              <Col key={team.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <CardTeam
                  team={team}
                  onEdit={(value) => {
                    getTeam(value.id).then((resp) => {
                      setTeamFormProps({
                        teamInfo: resp,
                        visible: true,
                        onOk: (newTeam) => {
                          return updateTeam(newTeam).then(() => {
                            fetchData();
                            setTeamFormProps({ visible: false });
                          });
                        },
                      });
                    });
                  }}
                  onDelete={(id) => {
                    deleteTeam(id).then(() => {
                      fetchData();
                    });
                  }}
                  loading={loading}
                />
              </Col>
            );
          })}
        </Row>
      </Card>
      <TeamForm
        onCancel={() => setTeamFormProps({ visible: false })}
        {...teamFormProps}
      />
    </div>
  );
}

export default TeamManager;
