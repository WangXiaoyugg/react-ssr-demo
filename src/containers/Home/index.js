import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getHomeList} from "./store/actions";
import styles from './style.css';
import withStyles from '../../withStyles.js'

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
            <div className={styles.test}>
                { this.getList() }
                <button onClick={() => alert('Click Me')}>click Me</button>
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
   list: state.home.newsList,
});

const mapDispatchToProps = (dispatch) => ({
    getHomeList() {
        dispatch(getHomeList());
    }
});

const ExportedHome = connect(mapStateToProps, mapDispatchToProps)(withStyles(Home, styles));
ExportedHome.loadData = (store) => {
    //  负责在服务端渲染时获取数据
    return store.dispatch(getHomeList())
};

export default ExportedHome
