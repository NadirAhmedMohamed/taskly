import React from 'react';
import "./Todo.css";
import {FaEdit,FaCheck,FaTrash} from "react-icons/fa"
import { useToast } from "../contexts/ToastContext"
import { useTodos } from "../contexts/TodosContext";


function Todo({todo,handleShowDelete,handleShowUpdate}) {


    const { todos,setTodos } = useTodos();
    const { showToast } = useToast();

    // START EVENT HANDLERES
    function handleCheck(){

       const newTodos = todos.map((t)=>{
           if(t.id === todo.id){
                if(t.isCompleted === false){
                  t.isCompleted  = true;
                }else{
                     t.isCompleted  = false;
                }
            }
            return t;
        })

          localStorage.setItem("todos",JSON.stringify(newTodos));
          setTodos(newTodos);

         showToast("process completed !");
    }
 
    function handleShowDeleteModel(){
       handleShowDelete(todo);
    }

       
     function handleShowUpdateModel(){
      handleShowUpdate(todo);
    }
  // END EVENT HANDLERES
    
  return (
    <>

 <div style= {{background:  todo.isCompleted ? "grey" : "white"}} className={"todo-cont"}>
        <div className={"content"}>
            <div className={"title"}>{todo.title}</div>
             <div className={"description"}>{todo.description}</div>
        </div>
        <div className={"actions"}>
            <button onClick={handleCheck} className={"check"} style={{background: todo.isCompleted ? "green" : "white"}}><FaCheck style={{color: todo.isCompleted ? "white" : "green"}}/></button>
            <button onClick={()=>{
                handleShowUpdateModel();
            }} className={"edit"} style={{background: todo.isCompleted ? "grey" : "white"}}><FaEdit style={{color: "black"}}/></button>
            <button onClick={()=>{
                   handleShowDeleteModel();
                }} className={"delete"} style={{background: todo.isCompleted ? "grey" : "white"}}><FaTrash style={{color: "red"}}/></button>
        </div>
      </div>
    </>
  )
}

export default Todo;
