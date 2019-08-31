import Home from './containers/Home'
import Login from './containers/Login'
import App from './App';

export default [
    {
        path: '/',
        component: App,
        key: 'app',
        routes: [
            {
                path: '/',
                component: Home,
                exact: true,
                loadData: Home.loadData,
                key:"home",
            },
            {
                path: '/login',
                component: Login,
                exact: true,
                key: 'login',
            },
        ]
    }
]
