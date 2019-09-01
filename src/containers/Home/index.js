import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {getHomeList} from "./store/actions";
import styles from './style.css';
import withStyles from '../../withStyles.js';
import {Helmet} from "react-helmet";

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
                <div key={item.id} className={styles.item}>{item.title}</div>
            )
        })
    }

    render() {
        return (
            <Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>react ssr demo home page</title>
                    <meta name="description" content="this is a easy react-ssr-demo home page"/>
                </Helmet>
                <div className={styles.container}>
                    { this.getList() }
                </div>
            </Fragment>

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
