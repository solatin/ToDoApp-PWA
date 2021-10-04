import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logoutRequest } from '../../actions/authActions';
import { connect } from 'react-redux';
import './index.css';
class Profile extends Component {
  handleLogout = () => {
    const { logoutRequest } = this.props;
    logoutRequest();
  };
  render() {
    return (
      <div className="profile-container">
        <div className="user-email">{this.props.userEmail}</div>
        <div className="logout-btn" onClick={this.handleLogout}>
          Logout
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  userEmail: PropTypes.string.isRequired,
  logoutRequest: PropTypes.func.isRequired,
};

const mapsStateToProps = ({ currentUser }) => ({ userEmail: currentUser.user });
const mapDispatchToProps = {
  logoutRequest,
};

export default connect(mapsStateToProps, mapDispatchToProps)(Profile);
