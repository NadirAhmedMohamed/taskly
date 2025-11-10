import React from "react";
import "./Todolist.css";
import Todo from "./Todo";
import { useState,useEffect,useMemo } from "react";
import {FaPlus} from "react-icons/fa"
import {FaExclamationTriangle,FaInfoCircle} from "react-icons/fa"
import { useTodos } from "../contexts/TodosContext";
import { useToast } from "../contexts/ToastContext"


function Todolist() {


    // START STATES
        const [dialogTodo,setDialogTodo] = useState(null);
        const [inputsValue,setInputsValue] = useState({inputTitleValue:"",inputDescriptionValue: ""});
        const [displayedTodos,setDisplayedTodos] = useState("all");
        const [showDeleteDialog,setShowDeleteDialog] = useState(false);
        const [showUpdateDialog,setShowUpdateDialog] = useState(false);
        const [updateInputsValue,setUpdateInputsValue] = useState({updatedTitleValue : "",updatedDescriptionValue: ""});
    // END STATES

     const { showToast } = useToast();
    const { todos,setTodos } = useTodos();

    // START HANDELERS

        function openDeleteDialog(todo){
            setDialogTodo(todo);
            setShowDeleteDialog(true);
    }

    function closeDeleteDialog(){
         setShowDeleteDialog(false);
    }

    function handleDeleteconfirm(){
       
         const updated = todos.filter((t)=>{
            return t.id !== dialogTodo.id;
        })

        localStorage.setItem("todos",JSON.stringify(updated));
         setTodos(updated);

         closeDeleteDialog();
        showToast("Deleted Successfully !");
    }

        function openUpdateDialog(todo){
            setDialogTodo(todo);
         setShowUpdateDialog(true);
          setUpdateInputsValue({updatedTitleValue : todo.title,updatedDescriptionValue: todo.description});
            }

    function closeUpdateDialog(){
         setShowUpdateDialog(false);
    }

    function handleUpdateConfirm(){

           const updatedTodos = todos.map((t)=>{
         if( dialogTodo.id === t.id){
         const updatedTodo = {...t,title: updateInputsValue.updatedTitleValue,description: updateInputsValue.updatedDescriptionValue};
            return updatedTodo;
         }else{
            return t;
         }
       })

       localStorage.setItem("todos",JSON.stringify(updatedTodos));
       setTodos(updatedTodos); 
    
        closeUpdateDialog();
        showToast("Udapted Successfully !");
        
    }

    // END HANDELERS

      useEffect(()=>{
        const storagedTodos = JSON.parse(localStorage.getItem("todos")) ?? [];
       setTodos(storagedTodos);
    }, [])


    // START TODOS FILTRATION
     const completedTodos = useMemo(()=>{

        if(!todos || ! Array.isArray(todos)){
            return [];
        }

     return todos.filter((t)=>{
        return t.isCompleted;
     })
     
     },[todos]);
     
    const notCompletedTodos = useMemo(()=>{

        if(!todos || ! Array.isArray(todos)){
            return [];
        }

       return todos.filter((t)=>{
            return !t.isCompleted;
        })
    },[todos]);
    
     let todosToBeRendered = todos;

        if(displayedTodos === "completed"){
        todosToBeRendered = completedTodos;
    }else if(displayedTodos === "not-completed"){
        todosToBeRendered = notCompletedTodos;
    }else{
        todosToBeRendered = todos; 
    }
    // END TODOS FILTRATION 

    const todosList = todosToBeRendered.map((t)=>{
        return <Todo key={t.id} todo={t} handleShowDelete={openDeleteDialog} handleShowUpdate={openUpdateDialog}/>
    });

  return (
    <>
      {/* Start deleteDialog */}
              <div style={{display: showDeleteDialog ? "block" : "none" ,boxShadow: "0 20px 40px rgba(0,0,0,0.2)"}} className={"delete-dialog"}>
               
               <div className="icon-text">
                <FaExclamationTriangle style={{fontSize: "30px",textAlign:"center"}}/>
                <p>Are you sure ?</p>
                </div>
            
                <div className={"delete-dialog-btns"}>
                    <button onClick={()=>{
                            closeDeleteDialog();
                            handleDeleteconfirm();
                    }}>Yes</button>
                    <button onClick={()=>{
                        closeDeleteDialog();
                    }}>No</button>
                </div>
            </div> 
          {/* End  deleteDialog */}

        {/* Start updateDialog */}
         <div style={{display: showUpdateDialog ? "block" : "none" , boxShadow: "0 20px 40px rgba(0,0,0,0.2)"}} className={"update-dialog"}>
            <div className="icon-text">
            <FaInfoCircle style={{fontSize: "30px",textAlign: "center"}}/>
            <p>Update Task</p>
            </div>

                <div className={"inputs"}>
            <input placeholder={"Edit Title"} value={updateInputsValue.updatedTitleValue} onChange={(e)=>{
                   setUpdateInputsValue({...updateInputsValue,updatedTitleValue: e.target.value})
            }}/>
            <input placeholder={"Edit Description"} value={updateInputsValue.updatedDescriptionValue} onChange={(e)=>{
                    setUpdateInputsValue({...updateInputsValue,updatedDescriptionValue: e.target.value})
            }}/>
                </div>

            <div className={"update-dialog-btns"}>
                <button className={"Ok"} onClick={()=>{
                        handleUpdateConfirm();
                        closeUpdateDialog();
                }}>Ok</button>
                <button className={"cancel"} onClick={closeUpdateDialog}>Cancel</button>
            </div>
        </div> 
      {/* End  updateDialog */}

    <div className={"cont"}>
        <h1>My Tasks</h1>  
        <div className={"group-icon"}>
            <button style={{background: displayedTodos === "all" ? "rgba(163, 163, 163, 1)" : "white" }} value={"all"} onClick={(e)=>{
                setDisplayedTodos(e.target.value);
            }}>All</button>
            <button style={{background: displayedTodos === "completed" ? "rgba(163, 163, 163, 1)" : "white" }} value={"completed"} onClick={(e)=>{
                 setDisplayedTodos(e.target.value);
            }}>Completed</button>
            <button style={{background: displayedTodos === "not-completed" ? "rgba(163, 163, 163, 1)" : "white" }} value={"not-completed"} onClick={(e)=>{
                 setDisplayedTodos(e.target.value);
            }}>Not completed</button>    
        </div>

        {todosList}
         

          <div className={"add-task"}>

            <input placeholder={"enter task"} value={inputsValue.inputTitleValue} onChange={(e)=>{
                    setInputsValue({...inputsValue,inputTitleValue: e.target.value});
            }}/>

            <input placeholder={"enter description"} value={inputsValue.inputDescriptionValue} onChange={(e)=>{
                   setInputsValue({...inputsValue,inputDescriptionValue: e.target.value});
            }}/>

            <button onClick={()=>{

                 if(inputsValue.inputTitleValue.length === 0 && inputsValue.inputDescriptionValue.length === 0){
                    return;
                }

                 const newTodo = {
                     id: Date.now(),
                     title: inputsValue.inputTitleValue ,
                     description: inputsValue.inputDescriptionValue ,
                     isCompleted: false 
                }

                const updatedTodos = [...todos,newTodo];

                localStorage.setItem("todos",JSON.stringify(updatedTodos));
                setTodos(updatedTodos);

                setInputsValue({inputTitleValue: "",inputDescriptionValue: ""}); 

            }}><FaPlus/></button>
          </div>

      </div>
    </>
  )
}

export default Todolist;