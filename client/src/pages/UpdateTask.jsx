import {useState} from "react";

import Navigation from './Navigation';
import PropTypes from 'prop-types';

/* eslint-disable */
const UpdateTask =({state})=>{
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const closeModal = () => {
      setModalVisible(false);
      setModalContent("");
    };
  
    const {contract,account}=state;
    // console.log("Contract",contract);
    const updateTask=async(event)=>{
        event.preventDefault();
        const taskName = document.querySelector("#taskName").value;
        const taskDate = document.querySelector("#taskDate").value;
        const taskID = document.querySelector("#taskID").value;

        // console.log(taskName,taskDate,taskName,account);

        try{
          const res = await fetch(
            "http://localhost:5000/api/ethereum/update-task",
            {
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({taskDate:taskDate})
            }
          )
          const data = await res.json();
          // console.log("Data",data);
          // console.log("typeof",typeof(data.status));
          if(data.status==200){
            await contract.methods.updateTask(taskID,taskName,taskDate).send({from:account});
            setModalContent(
              `Task ID ${taskID} updated with task name ${taskName} and date ${taskDate}`
            );
            setModalVisible(true);
            // console.log("Task Updated");
          }else{
            throw new Error("Task cannot be updated because of date clash")
          }

        }catch(error) {
          setModalContent("Task cannot be updated");
          setModalVisible(true);
          // console.log(error);  
          // console.log("New Error");
        }
}

/* eslint-enable */

    return(
      <>
      <Navigation />
      <div className="update_task todo_btn">
        <form onSubmit={updateTask}>
          <label>
            ID:
            <input id="taskID" />
          </label>
          <label>
            Name:
            <input id="taskName" />
          </label>
          <label>
            Date:
            <input id="taskDate" type="date" />
          </label>
          <button type="submit">Update Task</button>
        </form>

        {modalVisible && (
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
  );
}


UpdateTask.propTypes = {
  state:PropTypes.func.isRequired
};

export default UpdateTask;