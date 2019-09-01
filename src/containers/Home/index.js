import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getHomeList} from "./store/actions";
import styles from './style.css';

class Home extends Component{

    componentWillMount() {
        if(this.props.staticContext) {
            this.props.staticContext.css = styles._getCss();
        }
    }

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
            <div className={styles.home}>
                { this.getList() }
                <button onClick={() => alert('Click Me')}>click Me</button>
            </div>
        )
    }
}


Home.loadData = (store) => {
    //  负责在服务端渲染时获取数据
    return store.dispatch(getHomeList())
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
