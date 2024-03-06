import { reactive } from "vue"
import { PlayerType } from "./enums.js"
import { Player } from "./Player.js"
import { Game } from "./Game.js"

export const Lobby = {
    create () {
        return {
            size: 3,
            players: [
                Player.create({ name: "Player 1", type: PlayerType.player }),
                Player.create({ name: "Player 2", type: PlayerType.bot })
            ],
            ...this.methods
        }
    },
    methods: {
        createGame() {
            return Game.create({ 
                size: this.size, 
                players: this.players
            })
        }
    }
}
