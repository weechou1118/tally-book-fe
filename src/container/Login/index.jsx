import React, { useState, useCallback, useEffect } from 'react'
import { List, Input, Button, Checkbox, Toast } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import Capture from 'react-captcha-code'
import { post } from '@/utils'
import cx from 'classnames'

import s from './style.module.less'

const Login = () => {
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(''); // 输入的验证码
  const [captcha, setCaptcha] = useState(''); // 正确的验证码
  const [type, setType] = useState('login'); // 登录 注册类型
    //  验证码变化，回调方法
  const handleChange = useCallback((captcha) => {
    console.log('captcha', captcha)
    setCaptcha(captcha)
  }, []);

  useEffect(() => {
    setVerify('')
  }, [type])
  
  // 提交方法
  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if (type === 'register') {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        };
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        };
        await post('/api/user/register', {
          username,
          password,
          verify
        });
        Toast.show('注册成功');
      } else {
        const { data } = await post('/api/user/login', {
          username,
          password,
        });
        localStorage.setItem('token', data.token)
        Toast.show('登录成功');
      }
    } catch (error) {
      Toast.show(error.msg);
    }
  };

  return <div className={s.auth}>
    <div className={s.head} />
    <div className={s.tab}>
      <span className={ cx({ [s.active]: type == 'login' }) } onClick={() => setType('login')}>登录</span>
      <span className={ cx({ [s.active]: type == 'register' }) } onClick={() => setType('register')}>注册</span>
    </div>
    <div className={s.form}>
      <List>
        <List.Item prefix={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(e) => setUsername(e.target.value)}
          />
        </List.Item>
        <List.Item prefix={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(e) => setPassword(e.target.value)}
          />
        </List.Item>
        {
          type === 'register' ? 
            (<List.Item prefix={<CustomIcon type="mima" />}>
              <Input
                clearable
                type="text"
                placeholder="请输入验证码"
                onChange={(e) => setVerify(e.target.value)}
              />
              <Capture charNum={4} onChange={handleChange}/>
            </List.Item>)
            :
            null
        }
      </List>
    </div>
    <div className={s.operation}>
      {
        type === 'register' ?
          (<div className={s.agree}>
            <Checkbox />
            <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
          </div>)
          :
          null
      }
      <Button onClick={onSubmit} block theme="primary">{ type === 'login' ? '登录' : '注册'}</Button>
    </div>
  </div>
}

export default Login
