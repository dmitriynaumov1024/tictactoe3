// MainView
// just conditionally show LobbyView or GameView

import { h } from "vue"
import LobbyView from "./LobbyView.js"
import GameView from "./GameView.js"

const Mode = {
    lobby: "lobby",
    game: "game"
}

export default {
    props: {
        client: Object
    },
    methods: {
        goToLobby() {
            if (this.mode == Mode.lobby) return
            this.mode = Mode.lobby
        },
        goToGame() {
            if (this.mode == Mode.game) return
            this.mode = Mode.game
        },
        startNewGame() {
            this.client.game = this.client.lobby.createGame()
            this.mode = Mode.game
        }
    },
    data() {
        return {
            mode: Mode.lobby
        }
    },
    render() {
        let { mode } = this
        let { lobby, game } = this.client
        return h("div", { class: ["width-container", "pad-h-1", "text-mono"] }, [
            h("div", { class: ["pad-05"] }, [
                h("h1", { class: ["text-center"] }, "Tic-Tac-Toe")
            ]),
            h("div", { class: ["hr-3", "mar-b-1", "accent-gray"] }),
            game != null ?
            h("div", { class: ["flex-stripe", "flex-pad-1", "mar-b-1"] }, [
                h("button", { class: ["flex-grow", (mode==Mode.lobby)? "accent-fore" : "accent-gray", "button", (mode==Mode.lobby)? "button-1": "button-2"], onClick: this.goToLobby }, "Lobby"),
                h("button", { class: ["flex-grow", (mode==Mode.game)? "accent-fore" : "accent-gray", "accent-gray", "button", (mode==Mode.game)? "button-1": "button-2"], onClick: this.goToGame }, "Game")
            ]) : null,
            mode == Mode.lobby ? 
            h("div", { }, [
                h("div", { class: ["mar-b-1"] }, [
                    h(LobbyView, { lobby })
                ]),
                game != null ? 
                h("button", { class: ["button", "button-2", "accent-gray", "button-block", "mar-b-1"], onClick: this.goToGame }, "Back to game") :
                null,
                h("button", { class: ["button", "button-1", "accent-fore", "button-block", "flex-grow"], onClick: this.startNewGame }, "Start new game")
            ]) : 
            h("div", { }, [
                h(GameView, { game }) 
            ])
        ])
    }
}
