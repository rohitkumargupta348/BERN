// import React from 'react'

import Navigation from './Navigation';

import {useState,useEffect} from 'react';
/* eslint-disable */
const ViewAllTask = () => {
  const [tasklist,setTaskList] = useState([]);

  useEffect(()=>{
    const allTask = async () =>{
      try{
        const res =await fetch("http://localhost:5000/api/ethereum/view-all-task",{
          method:"GET",
          headers:{
            "content-type":"application/json"
          }
        })
        const data = await res.json();
        // console.log("Data",data);
        if(data.status === 200){
          console.log("Data Tasklist",data.taskList);
          // console.log("Tasklist",tasklist);
          // console.log(tasklist.length);
          setTaskList(data.taskList);
          // console.log(tasklist);
        }
      }
      catch(error){
        console.log(error);
      }
    }
/* eslint-enable */
    allTask();
  })
  return (
    <>
    <Navigation/>
    <div className="view_all_tasks">
      {tasklist.map((task)=>{
        return(
            <div 
            className="view_all_tasks_card"
            key={task.id}
            style={task.id!=="" && task.name!=="" && task.date!=="" ? {} : {display:"none"}}
            >   
                <p>{task.taskId}</p>
                <p>{task.name}</p>
                <p>{task.date}</p>
            </div>
        )
      })}
      </div>
    </>
  )
}

export default ViewAllTask