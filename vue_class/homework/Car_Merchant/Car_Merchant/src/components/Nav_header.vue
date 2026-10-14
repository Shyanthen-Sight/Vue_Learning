<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoUrl from '@/assets/image/logo/logo.png'
const router = useRouter()
const route = useRoute()

const isRentPage = computed(() => route.name === 'Rent_page')
const leapText = computed(() => (isRentPage.value ? 'Back' : "Let's start"))

function goToRentPage() {
  if (isRentPage.value) {
    router.push({ name: 'Home_page' })
  } else {
    router.push({ name: 'Rent_page' })
  }
}

const iconRotated = ref(false)

function icon_rotate() {
  iconRotated.value = true
}

function icon_reset() {
  iconRotated.value = false
}

</script>

<template>
  <header class="nav_bar">
    <div id="logo">
      <img :src="logoUrl" alt="logo" />
    </div>
    <div
      @click="goToRentPage"
      id="leap_area"
      @mouseenter="icon_rotate"
      @mouseleave="icon_reset"
    >
      <div id="leap_block">
       <svg :class="['icon', { rotated: iconRotated, flipped: isRentPage }]" t="1791779959304" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8349" width="200" height="200"><path d="M769.216 511.936c0-3.712-1.152-7.232-1.856-10.88-0.64-2.368-0.64-4.8-1.408-7.04a50.56 50.56 0 0 0-11.136-17.344l-417.28-417.28a48.96 48.96 0 0 0-68.992-0.96 48.832 48.832 0 0 0 1.024 68.864L654.208 512l-384.64 384.768a48.768 48.768 0 0 0-1.024 68.8 48.768 48.768 0 0 0 68.864-0.96l417.28-417.344a51.2 51.2 0 0 0 11.136-17.344c0.896-2.304 0.896-4.736 1.472-7.04 0.768-3.648 1.92-7.232 1.92-10.944z" fill="#515151" p-id="8350"></path></svg>
       <span class="font_text">{{ leapText }}</span>
       </div>
    </div>
  </header>
</template>

<style scoped>
.nav_bar {
  position: fixed;      
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 8vh;
  background-color: rgba(255, 255, 255);
  padding: 0 20px;
  box-sizing: border-box;
  
}

#logo {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 15vw;
}

#logo img {
  max-height: 100%;
  width: 50%;
  height: auto;
  display: block;
}



#leap_area {
  height: 100%;
  width: 15vw;
  display: flex;
  align-items: center;
  margin-right: 15vw;
  cursor: pointer;      
}

#leap_area:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

#leap_block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 5px;
}

#leap_area #leap_block span {
  width:60%;
  font-size: 1.6rem;
  color: #515151;
}
.icon{
  width:40%;
  height:50%;
  transition: transform 0.3s ease;
}
.icon.rotated {
  transform: rotate(90deg);
}
.icon.flipped {
  transform: scaleX(-1);
}
.icon.flipped.rotated {
  transform: scaleX(-1) rotate(90deg);
}
</style>
