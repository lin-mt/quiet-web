import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@arco-design/web-react';
import SearchForm from '@/pages/scrum/template-manager/search-form';
import styles from '@/pages/scrum/template-manager/style/index.module.less';
import { ScrumTemplate } from '@/service/scrum/type';
import TemplateForm, {
  TemplateFormProps,
} from '@/components/scrum/TemplateForm';
import {
  deleteTemplate,
  getTemplateDetail,
  listTemplate,
  saveTemplate,
  updateTemplate,
} from '@/service/scrum/template';
import CardAddTemplate from '@/pages/scrum/template-manager/card-add-template';
import CardTemplate from '@/pages/scrum/template-manager/card-template';
import { batchSavePriorities } from '@/service/scrum/priority';
import { batchSaveTaskStep } from '@/service/scrum/task-step';

const { Row, Col } = Grid;

function TemplateManager() {
  const [templates, setTemplates] = useState<ScrumTemplate[]>([]);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(true);
  const [templateFormProps, setTemplateFormProps] = useState<TemplateFormProps>(
    {}
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  function fetchData() {
    setLoading(true);
    listTemplate({ ...params, limit: 0 })
      .then((resp) => setTemplates(resp))
      .finally(() => setLoading(false));
  }

  function handleCreateTemplate() {
    setTemplateFormProps({
      visible: true,
      title: '创建模板',
      onOk: (values) => {
        return saveTemplate(values).then(async (resp) => {
          if (values.priorities) {
            await batchSavePriorities(resp.id, values.priorities);
          }
          fetchData();
          setTemplateFormProps({ visible: false });
        });
      },
      onCancel: () => setTemplateFormProps({ visible: false }),
    });
  }

  function handleUpdateTemplate(id) {
    getTemplateDetail(id).then((resp) => {
      setTemplateFormProps({
        formValues: resp,
        visible: true,
        onOk: (values) => {
          return updateTemplate(values).then(async (resp) => {
            let updateSuccess = true;
            if (values.priorities) {
              values.priorities.forEach((v) => (v.template_id = resp.id));
              await batchSavePriorities(resp.id, values.priorities).catch(
                () => (updateSuccess = false)
              );
            }
            if (values.task_steps) {
              values.task_steps.forEach((v) => (v.template_id = resp.id));
              await batchSaveTaskStep(resp.id, values.task_steps).catch(
                () => (updateSuccess = false)
              );
            }
            fetchData();
            if (updateSuccess) {
              setTemplateFormProps({ visible: false });
            } else {
              return Promise.reject();
            }
          });
        },
      });
    });
  }

  return (
    <div className={styles.container}>
      <Card>
        <SearchForm onSearch={(value) => setParams(value)} />
        <Row gutter={24} className={styles['card-content']}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
            <CardAddTemplate
              description={'创建模板'}
              onClick={handleCreateTemplate}
            />
          </Col>
          {templates?.map((team) => {
            return (
              <Col key={team.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <CardTemplate
                  loading={loading}
                  template={team}
                  onEdit={(value) => handleUpdateTemplate(value.id)}
                  onDelete={(id) => {
                    deleteTemplate(id).then(() => {
                      fetchData();
                    });
                  }}
                />
              </Col>
            );
          })}
        </Row>
      </Card>
      <TemplateForm
        onCancel={() => setTemplateFormProps({ visible: false })}
        {...templateFormProps}
      />
    </div>
  );
}

export default TemplateManager;
