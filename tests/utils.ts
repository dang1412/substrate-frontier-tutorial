import { ApiPromise, WsProvider } from '@polkadot/api'

// Construct
const wsProvider = new WsProvider('ws://127.0.0.1:9944')
const apiPromise = ApiPromise.create({ provider: wsProvider })

// Wait for the event collectibles.CollectibleCreated and resolve
export async function collectibleCreated(): Promise<[string, string]> {
  return new Promise(async (res, rej) => {
    const api = await apiPromise
    // Subscribe to system events
    const unsubscribe = await api.query.system.events((events: any) => {
      // Process each event
      events.forEach((event: any) => {
        const { event: { data, method, section } } = event;
        // Handle collectibles.CollectibleCreated event
        if (section === 'collectibles' && method === 'CollectibleCreated') {
          console.log(`${section}.${method}: ${data}`);
          const unique_id = data[0].toString()
          const owner = data[1].toString()
          res([unique_id, owner])
          ;(unsubscribe as any)()
        }
      });
    });
  })
}

export async function getCollectibleOwner(unique_id: string): Promise<string> {
  const api = await apiPromise
  const rs = await api.query.collectibles.collectibleMap(unique_id)
  const owner = `${(rs.toHuman() as any).owner}`

  return owner
}

export async function waitNextBlock(count = 1): Promise<any> {
  const api = await apiPromise
  return new Promise(async resolve => {
    let c = 0
    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
      c++
      if (c === count) {
        // Unsubscribe after receiving ${count} new block header
        unsubscribe()
        resolve(1)
      }
    })
  })
}

export async function apiDisconnect() {
  const api = await apiPromise
  await api.disconnect()
}