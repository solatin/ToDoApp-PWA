import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginFailure, loginRequest, loginSuccess } from '../../actions/authActions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import lockIcon from '../../assets/images/lock.svg';
import './index.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
    };
  }

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };
  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };
  onSubmit = async (event) => {
    event.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    const { loginRequest, loginSuccess, loginFailure } = this.props;
    try {
      const rs = await loginRequest(email, password);
      await loginSuccess(rs);
      this.props.history.replace('/');
    } catch (e) {
      loginFailure(e);
    }
  };
  render() {
    return (
      <div className="container-login">
        <img src={lockIcon} alt="lock-icon" />
        <div className="title">Sign in</div>
        <form onSubmit={this.onSubmit}>
          <label>
            Email
            <input onChange={this.handleEmailChange} />
          </label>
          <label>
            Password
            <input type={this.state.showPassword ? 'text' : 'password'} onChange={this.handlePasswordChange} />
          </label>
          <label>
            <input type="checkbox" className="checkbox" onChange={this.togglePassword} />
            Show Password
          </label>
          <button>Login</button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
};
const mapsStateToProps = ({ currentUser }) => ({ isAuthenticated: currentUser.user !== null });
const mapDispatchToProps = {
  loginRequest,
  loginSuccess,
  loginFailure,
};
export default connect(mapsStateToProps, mapDispatchToProps)(withRouter(Login));
