"use strict";

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress, } from "./constants.js"

document.addEventListener("DOMContentLoaded", () => {

const connectButton = document.getElementById("connectButton")
const showAccount = document.getElementById('showAccount')
const applyButton = document.getElementById('applyButton')
const certificateButton = document.getElementById("certificate-button");
const generateButton = document.getElementById("generateCertificate");


connectButton.onclick = connect
applyButton.onclick = apply
certificateButton.onclick = getCertificate
generateButton.onclick = generate





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



async function apply() {
  const age = document.getElementById("age").value
  const name = document.getElementById("name").value
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const users = await contract.Users(accounts.toString())
      const hasApplied = users.hasApplied
      if(hasApplied === true){
        alert("Student has already applied")
        return
      }
      const transactionResponse = await contract.applyForCertificate(name, age)
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done")
      alert("Applied!")
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    applyButton.innerHTML = "Please install MetaMask"
  } 
}

async function generate() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
		const users = await contract.Users(accounts.toString())
    const isApproved = users.isApproved
    if(isApproved === false){
      alert("Management has not approved your Ceritificate")
      return
    }
    const isGenerated = users.generated
    if (isGenerated === true){
      alert("Certificate already generated!")
      return
    }
      const transactionResponse = await contract.generateCertificate()
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done")
      alert("Applied!")
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    applyButton.innerHTML = "Please install MetaMask"
  } 
}


async function getCertificate() {
  if (typeof window.ethereum !== 'undefined') {
	  const provider = new ethers.providers.Web3Provider(window.ethereum)
	  const signer = provider.getSigner()
	  const contract = new ethers.Contract(contractAddress, abi, signer)
	  try {
		const accounts = await ethereum.request({ method: 'eth_accounts' })
		const users = await contract.Users(accounts.toString())
    const isGenerated = users.generated
    if (isGenerated === false){
      alert("Certificate not generated!")
      return
    }
    const name = document.getElementById('studentName')
    const userName = users.name
    name.innerHTML = userName
    const age = document.getElementById('studentAge')
    const userAge = users.age
    age.innerHTML = userAge
    const institute = document.getElementById('studentUni')
    const userUni = users.institute
    institute.innerHTML = userUni
    const issuedOn = document.getElementById('studentTime')
    let unixTimestamp = parseInt(users.issuedOn)
      let date = new Date(unixTimestamp * 1000)
      const humanDateFormat = date.toLocaleString()

      issuedOn.innerHTML = humanDateFormat
    
	  } catch (error){
		console.log(error)
	  }
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
