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

type GameStatus = 'play' | 'won' | 'lost'

interface GameState{
    board: BlockState[][]
    mineGenerated:boolean
    gameState:'play' | 'won' | 'lost',
    timerMS:number,
    endMS?:number
}

export class GamePlay{
    state = ref() as Ref<GameState>
    mineGenerated = false
    gamesState = ref<'play' | 'won' | 'lost'>('play')

    constructor(
        public width:number,
        public height:number,
        public mines:number,) {
        this.reset()
    }
    get board(){
        return this.state.value.board
    }
    get blocks(){
        return this.state.value.board.flat()
    }

    reset(width=this.width,
        height=this.height,
        mines=this.mines){
            this.width = width
            this.height = height
            this.mines = mines
        console.log(width,height)
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
            board : board,
            timerMS: +Date.now()
        }
    }

    random(min:number, max:number){
        return Math.random() * (max - min) + min
    }

    randomInt(min:number, max:number){
        return Math.round(this.random(min,max))
    }

    generateMines(state: BlockState[][],initial:BlockState){
        
        const placeRandom = () => {
            const x = this.randomInt(0,this.width-1)
            const y = this.randomInt(0,this.height-1)
            const block = state[y][x]
            if(Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1)
                return false
            if(block.mine)
                return false
            block.mine = true
            return true
        }

        Array.from({length:this.mines},()=> null)
         .forEach(()=>{
           
            // while(placeRandom()){}

            let place = false
            while(!place){
                place = placeRandom()
            }
            
         })


        // for(const row of state){
        //     for(const block of row){
        //     if(Math.abs(initial.x - block.x) <= 1)
        //         continue
        //     if(Math.abs(initial.y - block.y) <= 1)
        //         continue
        //     block.mine = Math.random() < 0.3
        //     }
        // }
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
        if(this.state.value.gameState !== 'play')
            return
        if(!this.state.value.mineGenerated){
            this.generateMines(this.board,block)
            this.state.value.mineGenerated = true
        }
        
        block.revealed = true
        
        if(block.mine){
            // this.state.value.gameState = 'lost'
            // this.showAllMines()
            // alert('BOOOM!')
            this.onGameOver('lost')
            return
        }
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

        if (blocks.every(block => block.revealed || block.flagged || block.mine)) {
            if (blocks.some(block => block.flagged && !block.mine)) {
                this.state.value.gameState = 'lost'
                // this.showAllMines()
            }
            else {
                this.state.value.gameState = 'won'
                this.onGameOver('won')
            }
        }
    }

    autoExpand(block:BlockState){
        console.log("autoExpand")
        const siblings = this.getSiblings(block)
        const flags = siblings.reduce((a,b)=> a + (b.flagged ? 1 :0),0)
        const notRevealed = siblings.reduce((a,b)=> a + (!b.revealed && !b.flagged ? 1 :0),0) 
        console.log("flags",flags)
        console.log("block.adjacentMines",block.adjacentMines)
        if(flags === block.adjacentMines){
            siblings.forEach(i=>{
                i.revealed = true
                if(i.mine)
                    this.onGameOver('lost')
            })
        }

        const missingFlags = block.adjacentMines - flags
        console.log("missingFlags",missingFlags)
        console.log("notRevealed",notRevealed)
        if(notRevealed === missingFlags){
            siblings.forEach(i=>{
                if(!i.revealed && !i.flagged)
                    i.flagged = true
            })
        }
    }
    onGameOver(status: GameStatus){
        this.state.value.gameState = status
        this.state.value.endMS = +Date.now()
        if(status === 'lost'){
            this.showAllMines()
            setTimeout(()=>{
                alert("lost")
            },10)
        }
    }
}