// import React from 'react'
import Navigation from "./Navigation"
import PropTypes from 'prop-types';

const DeleteTask = ({state}) => {
  const {contract,account}=state;
    // console.log("Contract",contract);
    const deleteTask=async(event)=>{
        event.preventDefault();
        const taskID = document.querySelector("#taskID").value;

        console.log(taskID);

        try{
          const res = await fetch(
            `http://localhost:5000/api/ethereum/delete-task/${taskID}`,
            {
                method:"DELETE",
                headers:{
                    "content-type":"application/json"
                },
            }
          )
          const data = await res.json();
          // console.log("Data",data);
          // console.log("typeof",typeof(data.status));
          if(data.status==200){
            await contract.methods.deleteTask(taskID).send({from:account});
            // setModalContent(
            //   `Task ID ${taskID} updated with task name ${taskName} and date ${taskDate}`
            // );
            // setModalVisible(true);
            // console.log("Task Updated");
          }else{
            throw new Error("Task cannot be Deleted")
          }

        }catch(error) {
          // setModalContent("Task cannot be updated");
          // setModalVisible(true);
          // console.log(error);  
          console.log("New Error");
        }

}
  return (
    <>
    <Navigation/>
    <div className="view_task todo_btn">
      <form onSubmit={deleteTask}>
      <div className="empty_div"></div>
        <label>
          ID:
          <input id="taskID" />
        </label>
        <button type="submit">Delete Task</button>
      </form>
    </div>
    </>
  )
}

DeleteTask.propTypes = {
  state:PropTypes.func.isRequired
};

export default DeleteTask