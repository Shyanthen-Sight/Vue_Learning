<template>
  <div>
    <div class="person">
      <h3>name: {{ name }}</h3>
      <button @click="showContact">show contact</button>
      <button @click="showContact">show contact</button>
    </div>
  </div>
</template>




<script lang="ts" setup>
let name = "张三";
function showContact() {
  alert("contact: 123456789");
}
</script>

<style scoped>
.person {
  background-color: #f0f0f0;
  box-shadow: 0 0 15px;
  border-radius: 10px;
  padding: 10px;
}
</style>