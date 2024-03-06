// GameView
// play Tic-Tac-Toe game

import { h } from "vue"
import { TicTacToeSign, PlayerType, GameStatus } from "@/game/enums.js"
import { formatTime, clamp } from "@/game/utils.js"

const sign = TicTacToeSign

const icons = {
    [sign.null](props) {
        return h("rect", { width: 10, height: 10, fill: "#fefefe", opacity: "0.03", transform: `translate(${props.col*10}, ${props.row*10})`, onClick: props.onClick })
    },
    [sign.zero](props) {
        return h("circle", { cx: 5, cy: 5, r: 2.7, fill: "none", stroke: "#553780", "stroke-width": 1, transform: `translate(${props.col*10}, ${props.row*10})` } )   
    },
    [sign.cross](props) {
        return h("path", { d: "M 2.5 2.5 L 7.5 7.5 M 2.5 7.5 L 7.5 2.5", stroke: "#f05454", "stroke-width": 1, transform: `translate(${props.col*10}, ${props.row*10})` })
    }
}

const GameGrid = {
    props: {
        size: Number,
        grid: Array
    },
    emits: [
        "putSign"
    ],
    render() {
        console.log("GameGrid.render")
        let { size, grid } = this
        return h("svg", { style: { display: "block", maxWidth: "100%", width: Math.min(size*75, 360)+"px", margin: "0 auto" }, viewBox: [0, 0, size * 10, size * 10].join(" ") }, [
            grid.map((row, i) => row.map((cell, j) => {
                return icons[cell]({ row: i, col: j, onClick: ()=> this.$emit("putSign", i, j) })
            })),
            grid.slice(1).map((_, i)=> [
                h("line", { x1: 10*(i+1), x2: 10*(i+1), y1: 0, y2: size*10, "stroke-width": 0.5, stroke: "#dedede" }),
                h("line", { y1: 10*(i+1), y2: 10*(i+1), x1: 0, x2: size*10, "stroke-width": 0.5, stroke: "#dedede" })
            ]),
        ])
    }
}

export default {
    props: {
        game: Object
    },
    methods: {
        onPutSign (row, col) {
            let game = this.game
            let currentPlayer = game.players[game.currentPlayer]
            if (currentPlayer.type == PlayerType.bot) return
            else game.putSign(currentPlayer, { row, col })
        },
        onRestart () {
            this.game.reset()
        }
    },
    render() {
        let game = this.game
        let elapsedTime = clamp(game.startAt? ((game.endAt || this.$timer.time) - game.startAt) : 0, 0, Infinity)
        return h("div", { }, [
            h("div", { class: ["card-card", "pad-05", "mar-b-1"] }, game.players.map((player, i) => {
                return h("div", { class: ["flex-stripe", "flex-pad-05"] }, [
                    h("svg", { viewBox: "0 0 10 10", class: ["icon-15"] }, [
                        h(icons[game.playerSigns[i]], { row: 0, col: 0 })
                    ]),
                    h("span", { class: ["flex-grow", i==game.currentPlayer? "text-strong" : "text-gray"] }, player.type==PlayerType.bot? (`${player.name} [ bot/${player.level} ]`) : player.name)
                ])
            })),
            h("div", { class: ["card-card", "pad-1", "mar-b-1"] }, [
                h("div", { class: "mar-b-05" }, [
                    h(GameGrid, { size: game.size, grid: game.board, onPutSign: this.onPutSign }),
                ]),
                elapsedTime? 
                    h("p", { class: ["text-center"] }, `Elapsed time: ${formatTime(elapsedTime)}`) : 
                    h("p", { class: ["text-center"] }, `Ready`),
                game.status==GameStatus.finished?
                    game.draw? 
                        h("p", { class: ["text-center"] }, `This is a draw!`) : 
                        h("p", { class: ["text-center"] }, `Winner: ${game.players[game.winnerPlayer].name}`)
                    : h("p", { class: ["text-center"] }, `${game.players[game.currentPlayer].name} [${game.usedCells}/${game.size*game.size}]`)
            ]),
            game.status==GameStatus.finished?
                h("button", { onClick: this.onRestart, class: ["flex-stripe", "flex-pad-05", "pad-05", "button", "button-1", "button-block", "accent-fore"] }, [
                    h("span", { class: ["flex-grow"] }, " "),
                    h("svg", { viewBox: "0 0 10 10", class: ["icon-1"] }, [
                        h("path", { stroke: "var(--color-back-0)", "stroke-width": "1.33", fill: "none",
                            d: "M 1 5 Q 1.1 8.9 5 9 Q 8.9 8.9 9 5 Q 8.9 1.6 5 1.5 Q 3.8 1.5 3 2.5 M 4 0.4 L 2.5 2.7 L 5 3.7"
                        })
                    ]),
                    h("span", { }, "Restart"),
                    h("span", { class: ["flex-grow"] }, " ")
                ]) : 
                null
        ])
    }
}
