import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {updateOnline} from '../../actions/todoActions';
import './index.css';

class NetworkContainer extends Component{
  constructor(props){
    super(props);
    window.addEventListener('online', this.updateStatus);
    window.addEventListener('offline', this.updateStatus);
    this.state = {
      showNotice: false,
    }
  }

  updateStatus = () => {
    const {updateOnline} = this.props;
    updateOnline(navigator.onLine);
    console.log(`Site is ${navigator.onLine ? 'online' : 'offline'}`);
  }

  componentDidUpdate(prevProps){
    if(this.props.isOnline !== prevProps.isOnline){
      this.setState({showNotice: true});
      if(this.props.isOnline){
        setTimeout(() => this.setState({showNotice: false}), 2000);
      }
    }
  }
  
  render(){
    const {isOnline} = this.props;
    const {showNotice} = this.state;
    return (
      <div>
        <span className="online-notice" style={{display: isOnline && showNotice ? 'inline' : 'none' }}>
          Back to online!
        </span>
        <span className="offline-notice" style={{display: !isOnline && showNotice ? 'inline' : 'none' }}>
          You are offline!
        </span>
      </div>
    );
  }
}

NetworkContainer.propTypes = {
  isOnline: PropTypes.bool,
  updateOnline: PropTypes.func
}

const mapsStateToProps = ({todo}) => ({isOnline: todo.isOnline});

const mapDispatchToProps = {
  updateOnline
}

export default connect(mapsStateToProps, mapDispatchToProps)(NetworkContainer);