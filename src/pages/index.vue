<script setup lang="ts">

interface BlockState {
  x:number,
  y:number,
  revealed: boolean,
  mine?: boolean,
  flagged?: boolean,
  adjacentMines: number
}

const WIDTH = 10
const HEIGHT = 10
const state = reactive(
  Array.from({ length:HEIGHT }, (_,y)=>
    Array.from({length:WIDTH},
      (_,x):BlockState=> ({
        x,
        y,
        adjacentMines:0,
        revealed:false
      })
    )
  )
)

function generateMines(initial:BlockState){
  for(const row of state){
    for(const block of row){
      if(Math.abs(initial.x - block.x) <= 1)
        continue
      if(Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers()
}

const directions = [
  [1,1],
  [1,0],
  [1,-1],
  [0,-1],
  [-1,0],
  [-1,-1],
  [0,1],
]

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500'
]

function updateNumbers(){
  state.forEach((row,y)=>{
    row.forEach((block,x)=>{
      if(block.mine)
        return
      getSiblings(block)
        .forEach(b=>{
          if(b.mine)
          block.adjacentMines++
        })
    })
  })
}

function expendZero(block:BlockState){
  console.log(block);
  if(block.adjacentMines)
    return
  
  
  getSiblings(block).forEach(b=>{

    if(!b.revealed){
      b.revealed = true
      expendZero(b)
    }
    
  })
}

function getSiblings(block:BlockState){
  return directions.map(([dx,dy])=>{
        const x2 = block.x + dx
        const y2 = block.y + dy
        if(x2<0||x2>=WIDTH || y2<0||y2>=HEIGHT)
          return undefined
        return state[y2][x2]
        // if(state[y2][x2].mine)
        //   block.adjacentMines++
      })
    .filter(Boolean) as BlockState[]
}

function getBlockClass(block:BlockState){
  if(block.flagged)
    return 'bg-gray-500/10'
  if(!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ? 'bg-red-500/30 text-red-500': numberColors[block.adjacentMines]
}

let mineGenerated = false
const dev = true

watchEffect(checkGameState)

function checkGameState(){
  console.log("checkGameState")
  if(!mineGenerated)
    return
  const blocks = state.flat()
  if(blocks.every(block=>block.revealed || block.flagged)){
    if(blocks.some(block=>block.flagged && !block.mine))
      alert('You cheat!')
    else
      alert('You win!')
  }

}

function onRightClick(block:BlockState){
  if(block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}

function onClick(block:BlockState) {
  if(!mineGenerated){
    generateMines(block)
    mineGenerated = true
  }
  
  block.revealed = true
  
  if(block.mine)
    alert('BOOOM!')
  // console.log("A")
  expendZero(block)
  checkGameState()
}
updateNumbers()
</script>

<template>
  <div>
    Minesweeper
    <div p-5>
      <div v-for="row,y in state"
       :key="y"
       flex="~"
       items-center justify-center>

        <button
          v-for="block,x in row"
          :key="x"
          flex="~"
          items-center justify-center
          w-10 h-10 m=".5"
          border="1 gray-300/10" 
          :class="getBlockClass(block)"
          @click="onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
        >
          <template v-if="block.flagged">
            <div i-mdi-flag text-red></div>
          </template>
         <template v-else-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine ></div>
            <div v-else>{{ block.adjacentMines}}</div>
         </template>
          <!-- {{ item.mine ? 'x' : }} -->
        </button>
      </div>
    </div>
  </div>
</template>
