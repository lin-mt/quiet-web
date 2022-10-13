export type QuietFormProps<T> = {
  formValues?: T;
  title?: string;
  visible?: boolean;
  onOk?: (values: T, ...any) => Promise<T | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
