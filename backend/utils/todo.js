const getCurrentTime = () => new Date().getTime();

const createTodoInstance = (content) => {
  const now = getCurrentTime();

  return {
    completed: false,
    createdAt: now,
    updatedAt: now,
    content,
  };
};

module.exports = {createTodoInstance};