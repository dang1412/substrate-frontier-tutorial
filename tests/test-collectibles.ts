// Import the ethers.js library
import { ethers } from 'ethers'

async function main() {
    // Set up the provider and the signer
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:9933')
    const signer = new ethers.Wallet('0x99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342', provider)

    // Set up the contract interface
    // Contract number 1026 => HEX '402'
    const contractAddress = '0x0000000000000000000000000000000000000402'
    const contractABI = [{
        "inputs": [],
        "name": "create_collectible",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]

    const contract = new ethers.Contract(contractAddress, contractABI, signer)

    // Call the contract method
    const methodName = 'create_collectible'

    const result = await contract[methodName]()

    console.log(result)
}

main()
