import React, { useEffect, useState, useRef } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import BillItem from '@/components/BillItem'
import PopupType from '@/components/PopupType'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils' // Pull 组件需要的一些常量

import s from './style.module.less'

const Home = () => {
  const typeRef = useRef()
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')); // 当前筛选时间
  const [page, setPage] = useState(1); // 分页
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [totalAmount, setTotalAmount] = useState({}); // 总收入&支出
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [list, setList] = useState([]); // 账单列表
  const [currentSelect, setCurrentSelect] = useState({ id: 0, name: '全部类型' }); // 当前筛选类型

  useEffect(() => {
    getBillList()
  }, [page, currentSelect])

  // 获取账单方法
  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?page=${page}&page_size=10&date=${currentTime}&type_id=${currentSelect.id}`);
    setLoading(LOAD_STATE.loading);
    // 下拉刷新，重制数据
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalPage(data.totalPage);
    setTotalAmount({
      totalExpense: data.totalExpense,
      totalIncome: data.totalIncome
    })
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  };

  // 筛选类型
  const select = (item) => {
    console.log(item)
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item)
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥{totalAmount.totalExpense}</b></span>
        <span className={s.income}>总收入：<b>¥{totalAmount.totalIncome}</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left}>
          <span className={s.title} onClick={toggle}>
            { currentSelect.name || '全部类型' }<Icon className={s.arrow} type="arrow-bottom" />
          </span>
        </div>
        <div className={s.right}>
          <span className={s.time}>2022-06<Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
        {
          list.length ? <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem bill={item} key={item.date + index}/>)
            }
          </Pull>
          :
          null
        }
    </div>
    <PopupType ref={typeRef} onSelect={select}/>
  </div>
}

export default Home
