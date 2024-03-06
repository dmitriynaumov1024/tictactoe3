import { Lobby } from "./Lobby.js"

export const Client = {
    create () {
        let client = {
            lobby: Lobby.create(),
            game: null
        }
        return client
    }
}
