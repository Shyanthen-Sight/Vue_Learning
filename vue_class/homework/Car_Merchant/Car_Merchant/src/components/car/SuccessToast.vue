<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <Transition name="success-toast">
    <div v-if="message" class="success_message" role="status" aria-live="polite">
      <span class="success_icon" aria-hidden="true">✓</span>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.success_message {
  position: fixed;
  z-index: 20;
  top: 1.5rem;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 12rem;
  padding: 0.8rem 1.1rem;
  border: 1px solid #b8d9c0;
  border-radius: 10px;
  background-color: #f0faf2;
  color: #246b36;
  box-shadow: 0 8px 24px rgba(36, 107, 54, 0.18);
  font-weight: 700;
  transform: translateX(-50%);
}

.success-toast-enter-active,
.success-toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.success-toast-enter-from,
.success-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -1rem) scale(0.92);
}

.success_icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  background-color: #2f914b;
  color: #fff;
  font-size: 0.85rem;
}
</style>
