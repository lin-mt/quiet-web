import React from 'react';

export type SettingProps = {
  projectId: string;
};

function Setting(props: SettingProps) {
  return <>项目setting {props.projectId}</>;
}

export default Setting;
