export const accountExpiredStatus = {
  true: { text: '到期', status: 'Error' },
  false: { text: '正常', status: 'Processing' },
};

export const accountLockedStatus = {
  true: { text: '被锁', status: 'Error' },
  false: { text: '正常', status: 'Processing' },
};

export const credentialsExpiredStatus = {
  true: { text: '过期', status: 'Error' },
  false: { text: '正常', status: 'Processing' },
};

export const enableStatus = {
  true: { text: '启用', status: 'Processing' },
  false: { text: '关闭', status: 'Error' },
};

export const secretRequiredStatus = {
  true: { text: '需要', status: 'Success' },
  false: { text: '不需要', status: 'Error' },
};

export const autoApproveStatus = {
  true: { text: '开启', status: 'Success' },
  false: { text: '关闭', status: 'Error' },
};

export const scopedStatus = {
  true: { text: '是', status: 'Processing' },
  false: { text: '否', status: 'Error' },
};
