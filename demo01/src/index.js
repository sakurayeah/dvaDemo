import React from 'react';
import dva, { connect } from 'dva';
import './index.html';
import './index.less';

// 初始化
const app = dva();

// 注册 model
app.model({
  // namespace : model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'count',
  // 初始值
  state: {
    num: 0,
  },
  
  // reducers
  reducers: {
    add  (state, action) {
      console.log('+  ', state, action)
      return {
        num: state.num + 1
      } 
    },
    minus(state, action) { 
      console.log('-  ',state, action )
      return {
        num: state.num - 1
      } 
    },
  }
});

// 新建一个组件
class Count extends React.Component {
  render() {
    const { states, dispatch } = this.props;
    return (
      <div className="count">
        <h2> {states.num} </h2>
        <button onClick={() => { dispatch({type: 'count/add'}) }}>+</button>
        <button onClick={() => { dispatch({type: 'count/minus'}) }}>-</button>
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