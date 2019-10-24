import { applyPatch } from 'dop'

// STORE

const subscribersPlayers = []

const players = {}

const patch = {
    users: players.users + 1,
    alive: undefined
}

applyPatch(players, patch)

// REACT

function App() {
    const onPatch = patch => { }
    subscribersPlayers.push(onPatch)

    return <div></div>
}
