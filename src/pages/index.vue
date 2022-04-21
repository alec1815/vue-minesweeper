<script setup lang="ts">
import {toggleDev, isDev} from '~/composables'
import { GamePlay } from '~/composables/logic';

const play = new GamePlay(10,10,10)
useStorage("vuesweeper-state",play.state)
const state = computed(()=>play.board)

watchEffect(()=>{
  play.checkGameState()
})
console.log("blocks",play.blocks)
const mineCount = computed(()=>{
  return play.blocks.reduce((a,b)=>a+(b.mine?1:0),0)
})
console.log("state",state)
</script>

<template>
  <div>
    Minesweeper
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
    <div>{{mineCount}}</div>
    <div flex="~ gap-1" justify-center >
      <button btn @click="toggleDev()">{{isDev ? 'DEV' : 'NORMAL'}}</button>
      <button btn @click="play.reset()">RESET</button>
    </div>
    <Confetti :passed="play.state.value.gameState === 'won'"></Confetti>
  </div>
</template>
