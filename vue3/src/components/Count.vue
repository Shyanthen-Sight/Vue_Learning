<template>
<div class="count">
  <h2>current count:{{ count }}</h2>
  <select v-model="selectedValue">
    <option :value="1">1</option>
    <option :value="2">2</option>
    <option :value="3">3</option>
  </select>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
</div>
</template>


<script setup lang="ts" name="Count">
import { ref } from 'vue'

const count = ref(0)
const selectedValue = ref(1)

function increment() {
  count.value+= selectedValue.value
}

function decrement() {
  count.value-= selectedValue.value
}
</script>

<style scoped>
.count{
  background-color:#bcb7b7;
}
button,select{
  margin: 10px;
  height: 30px;
  width: 50px;
}
</style>

