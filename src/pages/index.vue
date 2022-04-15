<script setup lang="ts">

interface BlockState {
  x:number,
  y:number,
  revealed: boolean,
  mine?: boolean,
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

function generateMines(){
  for(const row of state){
    for(const block of row){
      block.mine = Math.random() < 0.3
    }
  }
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
      directions.forEach(([dx,dy])=>{
        const x2 = x + dx
        const y2 = y + dy
        if(x2<0||x2>=WIDTH || y2<0||y2>=HEIGHT)
          return
        if(state[y2][x2].mine)
          block.adjacentMines++
      })
    })
  })
}

function getBlockClass(block:BlockState){
  if(!block.revealed)
    return 'bg-gray-500/10'
  return block.mine ? 'bg-red-500/30 text-red-500': numberColors[block.adjacentMines]
}

let mineGenerated = false
const dev = false


function onClick(block:BlockState) {
  if(!mineGenerated){
    block.revealed = true
    generateMines()
  }
  
  if(block.mine)
    alert('BOOOM!')
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
          hover="bg-gray/10"
          @click="onClick(block)"
        >
         <template v-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine ></div>
            <div v-else>{{ block.adjacentMines}}</div>
         </template>
          <!-- {{ item.mine ? 'x' : }} -->
        </button>
      </div>
    </div>
  </div>
</template>
