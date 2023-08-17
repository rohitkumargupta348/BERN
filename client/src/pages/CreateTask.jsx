// import React from 'react'

import { useState } from "react";
import PropTypes from 'prop-types';
import Navigation from './Navigation';



/* eslint-disable */
const CreateTask = ({state}) => {
  // console.log(web3);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
  };
  const createTask = async(event)=>{
    event.preventDefault();
    const {contract,account} = state;
    const taskName  = document.querySelector("#taskName").value;
    const taskDate = document.querySelector("#taskDate").value;

    try{
      const res = await fetch("http://localhost:5000/api/ethereum/create-task",{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body: JSON.stringify({taskDate:taskDate})
      })
      // console.log(account);
      const data = await res.json();
      // console.log(data);
      if(data.status===200){
        if(contract && contract.methods){
            await contract.methods.createTask(taskName,taskDate).send({from:account})
            setModalContent(`Task ${taskName} added at ${taskDate}`);
        }
      }else{
        alert("Task cannot be added")
      }

    }
    catch(error){
      setModalContent(`Task already exists at ${taskDate}`);
    } 
    finally {
      setModalOpen(true);
    }
  }

  /* eslint-enable */
  return (
    
    <>
          <Navigation />
          <div className="create_task todo_btn">
            <form onSubmit={createTask}>
              <label>
                Name:
                <input id="taskName" />
              </label>
              <label>
                Date:
                <input id="taskDate" type="date" />
              </label>
              <button type="submit">Create Task</button>
            </form>
    
            {modalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>
                    &times;
                  </span>
                  <p>{modalContent}</p>
                </div>
              </div>
            )}
          </div>
        </>
  )
}

CreateTask.propTypes = {
  state:PropTypes.func.isRequired
};

export default CreateTask