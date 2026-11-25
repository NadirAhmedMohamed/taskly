import React, { useEffect, useMemo, useState } from "react";
import "./Todolist.css";

import Todo from "./Todo";

import {
  FaPlus,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaTimes,
} from "react-icons/fa";

import { useTodos } from "../contexts/TodosContext";
import { useToast } from "../contexts/ToastContext";

function Todolist() {
  // States
  const [dialogTodo, setDialogTodo] = useState(null);

  const [inputsValue, setInputsValue] = useState({
    inputTitleValue: "",
    inputDescriptionValue: "",
  });

  const [displayedTodos, setDisplayedTodos] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const [updateInputsValue, setUpdateInputsValue] = useState({
    updatedTitleValue: "",
    updatedDescriptionValue: "",
  });

  const { todos, setTodos } = useTodos();
  const { showToast } = useToast();

  // Load saved tasks
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

      setTodos(Array.isArray(storedTodos) ? storedTodos : []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTodos([]);
      showToast("Could not load saved tasks.");
    }
  }, [setTodos, showToast]);

  // Save tasks
  function saveTodos(updatedTodos) {
    try {
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Failed to save tasks:", error);
      showToast("Could not save your changes.");
    }
  }

  // Task statistics
  const totalTasks = todos.length;

  const completedTasks = useMemo(
    () => todos.filter((todo) => todo.isCompleted),
    [todos],
  );

  const activeTasks = useMemo(
    () => todos.filter((todo) => !todo.isCompleted),
    [todos],
  );

  // Filter tasks
  const filteredTodos = useMemo(() => {
    if (displayedTodos === "completed") {
      return completedTasks;
    }

    if (displayedTodos === "not-completed") {
      return activeTasks;
    }

    return todos;
  }, [todos, displayedTodos, completedTasks, activeTasks]);

  // Add task
  function handleAddTask() {
    const title = inputsValue.inputTitleValue.trim();
    const description = inputsValue.inputDescriptionValue.trim();

    if (!title) {
      showToast("Please enter a task title.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      title,
      description,
      isCompleted: false,
    };

    saveTodos([...todos, newTodo]);

    setInputsValue({
      inputTitleValue: "",
      inputDescriptionValue: "",
    });

    showToast("Task added successfully!");
  }

  // Open delete dialog
  function openDeleteDialog(todo) {
    setDialogTodo(todo);
    setShowDeleteDialog(true);
  }

  // Close delete dialog
  function closeDeleteDialog() {
    setShowDeleteDialog(false);
    setDialogTodo(null);
  }

  // Confirm delete
  function handleDeleteConfirm() {
    if (!dialogTodo) return;

    const updatedTodos = todos.filter((todo) => todo.id !== dialogTodo.id);

    saveTodos(updatedTodos);
    closeDeleteDialog();
    showToast("Task deleted successfully!");
  }

  // Open update dialog
  function openUpdateDialog(todo) {
    setDialogTodo(todo);

    setUpdateInputsValue({
      updatedTitleValue: todo.title,
      updatedDescriptionValue: todo.description || "",
    });

    setShowUpdateDialog(true);
  }

  // Close update dialog
  function closeUpdateDialog() {
    setShowUpdateDialog(false);
    setDialogTodo(null);
  }

  // Confirm update
  function handleUpdateConfirm() {
    if (!dialogTodo) return;

    const title = updateInputsValue.updatedTitleValue.trim();
    const description = updateInputsValue.updatedDescriptionValue.trim();

    if (!title) {
      showToast("Task title cannot be empty.");
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === dialogTodo.id ? { ...todo, title, description } : todo,
    );

    saveTodos(updatedTodos);
    closeUpdateDialog();
    showToast("Task updated successfully!");
  }

  // Add task with Enter key
  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTask();
    }
  }

  return (
    <>
      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay" onClick={closeDeleteDialog}>
          <div
            className="delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dialog-close"
              onClick={closeDeleteDialog}
              aria-label="Close dialog"
            >
              <FaTimes />
            </button>

            <div className="icon-text">
              <FaExclamationTriangle />
              <h2 id="delete-dialog-title">Delete Task?</h2>
              <p>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
            </div>

            <div className="delete-dialog-btns">
              <button
                type="button"
                className="confirm-delete"
                onClick={handleDeleteConfirm}
              >
                Delete Task
              </button>

              <button
                type="button"
                className="cancel"
                onClick={closeDeleteDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Dialog */}
      {showUpdateDialog && (
        <div className="dialog-overlay" onClick={closeUpdateDialog}>
          <div
            className="update-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dialog-close"
              onClick={closeUpdateDialog}
              aria-label="Close dialog"
            >
              <FaTimes />
            </button>

            <div className="icon-text">
              <FaInfoCircle />
              <h2 id="update-dialog-title">Edit Task</h2>
              <p>Make changes to your task details.</p>
            </div>

            <div className="inputs">
              <label htmlFor="updated-title">Task Title</label>
              <input
                id="updated-title"
                type="text"
                placeholder="Enter task title"
                value={updateInputsValue.updatedTitleValue}
                onChange={(event) =>
                  setUpdateInputsValue({
                    ...updateInputsValue,
                    updatedTitleValue: event.target.value,
                  })
                }
              />

              <label htmlFor="updated-description">Description</label>
              <textarea
                id="updated-description"
                placeholder="Enter task description"
                rows="3"
                value={updateInputsValue.updatedDescriptionValue}
                onChange={(event) =>
                  setUpdateInputsValue({
                    ...updateInputsValue,
                    updatedDescriptionValue: event.target.value,
                  })
                }
              />
            </div>

            <div className="update-dialog-btns">
              <button
                type="button"
                className="Ok"
                onClick={handleUpdateConfirm}
              >
                Save Changes
              </button>

              <button
                type="button"
                className="cancel"
                onClick={closeUpdateDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <main className="cont">
        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="dashboard-heading">
            <span className="dashboard-eyebrow">YOUR WORKSPACE</span>
            <h1>My Tasks</h1>
            <p>Stay organized and make every day productive.</p>
          </div>

          <div className="task-summary">
            <FaTasks />
            <span>{totalTasks} Total Tasks</span>
          </div>
        </header>

        {/* Statistics */}
        <section className="task-stats">
          <div className="stat-card total-stat">
            <div className="stat-icon">
              <FaTasks />
            </div>
            <div className="stat-info">
              <span>Total Tasks</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card completed-stat">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <span>Completed</span>
              <strong>{completedTasks.length}</strong>
            </div>
          </div>

          <div className="stat-card active-stat">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-info">
              <span>Remaining</span>
              <strong>{activeTasks.length}</strong>
            </div>
          </div>
        </section>

        {/* Task List Header */}
        <section className="tasks-section">
          <div className="tasks-section-header">
            <div>
              <h2>Task Overview</h2>
              <p>Manage and track your daily activities.</p>
            </div>

            <span className="visible-task-count">
              {filteredTodos.length} Tasks
            </span>
          </div>

          {/* Filters */}
          <div className="group-icon">
            <button
              type="button"
              className={displayedTodos === "all" ? "active" : ""}
              onClick={() => setDisplayedTodos("all")}
              aria-pressed={displayedTodos === "all"}
            >
              All Tasks
            </button>

            <button
              type="button"
              className={displayedTodos === "not-completed" ? "active" : ""}
              onClick={() => setDisplayedTodos("not-completed")}
              aria-pressed={displayedTodos === "not-completed"}
            >
              Active
            </button>

            <button
              type="button"
              className={displayedTodos === "completed" ? "active" : ""}
              onClick={() => setDisplayedTodos("completed")}
              aria-pressed={displayedTodos === "completed"}
            >
              Completed
            </button>
          </div>

          {/* Tasks */}
          <div className="todos-list">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  handleShowDelete={openDeleteDialog}
                  handleShowUpdate={openUpdateDialog}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaTasks />
                </div>

                <h3>
                  {displayedTodos === "completed"
                    ? "No completed tasks yet"
                    : displayedTodos === "not-completed"
                      ? "You're all caught up!"
                      : "Your workspace is empty"}
                </h3>

                <p>
                  {displayedTodos === "completed"
                    ? "Complete a task and it will appear here."
                    : displayedTodos === "not-completed"
                      ? "There are no remaining tasks. Great work!"
                      : "Add your first task and start getting things done."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Add Task */}
        <section className="add-task-section">
          <div className="add-task-heading">
            <div>
              <h2>Add a New Task</h2>
              <p>What's something you need to get done?</p>
            </div>
          </div>

          <div className="add-task">
            <input
              type="text"
              placeholder="Enter task title..."
              aria-label="Task title"
              value={inputsValue.inputTitleValue}
              onChange={(event) =>
                setInputsValue({
                  ...inputsValue,
                  inputTitleValue: event.target.value,
                })
              }
              onKeyDown={handleInputKeyDown}
            />

            <input
              type="text"
              placeholder="Add a description (optional)..."
              aria-label="Task description"
              value={inputsValue.inputDescriptionValue}
              onChange={(event) =>
                setInputsValue({
                  ...inputsValue,
                  inputDescriptionValue: event.target.value,
                })
              }
              onKeyDown={handleInputKeyDown}
            />

            <button
              type="button"
              onClick={handleAddTask}
              aria-label="Add task"
              title="Add task"
            >
              <FaPlus />
              <span>Add Task</span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default Todolist;
