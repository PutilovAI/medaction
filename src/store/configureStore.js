import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import rootReducer from '../reducers';

export default function configureStore() {
  const history = createHistory();
  const middlewareHistory = routerMiddleware(history);
  const composeEnhancers = compose;
  let store = null;
  // запиливает разные сборки для мидлварин для прода и для девелопа
  if (process.env.NODE_ENV === 'development') {
    store = composeEnhancers(
      applyMiddleware(thunk),
      applyMiddleware(middlewareHistory),
      applyMiddleware(createLogger({ collapsed: true })),
    )(createStore)(rootReducer);
  } else {
    store = composeEnhancers(
      applyMiddleware(thunk),
      applyMiddleware(middlewareHistory),
    )(createStore)(rootReducer);
  }
  return store;
}
