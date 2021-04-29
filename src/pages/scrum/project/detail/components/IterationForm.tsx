import type { FormInstance } from 'antd/lib/form';

type IterationFormProps = {
  visible: boolean;
  versionId: string;
  form: FormInstance;
  onCancel: () => void;
  parentId?: string;
  updateInfo?: ScrumEntities.ScrumIteration;
  afterAction?: () => void;
};

export default (props: IterationFormProps) => {
  const { versionId } = props;

  return <>{versionId}</>;
};
