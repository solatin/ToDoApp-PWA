import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TodoForm from '../../components/TodoForm';
import TodoList from '../../components/TodoList';
import TodoFooter from '../../components/TodoFooter';

import {
  changeTodoFilter,
  clearCompletedRequest,
  fetchRequest,
  createRequest,
  deleteRequest,
  updateRequest
} from '../../actions/todoActions';
import { filterTodos, getIncompletedTodoCount } from '../../utils/todoUtils';

import './index.css';

class TodosContainer extends Component {
  handleCreateTodo = async (content) => {
    const { createRequest, fetchRequest } = this.props;
    await createRequest(content);
    fetchRequest();
  };

  handleUpdateTodo = async (id, attributes) => {
    const { updateRequest, fetchRequest} = this.props;
    await updateRequest({id, ...attributes});
    fetchRequest();
  };

  handleDeleteTodo = async (id) => {
    const { deleteRequest, fetchRequest} = this.props;
    await deleteRequest(id);
    fetchRequest();
  };

  handleChangeFilter = (filter) => {
    const { changeTodoFilter } = this.props;
    changeTodoFilter(filter);
  };

  handleClearComplete = async () => {
    const { clearCompletedRequest, fetchRequest } = this.props;
    await clearCompletedRequest();
    fetchRequest();
  };

  componentDidMount() {
    const { fetchRequest } = this.props;
    fetchRequest();
  }

  render() {
    const { todos, filter, incompletedCount } = this.props;

    return (
      <div className='app-container'>
        <div className='todo-container'>
          <TodoForm onCreateTodo={this.handleCreateTodo} />
          <TodoList todos={todos} onDeleteTodo={this.handleDeleteTodo} onUpdateTodo={this.handleUpdateTodo} />
          <TodoFooter
            activeFilter={filter}
            incompletedCount={incompletedCount}
            onChangeFilter={this.handleChangeFilter}
            onClearComplete={this.handleClearComplete}
          />
        </div>
      </div>
    );
  }
}

TodosContainer.propTypes = {
  todos: PropTypes.array,
  filter: PropTypes.string,
  fetchRequest: PropTypes.func,
  createRequest: PropTypes.func,
  updateRequest: PropTypes.func,
  deleteRequest: PropTypes.func,
  changeTodoFilter: PropTypes.func,
  clearCompletedRequest: PropTypes.func,
};

const mapStateToProps = ({ todo }) => {
  const { filter, items } = todo;
  const todos = filterTodos(items, filter);
  const incompletedCount = getIncompletedTodoCount(todo.items);

  return {
    todos,
    filter,
    incompletedCount,
  };
};

const mapDispatchToProps = {
  changeTodoFilter,
  clearCompletedRequest,
  fetchRequest,
  createRequest,
  deleteRequest,
  updateRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);