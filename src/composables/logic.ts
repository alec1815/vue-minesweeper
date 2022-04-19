/*
 * @Author: your name
 * @Date: 2022-04-19 17:05:14
 * @LastEditTime: 2022-04-19 17:09:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-minesweeper\src\composables\logic copy.ts
 */
/*
 * @Author: your name
 * @Date: 2022-04-19 15:33:23
 * @LastEditTime: 2022-04-19 15:54:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-minesweeper\src\composables\logic copy.ts
 */
import { Ref } from "vue"
import { BlockState } from "~/types"

const directions = [
    [1,1],
    [1,0],
    [1,-1],
    [0,-1],
    [-1,0],
    [-1,-1],
    [0,1],
]

interface GameState{
    board: BlockState[][]
    mineGenerated:boolean
    gameState:'play' | 'won' | 'lost'
}

export class GamePlay{
    state = ref() as Ref<GameState>
    mineGenerated = false
    gamesState = ref<'play' | 'won' | 'lost'>('play')

    constructor(
        public width:number,
        public height:number) {
        this.reset()
    }
    get board(){
        return this.state.value.board
    }

    reset(){
        console.log("reset")
        const board = Array.from({ length:this.height }, (_,y)=>
            Array.from({length:this.width},
                (_,x):BlockState=> ({
                    x,
                    y,
                    adjacentMines:0,
                    revealed:false
                })
            )
        )
        console.log("board",board)
        this.state.value = {
            mineGenerated :false,
            gameState:'play',
            board : board
        }
    }

    generateMines(state: BlockState[][],initial:BlockState){
        for(const row of state){
            for(const block of row){
            if(Math.abs(initial.x - block.x) <= 1)
                continue
            if(Math.abs(initial.y - block.y) <= 1)
                continue
            block.mine = Math.random() < 0.3
            }
        }
        console.log("generateMines" ,state)
        this.updateNumbers()
    }

    updateNumbers(){
        this.board.forEach((row)=>{
            row.forEach((block)=>{
            if(block.mine)
                return
            this.getSiblings(block)
                .forEach(b=>{
                if(b.mine)
                block.adjacentMines++
                })
            })
        })
    }

    expendZero(block:BlockState){
        // console.log(block);
        if(block.adjacentMines)
            return
        this.getSiblings(block).forEach(b=>{

            if(!b.revealed){
            b.revealed = true
            this.expendZero(b)
            }
            
        })
    }

    onRightClick(block:BlockState){
        if(this.state.value.gameState !== 'play')
            return
        if(block.revealed)
            return
        block.flagged = !block.flagged
        // this.checkGameState()
    }

    onClick(block:BlockState) {
        // console.log("mineGenerated",this.state.value.mineGenerated)
        if(this.state.value.gameState !== 'play')
            return
        if(!this.state.value.mineGenerated){
            this.generateMines(this.board,block)
            this.state.value.mineGenerated = true
        }

        // console.log("generateMines",this.board.value)
        
        block.revealed = true
        
        if(block.mine){
            this.state.value.gameState = 'lost'
            this.showAllMines()
            alert('BOOOM!')
            return
        }
        // console.log("A")
        this.expendZero(block)
        // this.checkGameState()
    }

    getSiblings(block:BlockState){
        return directions.map(([dx,dy])=>{
                const x2 = block.x + dx
                const y2 = block.y + dy
                if(x2<0||x2>=this.width || y2<0||y2>=this.height)
                return undefined
                return this.board[y2][x2]
                // if(state[y2][x2].mine)
                //   block.adjacentMines++
            })
            .filter(Boolean) as BlockState[]
    }

    showAllMines(){
        console.log("showAllMines")
        this.board.flat().forEach(item=>{
            if(item.mine){
                item.revealed = true
            }
        })
    }

    checkGameState(){
        if (!this.state.value.mineGenerated)
            return
        const blocks = this.board.flat()

        if (blocks.every(block => block.revealed || block.flagged)) {
            if (blocks.some(block => block.flagged && !block.mine)) {
                this.state.value.gameState = 'lost'
                this.showAllMines()
                alert("lost")
            }
            else {
                this.state.value.gameState = 'won'
                alert("won")
            }
        }
    }
}