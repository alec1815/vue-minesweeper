<script setup lang="ts">
import {toggleDev, isDev} from '~/composables'
import { GamePlay } from '~/composables/logic';

const now = $(useNow())
const timerMS = $computed(()=> Math.round((+now - play.state.value.timerMS)/1000))

const play = new GamePlay(9,9,10)
useStorage("vuesweeper-state",play.state)
const state = computed(()=>play.board)

function newGame(difficulty: 'easy' | 'medium' | 'hard'){
  console.log(difficulty)
  switch(difficulty){
    case'easy':
      play.reset(9,9,10)
      break
    case'medium':
      play.reset(20,20,40)
      break
    case'hard':
      play.reset(20,30,99)
      break
  }
}

watchEffect(()=>{
  play.checkGameState()
})
console.log("blocks",play.blocks)
// const mineCount = computed(()=>{
//   return play.blocks.reduce((a,b)=>a+(b.mine?1:0),0)
// })

const mineRest = $computed(()=>{
  if(!play.state.value.mineGenerated)
    return play.mines
  return play.blocks.reduce((a,b)=>a+(b.mine?1:0) - (b.flagged ? 1: 0) ,0)
})
console.log("state",state)
</script>

<template>
  <div>
    Minesweeper
    <div flex="~ gap1" justify-center p4>
      <button btn @click="play.reset()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>

    <div flex="~ gap-10" justify-center>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-carbon-time />
        {{timerMS}}
      </div>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-mdi-mine />
        {{mineRest}}
      </div>
      
    </div>
    <div p-5 w-full overflow-auto>
      <div v-for="row,y in state"
       :key="y"
       flex="~"
       items-center justify-center w-max ma>

        <MineBlock
         v-for="block,x in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
          ></MineBlock>
      </div>
    </div>
    <!-- <div>{{mineCount}}</div> -->
    <div flex="~ gap-1" justify-center >
      <button btn @click="toggleDev()">{{isDev ? 'DEV' : 'NORMAL'}}</button>
      
    </div>
    <Confetti :passed="play.state.value.gameState === 'won'"></Confetti>
  </div>
</template>
