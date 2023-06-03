// Import the ethers.js library
import { ethers } from 'ethers'
import { apiDisconnect, collectibleCreated, getCollectibleOwner, waitNextBlock } from './utils'

// Test account which holds fund
const USER1_PRIVATE_KEY = '0x99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'
const USER1_ETH_ADDR = '0x6be02d1d3665660d22ff9624b7be0551ee1ac91b'
const USER1_SUBS_ADDR = '5CNJv1vQjABY9W3BtsV2tzaLCjZepWXaYYzuDGWUUNVvMjcG'

// Account2
const USER2_ETH_ADDR = '0xd43593c715fdd31c61141abd04a99fd6822c8558'
const USER2_SUBS_ADDR = '5FrLxJsyJ5x9n2rmxFwosFraxFCKcXZDngRLNectCn64UjtZ'

// Contract address
const CONTRACT_ADDR = '0x0000000000000000000000000000000000000402'
const CONTRACT_ABI = require('./collectibles.abi.json')

describe('Collectibles frontier', () => {
  test('create collectible and transfer', async () => {
    // Provider connect to local node
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:9933')
    // Signer
    const signer = new ethers.Wallet(USER1_PRIVATE_KEY, provider)
    // Contract
    const contract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, signer)

    // call contract create_collectible method
    contract['create_collectible']()
    // get unique_id, owner from Substrate System event
    const [unique_id, owner] = await collectibleCreated()
    // confirm unique_id length, owner
    expect(unique_id.length).toBe(34)
    expect(owner).toEqual(USER1_SUBS_ADDR)

    // call contract transfer to user2 ETH address
    await contract['transfer'](USER2_ETH_ADDR, unique_id)

    // wait 2 block
    await waitNextBlock(2)

    // confirm new owner is user2 substrate address
    const newOwner = await getCollectibleOwner(unique_id)
    expect(newOwner).toEqual(USER2_SUBS_ADDR)

    // stop api
    await apiDisconnect()
  })
})
