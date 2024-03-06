import { reactive } from "vue"
import { GameStatus, TicTacToeSign } from "./enums.js"
import { Coord } from "./Coord.js"
import { clamp, probability } from "./utils.js"

export const BoardSize = {
    min: 2,
    max: 5
}

export const Game = {
    create (options) {
        options.size = clamp(options.size, BoardSize.min, BoardSize.max)
        let game = reactive({
            size: options.size,
            players: [
                options.players[0], 
                options.players[1]
            ],
            board: this.createBoard(options.size),
            patterns: this.createPatterns(options.size),
            status: GameStatus.ready,
            ...this.methods
        })
        game.reset()
        return game
    },
    createBoard (size) {
        let board = Array(size)
        for (let i=0; i<size; i+=1) {
            board[i] = Array(size).fill(TicTacToeSign.null)
        }
        return board
    },
    createPatterns (size) {
        if (this.patterns[size]) {
            return this.patterns[size]
        }
        let patterns = []
        let diag1Pattern = [],
            diag2Pattern = []
        for (let i=0; i<size; i+=1) {
            diag1Pattern.push(Coord(i, i))
            diag2Pattern.push(Coord(i, size-i-1))
            let rowPattern = [],
                colPattern = []
            for (let j=0; j<size; j+=1) {
                rowPattern.push(Coord(i, j))
                colPattern.push(Coord(j, i))
            }
            patterns.push(rowPattern)
            patterns.push(colPattern)
        }
        patterns.push(diag1Pattern)
        patterns.push(diag2Pattern)
        this.patterns[size] = patterns
        return patterns
    },
    methods: {
        reset () {
            for (let row in this.board) {
                for (let col in this.board[row]) {
                    this.board[row][col] = TicTacToeSign.null
                }
            }
            this.status = GameStatus.ready
            this.draw = undefined
            this.usedCells = 0
            this.startAt = 0
            this.endAt = 0
            this.currentPlayer = probability(0.5) ? 0 : 1
            this.winnerPlayer = null
            this.winnerPattern = null
            this.playerSigns = probability(0.5) ? 
                [ TicTacToeSign.cross, TicTacToeSign.zero ] :
                [ TicTacToeSign.zero, TicTacToeSign.cross ]
            setTimeout(()=> {
                this.players[0].notify(this)
                this.players[1].notify(this)
            }, 10)
        },
        putSign (player, { row, col }) {
            let canPutSign = this.status != GameStatus.finished &&
                this.players[this.currentPlayer] == player &&
                this.board[row][col] == TicTacToeSign.null
            if (!canPutSign) {
                return false
            }
            if (this.status == GameStatus.ready) {
                this.start()
            }
            this.board[row][col] = this.playerSigns[this.currentPlayer]
            this.usedCells += 1
            this.checkWin()
            if (this.status == GameStatus.playing) {
                this.currentPlayer = (this.currentPlayer + 1) % 2 
            }
            setTimeout(()=> {
                this.players[0].notify(this)
                this.players[1].notify(this)
            }, 120)
            return true
        },
        checkWin () {
            for (let pattern of this.patterns) {
                for (let p of [0, 1]) {
                    let count = pattern.reduce((prev, { row, col })=> prev + (this.board[row][col]==this.playerSigns[p]? 1 : 0), 0)
                    if (count == this.size) {
                        this.winnerPlayer = p
                        this.winnerPattern = pattern
                        this.finish()
                        return
                    }
                }
            }
            if (this.usedCells == (this.size * this.size)) {
                this.draw = true
                this.finish()
                return
            }
        },
        start() {
            this.status = GameStatus.playing
            this.startAt = Date.now()
        },
        finish() {
            console.log("finish")
            this.status = GameStatus.finished
            this.endAt = Date.now()
        }
    },
    patterns: [ ]
}
