<template>
  <div class="talk">
    <h2>Love Talk</h2>
    <button @click="getLoveTalk">get LoveTalk</button>
    <ul>
      <li></li>
    </ul>
  </div>
</template>


<script setup lang="ts" name="LoveTalk">
import { reactive } from 'vue'
import axios from 'axios'
import {nanoid} from 'nanoid'
let loveTalk = reactive([

  { id: nanoid(), content: 'I love you' },
  { id: nanoid(), content: 'I miss you' },
  { id: nanoid(), content: 'I want to be with you' }

])
function getLoveTalk() {
  axios.get('https://api.ooopn.com/ciba/api.php?type=json').then((res) => {
    loveTalk.push({ id: nanoid(), content: res.data.ciba.text })
  })
}
</script>

<style scoped>
.talk {
  margin-top: 20px;
  background-color: #e0a5a5;
  padding: 20px;
}
</style>
