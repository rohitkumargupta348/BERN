//Contract Address - 0x87E54BB9043D6334bE88433e87aAdEd8fE92b931

const express = require("express");

const cors = require("cors");

const ABI = require("./ABI.json");

const {Web3} = require("web3");
const { log } = require("console");

const app = express();

app.use(cors());

app.use(express.json());//middleware

const web3 = new Web3("https://fabled-old-needle.matic-testnet.discover.quiknode.pro/49de27d7d84599a029beadf9d1003c4cd9f979ed/");

const contractAddress = "0x87E54BB9043D6334bE88433e87aAdEd8fE92b931";

const contract = new web3.eth.Contract(ABI,contractAddress);

// console.log(contract);

const viewTask = async () =>{
    const task = await contract.methods.viewTask(1).call();
    // console.log(task);
}

viewTask();

const dateClashCheck = async(taskDate)=>{
    const tasks = await contract.methods.allTask().call();
    const foundTask = tasks.find(task=>task.date === taskDate);

    if(foundTask){
        return foundTask.name;
    }
    return "No Task Found";
}

const priorityCheck = async(id)=>{
    const tasks = await contract.methods.allTask().call();
    const result = tasks[id-1].name.includes("priority")
    return result;
}

app.post("/api/ethereum/create-task",async(req,res)=>{
    // await contract.methods.createTask("ethereum","12/12/2004").send({from:"0x8ffF9414d20EC0AF433723853ADb563F9560F117"});
    // console.log("body",req.body);
    const {taskDate} = req.body;
    const task = await dateClashCheck(taskDate);
    try{
        if(task !== "No Task Found"){
            res.status(409).json({status:409,message:"Date Clash! Task can not be added"});
        }
        else{
            res.status(200).json({status:200,message:"Task can be added"});
        }
    }
    catch(error){
        console.error(error);
    }
})

app.get("/api/ethereum/view-task/:taskId",async(req,res)=>{
    try{
    const {taskId} = req.params;
    const task = await contract.methods.viewTask(taskId).call();
    const {id,name,date} = task;
    const numId = Number(id);
    const taskOBJ={
        numId,name,date
    }
    // console.log(taskOBJ);
    // console.log(task);
    // console.log(taskId);
    if(numId==taskId)
    res.status(200).json({status:200,taskOBJ,message:"Task Exist"});
    else
    res.status(404).json({status:404,message:"Task does not exist"});
    }
    catch(error){
        res.status(500).json({status:500,message:"Task Id does not exist"});
    }
})

app.get("/api/ethereum/view-all-task",async(req,res)=>{
    try{
        const task = await contract.methods.allTask().call();
        // console.log(task);
        if(task.length < 0){
            res.status(404).json({status:404,message:"Task does not exist"});
        }
        else{
            const taskList = task.map(({id,name,date})=>{
                const taskId = Number(id);
                // console.log(taskId,name,date);
                return {taskId,name,date};
            })
            res.status(200).json({status:200,taskList,message:"Task Exist"});
        }
    }
    catch(error){
        res.status(500).json({status:500,message:"Task Id does not exist"});
    }
})


app.post("/api/ethereum/update-task",async(req,res)=>{
        const {taskDate}=req.body; 
        const task = await dateClashCheck(taskDate);
        // console.log("Taskdate",taskDate);
        // console.log("task",task);
        try{
          if(task!=="No Task Found"){
             res.status(409).json({status:409,message:"Date clash:Task cannot be updated"})
          }else{
             res.status(200).json({status:200,message:"Task can be updated"})
          }
        }catch(error){
         console.error(error)
        }
})

app.delete("/api/ethereum/delete-task/:taskId",async(req,res)=>{
    try{
      const {taskId}=req.params;
      const isTrue = await priorityCheck(taskId);
      if(isTrue){
        res.status(403).json({status:403,message:"Task cannot be deleted"})
      }else{
        res.status(200).json({status:200,message:"Task can be deleted"})
      }
    }catch(error){
      console.error(error)
    }
})


const PORT = 5000;

app.listen(PORT, function() {
    console.log("Server is running on port " + PORT);
});