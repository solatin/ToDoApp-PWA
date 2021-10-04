import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import store, { persistor } from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { StrictMode } from 'react';

const LoadingOverlay = () => <div>Loading</div>;
class App extends Component {
  render() {
    return (
      <StrictMode>
        <Provider store={store}>
          <PersistGate loading={<LoadingOverlay />} persistor={persistor} >
            <BrowserRouter>
              <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register} />
                <Route exact path="/" component={Home}/>
                <Route component={NotFound}/>
              </Switch>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </StrictMode>
    );
  }
}

export default App;
