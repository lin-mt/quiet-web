export type QuietFormProps<T> = {
  updateEntity?: T;
  title?: string;
  visible?: boolean;
  onOk?: (values: T) => Promise<T | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};
