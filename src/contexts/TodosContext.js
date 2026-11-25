import { createContext, useContext, useState } from "react";

const TodosContext = createContext(null);

export const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  const value = {
    todos,
    setTodos,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

// Custom Hook
export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error("useTodos must be used within a TodosProvider");
  }

  return context;
};
