// PopupType/index.jsx
import React, { forwardRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'zarm'
import cx from 'classnames'
import { get } from '@/utils'

import s from './style.module.less'

// forwardRef 用于拿到父组件传入的 ref 属性，这样在父组件便能通过 ref 控制子组件。
const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); // 组件的显示和隐藏
  const [active, setActive] = useState('all'); // 激活的 type
  const [typeList, setTypeList] = useState([]); // 类型标签

  useEffect(async () => {
    // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余。
    const { data: { list } } = await get('/api/type/list')
    setTypeList(list)
  }, [])

  if (ref) {
    ref.current = {
      // 外部可以通过 ref.current.show 来控制组件的显示
      show: () => {
        setShow(true)
      },
      // 外部可以通过 ref.current.close 来控制组件的显示
      close: () => {
        setShow(false)
      }
    }
  };

  // 选择类型回调
  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    // 父组件传入的 onSelect，为了获取类型
    onSelect(item)
  };

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={s.popupType}>
      <div className={s.header}>
        请选择类型
        <span className={s.close}>
          X
        </span>
      </div>
      <div className={s.content}>
        <span onClick={() => choseType({ id: 0, name: '全部类型' })} className={cx({ [s.all]: true, [s.active]: active == 'all', [s.tab]: true })}>全部类型</span>
        {
          typeList.map((item, index) => <span key={index} onClick={() => choseType(item)} className={cx({[s.active]: active == item.id, [s.tab]: true})} >{ item.name }</span>)
        }
      </div>
    </div>
  </Popup>
});

PopupType.propTypes = {
  onSelect: PropTypes.func
}

export default PopupType;
