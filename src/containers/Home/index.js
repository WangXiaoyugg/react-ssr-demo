import React from 'react'
import Header from '../../components/Header'
import {connect} from 'react-redux'

const Home = (props) => {
    return (
        <div>
            <Header />
            <p>This is {props.name}</p>
            <button onClick={() => alert('Click Me')}>click Me</button>
        </div>
    )
};

const mapStateToProps = (state) => ({
   name: state.name,
});

export default connect(mapStateToProps, null)(Home);
