import { applyPatch, createObserver, listen, connect } from 'dop'

// SERVER

const players = {}
const listener = listen()
listener.on('call', client => {
    client.call()
})

const patch = {
    users: players.users + 1,
    alive: undefined
}

const players_new = applyPatch(players, patch)

patch.emitSubscribers((patch, node) => {
    return patch
})

// CLIENT

const server = await connect()
server.call()


// const {mutations, snapshot, emit} = collect(players, games, (players, games) => {
//     players.users += 1
//     games.users += 1
// })
// collector.emit((mutation, node) => true)

// REACT

const observer = createObserver()
observer.observeObject(players)
