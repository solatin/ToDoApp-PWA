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
  updateRequest,
  completeRequest
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

  handleCompleteTodo = async (id, attributes) => {
    const { completeRequest, fetchRequest} = this.props;
    await completeRequest({id, ...attributes});
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

  componentDidUpdate(prevProps){
    if(this.props.isOnline !== prevProps.isOnline){
      const { fetchRequest } = this.props;
      fetchRequest();
    }
  }

  render() {
    const { todos, filter, incompletedCount } = this.props;

    return (
      <div className='app-container'>
        <div className='todo-container'>
          <TodoForm onCreateTodo={this.handleCreateTodo} />
          <TodoList 
          todos={todos}
           onDeleteTodo={this.handleDeleteTodo} 
           onUpdateTodo={this.handleUpdateTodo} 
           onCompleteTodo={this.handleCompleteTodo}/>
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
  completeRequest: PropTypes.func,
  deleteRequest: PropTypes.func,
  changeTodoFilter: PropTypes.func,
  clearCompletedRequest: PropTypes.func,
};

const mapStateToProps = ({ todo }) => {
  const { filter, items, isOnline } = todo;
  const todos = filterTodos(items, filter);
  const incompletedCount = getIncompletedTodoCount(todo.items);

  return {
    todos,
    filter,
    incompletedCount,
    isOnline
  };
};

const mapDispatchToProps = {
  changeTodoFilter,
  clearCompletedRequest,
  fetchRequest,
  createRequest,
  completeRequest,
  deleteRequest,
  updateRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);
