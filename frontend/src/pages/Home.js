import { Redirect } from "react-router-dom";
import NetworkContainer from "../containers/Network";
import TodosContainer from "../containers/TodosContainer";
import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Profile from "../containers/Profile";


class Home extends Component {
  render() {
    const { isAuthenticated } = this.props;
    return (
      <div>
        {
          isAuthenticated ? (
            <div>
              <Profile />
              <NetworkContainer />
              <TodosContainer />
            </div>
          ) : (
            <Redirect to={{
              pathname: "/login",
            }}/>
          )
        }
      </div>
    )
  }
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool
}
const mapsStateToProps = ({ currentUser }) => {
  return ({ isAuthenticated: currentUser.user !== null })
};

export default connect(mapsStateToProps)(Home);