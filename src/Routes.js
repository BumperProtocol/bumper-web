import React, { useEffect, useState, Suspense } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import './events/ethereum';
import ctx, { mapData, unmapActions } from './events';
import { getDefaultTheme } from './utils'

const Header = React.lazy(() => import('./components/Header'));
const Footer = React.lazy(() => import('./components/Footer'));

const Markets = React.lazy(() => import('./pages/Markets'));

const Home = React.lazy(() => import('./pages/Home'));
const Loading = React.lazy(() => import('./components/Loading'));

const App = () => {
  let defaultTheme = getDefaultTheme();
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    // initEthereum
    ctx.event.emit('initEthereum');
    // initTheme
    const lifetimeObj = {};
    mapData({
      theme(value){
        setTheme(value)
      }
    }, ctx, lifetimeObj);
    return () => {
      unmapActions(lifetimeObj);
    };
  }, []);


  return (
    <div className={`page-theme theme-${theme}`}>
      <Router>
        <Header />
        <div className="page-body">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/markets">
              <Markets />
            </Route>
          </Switch>
          <Footer />
        </div>
        <Loading />
      </Router>
    </div>
  );
};


const Empty = () => {
  return (
    <>
    </>
  )
}

const renderLoading = () => (<Empty />);

const renderApp = () => (<App />);

const RoutePage = () => (
  <Suspense fallback={renderLoading()}>
    { renderApp()}
  </Suspense>
);

export default RoutePage;
