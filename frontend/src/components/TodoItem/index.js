/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.css';

import greenTickIcon from '../../assets/images/green-tick.svg';
import blackTickIcon from '../../assets/images/black-tick.svg';
import editIcon from '../../assets/images/edit.svg';
import deleteIcon from '../../assets/images/delete.svg';
import checkIcon from '../../assets/images/check.svg';

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editContent: '',
      editMode: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      data: { content, updatedAt },
    } = props;

    if (state.previousUpdatedAt !== updatedAt) {
      return {
        editContent: content,
        previousUpdatedAt: updatedAt,
      };
    }

    return null;
  }

  handleToggle = (e) => {
    e.preventDefault();

    const {
      onCompleteTodo,
      data: { completed },
    } = this.props;
    onCompleteTodo({ completed: !completed });
  };

  handleDelete = (e) => {
    e.preventDefault();

    const { onDeleteTodo } = this.props;
    onDeleteTodo();
  };

  toogleEditMode = (e) => {
    e.preventDefault();

    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  };

  handleChangeEditContent = (e) => {
    this.setState({ editContent: e.target.value });
  };

  handleSaveTodo = () => {
    const { onUpdateTodo } = this.props;
    const { editContent } = this.state;

    this.setState({
      editMode: false,
    });

    onUpdateTodo({ content: editContent });
  };

  render() {
    const {
      data: { content, completed },
    } = this.props;
    const { editContent, editMode } = this.state;
    const inQueue = this.props.data.id ? false : true;
    return (
      <div className='todo-item-container'>
        {inQueue ? 
        <div className='todo-item-toggle disabled'>
          <img src={blackTickIcon} alt='tick' />
        </div> 
        : 
        <a href='#' className='todo-item-toggle' onClick={this.handleToggle}>
          {completed && <img src={greenTickIcon} alt='tick' />}
          {!completed && <img src={blackTickIcon} alt='tick' />}
        </a>}
        {!editMode && <div className={`todo-item-content ${completed ? 'completed' : 'incompleted'}`}>{content}</div>}
        {editMode && (
          <div className='todo-item-content'>
            <form onSubmit={this.handleSaveTodo}>
              <input
                type='text'
                placeholder='Todo content'
                onChange={this.handleChangeEditContent}
                value={editContent}
              />
            </form>
          </div>
        )}
        {inQueue ? (
          <div className='inqueue'>InQueue...</div>
        ) : (
          <div className={`todo-item-options ${editMode ? 'edit' : 'view'}`}>
            {editMode && (
              <>
                <a href='#' className='icon-btn' onClick={this.handleSaveTodo}>
                  <img src={checkIcon} alt='complete-edit' />
                </a>
                <a href='#' className='icon-btn' onClick={this.toogleEditMode}>
                  <img src={deleteIcon} alt='close-edit' />
                </a>
              </>
            )}
            {!editMode && (
              <>
                <a href='#' className='icon-btn' onClick={this.toogleEditMode}>
                  <img src={editIcon} alt='edit' />
                </a>
                <a href='#' className='icon-btn' onClick={this.handleDelete}>
                  <img src={deleteIcon} alt='delete' />
                </a>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

TodoItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    completed: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onDeleteTodo: PropTypes.func,
  onUpdateTodo: PropTypes.func,
  onCompleteTodo: PropTypes.func,
};

export default TodoItem;
