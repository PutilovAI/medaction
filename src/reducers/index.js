import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import app from './app';
import articleForm from './articleForm';
import articles from './articles';
import videoteka from './videoteka';
import registerForm from './registerForm';
import registerQuiz from './registerQuiz';
import activity from './activity';
import menu from './menu';
import comments from './comments';
import profile from './profile';
import consilium from './consilium';
import shares from './shares';
import staticPage from './staticPages';
import invite from './invite';
import news from './news';

const rootReducer = combineReducers({
  app,
  articleForm,
  articles,
  videoteka,
  registerForm,
  menu,
  profile,
  registerQuiz,
  activity,
  comments,
  consilium,
  shares,
  staticPage,
  invite,
  news,
  route: routerReducer,
  loadingBar: loadingBarReducer,
});

export default rootReducer;
