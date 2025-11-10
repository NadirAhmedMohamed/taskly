import {createContext , useState , useContext} from "react";

const TodosContext = createContext();

export const TodosProvider = ({children})=>{

    const [todos,setTodos] = useState([]);

    return(
       <TodosContext.Provider value= {{todos,setTodos}}> {/* value={{todos: todos,setTodos: setTodos}}  SAME THING*/}
        {children}
       </TodosContext.Provider> 
    )
}

// CUSTOM HOOK 
export const useTodos = ()=>{
    return useContext(TodosContext);
}