
import Todolist from "./components/Todolist";
import "./App.css";

import { ToastProvider } from "./contexts/ToastContext";
import { TodosProvider } from "./contexts/TodosContext";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <TodosProvider>
          <Todolist />
        </TodosProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
