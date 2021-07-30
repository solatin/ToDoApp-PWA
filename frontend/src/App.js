import React, { Component } from 'react';
import { Provider } from 'react-redux';

import TodosContainer from './containers/TodosContainer';
import Network from './containers/Network';

import configureStore from './store/configureStore';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Network />
        <TodosContainer />
      </Provider>
    );
  }
}

export default App;
