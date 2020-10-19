import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Checkbox, Form, message } from 'antd';
import React, { useState } from 'react';
import { Link, SelectLang, useModel } from 'umi';
import { ResultType } from '@/types/Result';
import { getPageQuery } from '@/utils/utils';
import { accountLogin, LoginParams } from '@/services/system/Login';
import Footer from '@/components/Footer';
import UserForm from '@/pages/system/userinfo/components/UserForm';
import { OperationType } from '@/types/Type';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, Username, Password, Mobile, Captcha, Submit } = LoginFrom;

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');
  const [userForm] = Form.useForm();

  const handleSubmit = async (values: LoginParams) => {
    setSubmitting(true);
    try {
      // 登录
      const loginResult = await accountLogin({ ...values, type });
      if (loginResult.result === ResultType.SUCCESS) {
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <span className={styles.title}>Quite System</span>
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <Tab key="account" tab="账户密码登录">
              <Username
                name="username"
                placeholder="用户名"
                defaultValue="admin"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <Password
                name="secretCode"
                placeholder="密码"
                defaultValue="quite"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </Tab>
            <Tab key="mobile" tab="手机号登录">
              <Mobile
                name="mobile"
                placeholder="手机号"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <Captcha
                name="captcha"
                placeholder="验证码"
                countDown={120}
                getCaptchaButtonText=""
                getCaptchaSecondText="秒"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
              />
            </Tab>
            <div>
              <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                自动登录
              </Checkbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
            <Submit loading={submitting}>登录</Submit>
            <div className={styles.other}>
              其他登录方式
              <AlipayCircleOutlined className={styles.icon} />
              <TaobaoCircleOutlined className={styles.icon} />
              <WeiboCircleOutlined className={styles.icon} />
              <a className={styles.register} onClick={() => setUserFormVisible(true)}>
                注册账户
              </a>
            </div>
          </LoginFrom>
        </div>
      </div>
      <Footer />
      {userFormVisible &&
      <UserForm userFormType={OperationType.REGISTERED} visible={userFormVisible} form={userForm}
                onCancel={() => setUserFormVisible(false)} />
      }
    </div>
  );
};

export default Login;
