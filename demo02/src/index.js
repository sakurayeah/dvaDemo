import React from 'react';
import dva, { connect } from 'dva';
import $ from 'jquery';
import './index.html';
import './index.less';

// ajax 方法封装
const ajax = (opts) => {
  $.ajax({
    url: opts.url,
    type: opts.type || 'GET',
    success: (d) => {
      opts.ok && opts.ok(d);
    },
    error: (d) => {
      opts.fail && opts.fail(d);
    }
  })
}

// requires
const requires = (url, opts) => {
  return new Promise((resolve, reject) => { 
    ajax({
      url,
      data: opts.data || {},
      ok: (d = {}) => resolve(d)
    })
  });
}

// services
const services = {
  init: (opts) => {
    return requires('/init.json', {
      data: opts.data
    });
  },
  change: (opts) => {
    return requires('/change.json', {});
  }
}

// 初始化
const app = dva();

// 注册 model
app.model({
  // namespace : model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'count',
  // 初始值
  state: {
    num: 0,
    title: ''
  },

  // reducers
  reducers: {
    add(state, action) {
      const num = state.num + 1
      return {...state, num} 
    },
    minus(state, action) { 
      const num = state.num - 1
      return {...state, num} 
    },
    update(state, action) {
      const {payload} = action;
      return {...state, ...payload} 
    },
  },

  // 异步处理，ajax请求可以放这里做
  effects: {
    *initFetch(action, sage) {
      const { put, call } = sage;
      // 拿请求返回的数据
      const data = yield call(services.init, { userId: 12321 });
      // 处理数据
      yield put({
        type: 'update',
        payload: data
      })
    },
    *changeFetch(action, sage) {
      const { put, call } = sage;
      const data = yield call(services.change, { userId: 12321 });
      yield put({
        type: 'update',
        payload: data
      })
    }
  },
  
  // 这里的函数是初始化默认执行，初始化请求可以放这里做
  subscriptions: {
    keyEvent({dispatch, history}) {
      dispatch({ type: 'initFetch' });
    },
  }
});

// 新建一个组件
class Count extends React.Component {
  render() {
    const { states, dispatch } = this.props;
    return (
      <div className="count">
        <h1>{states.title}</h1>
        <h3> 结果：{states.num} </h3>
        <button onClick={() => { dispatch({type: 'count/add'}) }}>+</button>
        <button onClick={() => { dispatch({type: 'count/minus'}) }}>-</button>
        <div onClick={() => { dispatch({type: 'count/changeFetch'}) }}>点击更换title</div>
      </div>
    )
  }
}

// 该函数返回一个对象，建立 State 到 Props 的映射关系。
function mapStateToProps(state) {
  return {
    states: state.count
  };
}

const App = connect(mapStateToProps)(Count);

// 注册路由表
app.router(() => <App />);

// 启动应用
app.start('#root');