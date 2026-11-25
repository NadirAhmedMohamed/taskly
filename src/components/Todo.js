import React from "react";
import "./Todo.css";

import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";

import { useToast } from "../contexts/ToastContext";
import { useTodos } from "../contexts/TodosContext";

function Todo({ todo, handleShowDelete, handleShowUpdate }) {
  const { todos, setTodos } = useTodos();
  const { showToast } = useToast();

  // Toggle task completion status
  function handleCheck() {
    const newTodos = todos.map((t) =>
      t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t,
    );

    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);

    showToast(
      todo.isCompleted
        ? "Task marked as active!"
        : "Task completed successfully!",
    );
  }

  // Open delete confirmation dialog
  function handleShowDeleteModel() {
    handleShowDelete(todo);
  }

  // Open update dialog
  function handleShowUpdateModel() {
    handleShowUpdate(todo);
  }

  return (
    <div className={`todo-cont ${todo.isCompleted ? "completed" : ""}`}>
      <div className="content">
        <div className="title">{todo.title}</div>

        {todo.description && (
          <div className="description">{todo.description}</div>
        )}

        {todo.isCompleted && <span className="task-status">Completed</span>}
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={handleCheck}
          className="check"
          aria-label={todo.isCompleted ? "Mark as active" : "Mark as completed"}
          title={todo.isCompleted ? "Mark as active" : "Complete task"}
        >
          <FaCheck />
        </button>

        <button
          type="button"
          onClick={handleShowUpdateModel}
          className="edit"
          aria-label="Edit task"
          title="Edit task"
        >
          <FaEdit />
        </button>

        <button
          type="button"
          onClick={handleShowDeleteModel}
          className="delete"
          aria-label="Delete task"
          title="Delete task"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default Todo;
