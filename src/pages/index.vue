<script setup lang="ts">
import type {BlockState} from '~/types'
import {toggleDev, isDev} from '~/composables'

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



let mineGenerated = false


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
    <button @click="toggleDev()">{{isDev}}</button>
    <div p-5>
      <div v-for="row,y in state"
       :key="y"
       flex="~"
       items-center justify-center>

        <MineBlock
         v-for="block,x in row"
          :key="x"
          :block="block"
          @click="onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
          ></MineBlock>
      </div>
    </div>
  </div>
</template>
