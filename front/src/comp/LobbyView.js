// LobbyView
// show 2 players, edit their name and type

import { h } from "vue"
import { PlayerType } from "@/game/enums.js"
import { BoardSize } from "@/game/Game.js"
import { BotLevel } from "@/game/Player.js"

const PlayerView = {
    props: {
        player: Object
    },
    methods: {
        togglePlayerType () {
            this.player.type = this.player.type == PlayerType.bot ? 
                PlayerType.player :
                PlayerType.bot
        },
        onChangeName () {
            this.player.name = this.$refs.playerNameInput.value
        },
        levelMinus () {
            if (this.player.level > BotLevel.min) {
                this.player.level -= 1
            }
        },
        levelPlus () {
            if (this.player.level < BotLevel.max) {
                this.player.level += 1
            }
        }
    },
    render () {
        let { player } = this
        return h("div", { class: ["mar-b-05", "pad-05", "card-card"] }, [
            h("div", { class: "flex-stripe" }, [
                h("span", { class: ["width-6"] }, "name"),
                h("span", { }, "= "),
                h("input", { class: ["inline-input", "super-inline", "width-8"], ref: "playerNameInput", value: player.name, onChange: this.onChangeName }),
                h("span", { class: ["flex-grow"] })
            ]),
            h("div", { class: "flex-stripe" }, [
                h("span", { class: ["width-6"] }, "type"),
                h("span", { class: ["clickable"], onClick: this.togglePlayerType }, `< ${player.type} >`),
                h("span", { class: ["flex-grow"] })
            ]),
            player.type == PlayerType.bot?
            h("div", { class: "flex-stripe" }, [
                h("span", { class: ["width-6"] }, "level"),
                h("span", { class: ["clickable"], onClick: this.levelMinus }, "[-]"),
                h("span", { }, ` 0${this.player.level} `),
                h("span", { class: ["clickable"], onClick: this.levelPlus }, "[+]"),
                h("span", { class: ["flex-grow"] })
            ]) : 
            null
        ])
    }
}

const SizeSelectorView = {
    props: {
        lobby: Object
    },
    methods: {
        sizeMinus() {
            if (this.lobby.size > BoardSize.min) {
                this.lobby.size -= 1
            }
        },
        sizePlus() {
            if (this.lobby.size < BoardSize.max) {
                this.lobby.size += 1
            }
        }
    },
    render() {
        let size = this.lobby.size
        return h("div", { class: ["mar-b-05", "pad-05", "card-card"] }, [
            h("div", { class: "flex-stripe" }, [
                h("span", { class: ["width-6"] }, "size"),
                h("span", { class: ["clickable"], onClick: this.sizeMinus }, "[-]"),
                h("span", { }, ` ${size}x${size} `),
                h("span", { class: ["clickable"], onClick: this.sizePlus }, "[+]"),
                h("span", { class: ["flex-grow"] })
            ]),
        ])
    }
}

export default {
    props: {
        lobby: Object
    },
    methods: {

    },
    render () {
        return h("div", { }, [
            h("h4", { class: ["pad-025"] }, "Board"),
            h(SizeSelectorView, { lobby: this.lobby }),
            h("h4", { class: ["pad-025"] }, "Players"),
            this.lobby.players.map((player)=> {
                return h(PlayerView, { player })
            })
        ])
    }
}
