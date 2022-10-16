import React, { useState } from 'react';
import { Input, Select } from '@arco-design/web-react';
import { ScrumPriority } from '@/service/scrum/type';

export type DemandFilterParams = {
  priority_id?: string;
  planned?: string;
  title?: string;
};

export type DemandFilterProps = {
  loading?: boolean;
  priorities: ScrumPriority[];
  onSearch?: (params: DemandFilterParams) => void;
};

function DemandFilter(props: DemandFilterProps) {
  const [priorityId, setPriorityId] = useState<string>();
  const [planned, setPlanned] = useState();
  const [title, setTitle] = useState<string>();

  function handleOnSearch() {
    if (props.onSearch) {
      props.onSearch({ priority_id: priorityId, planned, title });
    }
  }

  return (
    <div style={{ width: 500, marginRight: 16 }}>
      <Input.Group>
        <Select
          allowClear
          value={priorityId}
          style={{ width: '20%', marginRight: 8 }}
          placeholder={'优先级'}
          options={props.priorities.map((p) => ({
            value: p.id,
            label: p.name,
          }))}
          onChange={(value) => setPriorityId(value)}
        />
        <Select
          allowClear
          value={planned}
          placeholder={'需求状态'}
          style={{ width: '20%', marginRight: 8 }}
          onChange={(value) => setPlanned(value)}
          options={[
            { label: '待规划', value: 'false' },
            { label: '已规划', value: 'true' },
          ]}
        />
        <Input.Search
          allowClear
          searchButton
          value={title}
          loading={props.loading}
          style={{ width: '60%' }}
          placeholder="请输入需求名称"
          onChange={(value) => setTitle(value)}
          onSearch={handleOnSearch}
        />
      </Input.Group>
    </div>
  );
}

export default DemandFilter;
