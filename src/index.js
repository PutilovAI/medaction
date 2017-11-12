import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import 'moment/locale/ru';
import ReactGA from 'react-ga';

import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import configureStore from './store/configureStore';

import App from './components/App/App';

import PageArticle from './pages/PageArticle/PageArticle';
import PageArticleForm from './pages/PageArticleForm/PageArticleForm';
import PageVideoteka from './pages/PageVideoteka/PageVideoteka';
import PageConsilium from './pages/PageConsilium/PageConsilium';
import PageConsiliumItem from './pages/PageConsilium/PageConsiliumItem';

import PageNews from './pages/PageNews/PageNews';
import PageNewsItem from './pages/PageNews/PageNewsItem';

import PageMain from './pages/PageMain/PageMain';
import PageMainLanding from './pages/PageMain/PageMainLanding';
import PageRegister from './pages/PageRegister/PageRegister';
import PageRegisterConfirm from './pages/PageRegisterConfirm/PageRegisterConfirm';
import PageQuiz from './pages/PageQuiz/PageQuiz';
import PageLogin from './pages/PageLogin/PageLogin';
import PageProfile from './pages/PageProfile/PageProfile';
import PageRestorePassword from './pages/PageFromEmail/PageRestorePassword';
import PageRestoreEmail from './pages/PageFromEmail/PageVerifyEmail';
import PageActivityFavorites from './pages/PageActivityList/PageActivityFavorites';
import PageActivityArticles from './pages/PageActivityList/PageActivityArticles';
import PageActivityConsilium from './pages/PageActivityList/PageActivityConsilium';
import PageStaticPage from './pages/PageStaticPage/PageStaticPage';
import Page403 from './pages/Page403/Page403';
import Page404 from './pages/Page404/Page404';


import './assets/style/index.css';

import LayoutBase from './layouts/LayoutBase';
import LayoutLogin from './layouts/LayoutLogin';
import LayoutOnlyBG from './layouts/LayoutOnlyBG';

const history = createHistory();

ReactGA.initialize('UA-85156988-1');

history.listen((location, action) => {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
  if (action === 'PUSH') {
    document.querySelector('#root').scrollTop = 0;
  }
  // ReactGA.set({ userId: 123 });
  // ga('set', 'dimension1', '921');
});
const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <App>
      <ConnectedRouter history={history}>
        <Switch>
          <LayoutBase exact path="/" component={PageMain} />
          <LayoutBase exact path="/welcome/" component={PageMainLanding} />
          <LayoutBase exact path="/register" component={PageRegister} />
          <LayoutBase path="/register/confirm" component={PageRegisterConfirm} />
          <LayoutBase path="/register/quiz" component={PageQuiz} />
          <LayoutBase exact path="/profile/" component={PageProfile} />
          <LayoutBase exact path="/profile/edit/" component={PageRegister} />
          <LayoutBase path="/profile/user/:id" component={PageProfile} />
          <LayoutBase path="/profile/favorites" component={PageActivityFavorites} className="wrapper__page_bg-color" />
          <LayoutBase path="/profile/articles" component={PageActivityArticles} className="wrapper__page_bg-color" />
          <LayoutBase path="/profile/consilium" component={PageActivityConsilium} className="wrapper__page_bg-color" />
          <LayoutBase exact path="/articles" component={PageArticle} className="wrapper__page_bg-color" />
          <LayoutBase path="/articles/:id" component={PageArticle} />
          <LayoutBase path="/article/create" component={PageArticleForm} />
          <LayoutBase path="/article/:type/:id" component={PageArticleForm} />
          <LayoutBase exact path="/videoteka" component={PageVideoteka} className="wrapper__page_bg-color" />
          <LayoutBase path="/videoteka/:id" component={PageVideoteka} />
          <LayoutBase exact path="/consilium" component={PageConsilium} className="wrapper__page_bg-color" />
          <LayoutBase path="/consilium/:id" component={PageConsiliumItem} />
          <LayoutBase exact path="/news" component={PageNews} className="wrapper__page_bg-color" />
          <LayoutBase path="/news/:id" component={PageNewsItem} />
          <LayoutBase path="/static-pages/:slug" component={PageStaticPage} />
          <LayoutBase path="/materials" component={PageStaticPage} />
          <LayoutOnlyBG exact path="/auth/password/reset" component={PageRestorePassword} />
          <LayoutOnlyBG exact path="/auth/email/verify" component={PageRestoreEmail} />
          <LayoutBase exact path="/403" component={Page403} />
          <LayoutBase component={Page404} />
        </Switch>
      </ConnectedRouter>
    </App>
  </Provider>,
  document.getElementById('root'),
);
