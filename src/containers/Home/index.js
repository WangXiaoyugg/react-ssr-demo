import React, {Component} from 'react'
import Header from '../../components/Header'
import {connect} from 'react-redux'
import {getHomeList} from "./store/actions";

class Home extends Component{

    componentDidMount() {
        if(!this.props.list.length) {
            this.props.getHomeList();
        }
    }

    getList() {
        const {list} = this.props;
        return list.map(item => {
            return (
                <div key={item.id} >{item.title}</div>
            )
        })
    }

    render() {
        return (
            <div>
                <Header />
                { this.getList() }
                <button onClick={() => alert('Click Me')}>click Me</button>
            </div>
        )
    }
}


Home.loadData = (store) => {
    //  负责在服务端渲染时获取数据
    return store.dispatch(getHomeList(true))
};

const mapStateToProps = (state) => ({
   list: state.home.newsList,
});

const mapDispatchToProps = (dispatch) => ({
    getHomeList() {
        dispatch(getHomeList());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
