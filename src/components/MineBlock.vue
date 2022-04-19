<script setup lang="ts">
import {isDev as dev} from '~/composables'
import { BlockState } from '~/types'
defineProps<{block:BlockState}>()
// const dev = true
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
function getBlockClass(block:BlockState){
  if(block.flagged)
    return 'bg-gray-500/10'
  if(!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ? 'bg-red-500/30 text-red-500': numberColors[block.adjacentMines]
}
</script>
<template>
<button
          flex="~"
          items-center justify-center
          w-10 h-10 m=".5"
          border="1 gray-300/10" 
          :class="getBlockClass(block)"
          
        >
          <template v-if="block.flagged">
            <div i-mdi-flag text-red></div>
          </template>
         <template v-else-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine ></div>
            <div v-else font-600>{{ block.adjacentMines}}</div>
         </template>
          <!-- {{ item.mine ? 'x' : }} -->
        </button>
</template>

