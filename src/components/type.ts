export type QuietFormProps<T> = {
  formValues?: T;
  title?: string;
  visible?: boolean;
  onOk?: (values: T, ...any) => Promise<T | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};
