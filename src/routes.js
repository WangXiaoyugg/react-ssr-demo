import Home from './containers/Home'
import Translation from './containers/Translation'
import App from './App';
import NotFound from "./containers/NotFound";

export default [
    {
        path: '/',
        component: App,
        loadData: App.loadData,
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
                path: '/translation',
                component: Translation,
                exact: true,
                key: 'translation',
                loadData: Translation.loadData,
            },
            {
                component: NotFound
            }
        ]
    }
]
