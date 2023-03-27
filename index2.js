"use strict";

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress, } from "./constants.js"

document.addEventListener("DOMContentLoaded", () => {

const connectButton = document.getElementById("connectButton")
const showAccount = document.getElementById('showAccount')
const verifyUser = document.getElementById('verify')


connectButton.onclick = connect
verifyUser.onclick = verify





async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
    showAccount.innerHTML = accounts
}
   else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}




async function verify() {
  const studentAddress = document.getElementById("studentAddress").value
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const users = await contract.Users(studentAddress.toString())
      const hasApplied = users.hasApplied
      if(hasApplied === false){
        alert("Student has not applied")
        return
      }
      const isApproved = users.isApproved
      if(isApproved === true){
        alert("User has been already approved")
        return
      }
      const transactionResponse = await contract.verifyStudent(studentAddress)
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done")
      alert("Verified!")
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    purchaseButton.innerHTML = "Please install MetaMask"
  } 
}




function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}

});
