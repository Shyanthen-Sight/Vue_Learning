<script setup lang="ts">

</script>

<template>
  <div id="rent_page">
    <div id="manu_bar" class="bar">
      <div id="add" class="manu_area">
        <svg t="1791884166134" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="3067" width="200" height="200">
          <path
            d="M512 938.666667C276.362667 938.666667 85.333333 747.637333 85.333333 512S276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667z m0-64c200.298667 0 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667z m32-394.666667h128a32 32 0 0 1 0 64H544v128a32 32 0 0 1-64 0V544H352a32 32 0 0 1 0-64h128V352a32 32 0 0 1 64 0v128z"
            fill="#2c2c2c" p-id="3068"></path>
        </svg>
      </div>
      <div id="del" class="manu_area">
        <svg t="1791884188418" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="3280" width="200" height="200">
          <path
            d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z"
            fill="#2c2c2c" p-id="3281"></path>
        </svg>
      </div>
    </div>

  
    <div id="content">
      <div id="tool_bar" class="bar">
        <div id="filter" class="tool_item">
          <div class="title tool_name">Filter</div>
        </div>
        <div id="budget_range" class="tool_item">
          <div class="title tool_name">Budget Range</div>
        </div>
        <div id="type" class="tool_item">
          <div class="title tool_name">Type</div>
        </div>
      </div>

      <div id="showcase_bar" class="bar"></div>
    </div>
  </div>
</template>

<style scoped>

#rent_page {
  display: flex;
  height: 100%;
}

.bar {
  background-color: rgb(248, 248, 248);
  border-radius: 15px;
  border: 2px solid rgba(238, 236, 236, 0.1);
  display: flex;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

#manu_bar {
  display: flex;
  flex-direction: column;
  margin-top: 8vh;
  height: 91vh;
  width: 5vw;
  margin-left: 0.8rem;
  
}

.manu_area {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.manu_area:hover {
  background-color: rgb(248, 246, 128);
  cursor: pointer;
  border-radius: 15px;
}

.manu_area svg {
  width: 40%;
  height: 40%;
}

#add {
  position: relative;
}

#add::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 1px;
  border-radius: 1px;
  background-color: rgba(0, 0, 0);
}

#content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-top: 8vh;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
  height: 91vh;
}

#tool_bar {
  height: 25vh;
  flex-shrink: 0;
}

.tool_item {
  width: 33.33%;
}

#showcase_bar {
  flex: 1;
  margin-top: 0.8rem;
}
.tool_name {
  font-size:2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  margin-left: 2rem;
  width: 100%;
  height:20%
}
</style>
