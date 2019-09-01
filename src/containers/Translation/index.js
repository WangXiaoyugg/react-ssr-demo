import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {actions} from "./store";
import styles from './styles.css';
import withStyles from '../../withStyles.js';



class Translation extends Component {
    getList(list) {
        return (
            list.map(item => (
                <div key={item.id} className={styles.item}>{item.title}</div>
            ))
        )
    }

    componentDidMount() {
        if(!this.props.list.length) {
            this.props.getTranslationList()
        }
    }

    render() {
        const {list, login} = this.props;
        return login ?  <div className={styles.container}>{this.getList(list)}</div>: <Redirect to='/' />
    }

}

const mapStateToProps = (state) => ({
    list: state.translation.translationList,
    login: state.head.login
});

const mapDispatchToProps = (dispatch) => ({
    getTranslationList() {
        dispatch(actions.getTranslationList());
    }
});

const ExportedTranslation =  connect(mapStateToProps, mapDispatchToProps)(withStyles(Translation, styles));

ExportedTranslation.loadData = (store) => {
    return store.dispatch(actions.getTranslationList());
};

export default ExportedTranslation
