import React from 'react'
import Header from '../../components/Header'

const Home = () => {
    return (
        <div>
            <Header />
            <p>Home Page</p>
            <button onClick={() => alert('Click Me')}>click Me</button>
        </div>
    )
};

export default Home;
