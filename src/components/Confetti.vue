<script setup lang="ts">
import confetti from "canvas-confetti";
const props = defineProps<{
    passed: boolean
}>()

function congrats(){
    const defaults = {
        colors:[
            '#5d8c7b',
            '#f2d091',
            '#f2a679',
            '#d969sf',
            '#8c4646',
        ],
        shapes:['square'],
        ticks:500
    } as confetti.Options

    confetti({
        ...defaults,
        particleCount:80,
        spread:100,
        origin:{y:0}
    })

    setTimeout(()=>{
        confetti({
            ...defaults,
            particleCount:50,
            angle:120,
            spread:80,
            origin:{x:0}
        })
    },250)
    
    setTimeout(()=>{
        confetti({
            ...defaults,
            particleCount:50,
            angle:120,
            spread:80,
            origin:{x:1}
        })
    },400)

    
}
watch(
    ()=>props.passed,
    (v)=>{
        if(v)
            setTimeout(congrats,300)
    },{flush: 'post'}
)
</script>

<template>
    <div></div>
</template>