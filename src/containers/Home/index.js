import React, {Component} from 'react'
import Header from '../../components/Header'
import {connect} from 'react-redux'
import {getHomeList} from "./store/actions";

class Home extends Component{

    componentDidMount() {
        this.props.getHomeList();
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

const mapStateToProps = (state) => ({
   list: state.home.newsList,
});

const mapDispatchToProps = (dispatch) => ({
    getHomeList() {
        dispatch(getHomeList());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
