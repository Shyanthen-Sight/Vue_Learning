<script setup lang="ts">

</script>

<template>
  <div id="hero_video_board">
    <video src="/video/vi-hero-4.mp4" autoplay muted loop playsinline></video>
    <div id="mask"></div>
    <div id="headline" class="hero_video_board_text title">Welcome to Our Car Rent Store</div>
    <div id="subheadline" class="hero_video_board_text text">Find the perfect car for your next adventure</div>
  </div>
</template>

<style scoped>
#hero_video_board {
  position: relative;  
  display: flex;
  margin-top: 8vh;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
  height: 90vh;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: hidden;     
}


#hero_video_board > video {
  display: block;       
  width: 100%;
  height: 100%;
  object-fit: cover;
}


#mask {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  /* 只需盖住自家 video，z-index 保持在小范围，
     否则会跑到全局层叠上下文里压住 fixed 导航栏（导航是 10） */
  z-index: 1;
}

.hero_video_board_text {
  position: absolute;
  z-index: 2;
}
.title {
  word-spacing: 0.4rem;
  display: inline-block;
  width: 100%;
  text-align: center;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 6rem;
  color: rgb(255, 255, 255);
}
.text {
  display: inline-block;
  width: 100%;
  text-align: center;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: rgb(221, 220, 220);
}
</style>
