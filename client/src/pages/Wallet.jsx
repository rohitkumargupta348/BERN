// import React from 'react'
import Web3 from "web3";
import ABI from "./ABI.json";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


const Wallet = ({saveState}) => {
  const NavigateTo = useNavigate();
  const connectWallet = async () =>{
    try{
      if(window.ethereum){
        const web3 = new Web3(window.ethereum);
        const account = await window.ethereum.request({
          method:"eth_requestAccounts"//ensures that our metamask get opens
        })
        // console.log(web3);
        console.log(account);

        const contractAddress = "0x87E54BB9043D6334bE88433e87aAdEd8fE92b931";

        const contract = new web3.eth.Contract(ABI,contractAddress);

        console.log("Contract",contract);

        saveState({web3:web3,contract:contract,account:account[0]});

        NavigateTo("/view-all-task")

      }
      else{
        throw new Error;
      }
    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <>
     <div className="wallet_header ">
          <span>WELCOME TO</span> <p>TODO USING BLOCKCHAIN 3.0</p>
        </div>
        <div className="connect_wallet_section todo_btn">
          <p> Please connect metamask wallet to access the app </p>
          <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    </>
  )
}

Wallet.propTypes = {
  saveState:PropTypes.func.isRequired,
};

export default Wallet