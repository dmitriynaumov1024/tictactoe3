import { reactive } from "vue"
import { PlayerType, GameStatus, TicTacToeSign } from "./enums.js"
import { randomInt, probability } from "./utils.js"

export const BotLevel = {
    min: 1,
    max: 9
}

export const Player = {
    create (options) {
        return reactive({
            name: options.name ?? "Player",
            type: options.type ?? PlayerType.player,
            level: BotLevel.min,
            handlers: [...this.handlers],
            ...this.methods
        })
    },
    methods: {
        notify (game) {
            for (let handler of this.handlers) {
                handler.call(this, game)
            }
        },
        actLikeABot (game) {
            let thisIndex = game.players.indexOf(this)
            let otherIndex = (thisIndex + 1) % 2
            if (thisIndex != game.currentPlayer) return
            let thisSign = game.playerSigns[thisIndex]
            let otherSign = game.playerSigns[otherIndex]
            console.log("acting like a bot") 
            // first go through own signs, then through opponent signs
            // search for size-1 same signs and 1 empty cell
            if (probability(this.level * 0.13)) for (let sign of [thisSign, otherSign]) {
                for (let pattern of game.patterns) {
                    let count = { 
                        [TicTacToeSign.cross]: 0, 
                        [TicTacToeSign.zero]: 0,
                        total: 0
                    }
                    for (let { row, col } of pattern) {
                        count[game.board[row][col]] += 1
                        if (game.board[row][col] != TicTacToeSign.null) count.total += 1
                    }
                    if ((count[sign] == game.size - 1) && (count.total == game.size - 1)) {
                        return this.putSignFirstFreeCell(game, pattern)
                    }
                }
            }
            // search for N of this sign and size-N empty cells
            if (probability(this.level * 0.10)) for (let pattern of game.patterns) {
                let count = { 
                    [thisSign]: 0,
                    [otherSign]: 0, 
                    total: 0
                }
                for (let { row, col } of pattern) {
                    count[game.board[row][col]] += 1
                }
                if ((count[thisSign] > 0) && (count[otherSign] == 0)) {
                    return this.putSignFirstFreeCell(game, pattern)
                }
            }
            return this.putSignRandomly(game)
        },
        putSignFirstFreeCell (game, pattern) {
            console.log("putting sign in first free cell")
            console.log(pattern)
            for (let { row, col } of pattern) {
                if (game.board[row][col] == TicTacToeSign.null) {
                    console.log(row + " " + col)
                    return game.putSign(this, { row, col })
                }
            }
        },
        putSignRandomly (game) {
            console.log("putting sign randomly")
            let skip = randomInt(0, game.size * game.size - game.usedCells - 2)
            console.log(skip)
            for (let row=0; row<game.size; row+=1) {
                for (let col=0; col<game.size; col+=1) {
                    if (game.board[row][col] == TicTacToeSign.null) {
                        skip -= 1
                        if (skip <= 0) {
                            console.log(row + " " + col)
                            game.putSign(this, { row, col })
                            console.log(game.board)
                            return
                        }
                    }
                }
            }
        }
    },
    handlers: [
        function actLikeABot (game) {
            if (game.status == GameStatus.finished) return
            if (this.type != PlayerType.bot) return
            let thisIndex = game.players.indexOf(this)
            if (thisIndex != game.currentPlayer) return
            setTimeout(()=> {
                this.actLikeABot(game)
            }, randomInt(280, 590))
        }
    ]
}
