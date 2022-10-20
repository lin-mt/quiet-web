import React, { useState } from 'react';
import { Card } from '@arco-design/web-react';
import SearchForm, { Params } from '@/pages/scrum/iteration-kanban/search-form';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';

function IterationPlanning() {
  const [params, setParams] = useState<Params>();

  return (
    <div className={styles['container']}>
      <Card style={{ height: 700 }}>
        <SearchForm onSearch={(value) => setParams(value)} />
      </Card>
    </div>
  );
}

export default IterationPlanning;
