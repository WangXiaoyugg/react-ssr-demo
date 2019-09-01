import React, {Fragment, Component} from 'react'
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {actions} from "./store";
import styles from './style.css';
import withStyles from '../../withStyles'

class Header extends Component {


    componentDidMount() {

    }

    render() {
        const {handleLogin, handleLogout, login} = this.props;
        return (
            <div className={styles.test}>
                <Link to="/">首页</Link>
                <br/>
                {
                    login ? <Fragment>
                        <div onClick={handleLogout}>退出</div>
                        <br/>
                        <Link to="/translation">翻译列表</Link>
                    </Fragment> : <div onClick={handleLogin}>登陆</div>
                }
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    login: state.head.login
});
const mapDispatchToProps = (dispatch) => ({
    handleLogin() {
        dispatch(actions.login())
    },
    handleLogout() {
        dispatch(actions.logout())
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Header, styles));
