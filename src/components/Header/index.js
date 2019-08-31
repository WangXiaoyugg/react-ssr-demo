import React, {Fragment} from 'react'
import {Link} from "react-router-dom";
import {connect} from 'react-redux';

const Header = (props) => {
    return (
        <div>
            <Link to="/">首页</Link>
            <br/>
            {
                props.login ? <Fragment>
                    <Link to="/login">登陆</Link>
                    <br/>
                    <Link to="/list">翻译列表</Link>
                </Fragment> : <Link to="/logout">退出</Link>
            }
        </div>
    )
};
const mapStateToProps = (state) => ({
   login: state.head.login
});
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
