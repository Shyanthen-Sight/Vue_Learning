<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Car } from './types';

const props = defineProps<{
  visible: boolean;
  car?: Car;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [carId: string];
}>();

const step = ref<1 | 2>(1);
const code = ref('');
const error = ref('');

watch(() => props.visible, (visible) => {
  if (visible) {
    step.value = 1;
    code.value = '';
    error.value = '';
  }
});

const close = () => emit('close');

const verifyCode = () => {
  if (!props.car) {
    close();
    return;
  }
  if (code.value.trim().toUpperCase() !== props.car.id) {
    error.value = 'The vehicle code does not match the selected vehicle.';
    return;
  }
  error.value = '';
  step.value = 2;
};

const confirmDelete = () => {
  if (props.car) emit('confirm', props.car.id);
};
</script>

<template>
  <div v-if="visible && car" class="modal_backdrop" @click.self="close">
    <form v-if="step === 1" class="add_car_modal delete_car_modal" role="dialog" aria-modal="true"
      aria-labelledby="delete-modal-title" @submit.prevent="verifyCode">
      <div class="modal_header">
        <div><h2 id="delete-modal-title" class="modal_title">Verify Vehicle</h2><p class="modal_subtitle">Enter the vehicle code to continue.</p></div>
        <button class="modal_close" type="button" aria-label="Close delete vehicle dialog" @click="close">&times;</button>
      </div>
      <div class="delete_vehicle_summary"><strong>{{ car.name }}</strong><span>Selected vehicle: {{ car.id }}</span></div>
      <label class="modal_field delete_code_field"><span>Vehicle code</span><input v-model="code" type="text" placeholder="e.g. CAR-001" autocomplete="off" required autofocus @input="error = ''" /></label>
      <p v-if="error" class="delete_code_error" role="alert">{{ error }}</p>
      <div class="modal_actions"><button class="modal_cancel" type="button" @click="close">Cancel</button><button class="modal_submit" type="submit">Confirm code</button></div>
    </form>
    <div v-else class="add_car_modal delete_car_modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-warning-title">
      <div class="modal_header">
        <div><h2 id="delete-warning-title" class="modal_title">Delete Vehicle?</h2><p class="modal_subtitle">Final confirmation required.</p></div>
        <button class="modal_close" type="button" aria-label="Close delete warning" @click="close">&times;</button>
      </div>
      <p class="delete_message">This will permanently remove <strong>{{ car.name }}</strong> <span>({{ car.id }})</span> from the vehicle list.</p>
      <div class="modal_actions"><button class="modal_cancel" type="button" @click="close">Cancel</button><button class="modal_submit delete_submit" type="button" @click="confirmDelete">Delete vehicle</button></div>
    </div>
  </div>
</template>

<style scoped>
.modal_backdrop { position: fixed; z-index: 10; inset: 0; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(23, 35, 52, 0.48); }.add_car_modal { width: min(30rem, 100%); padding: 1.5rem; border: 1px solid #e0d4c2; border-radius: 16px; background: #fff; box-shadow: 0 18px 50px rgba(23, 35, 52, 0.22); }.modal_header, .modal_actions { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }.modal_title { margin: 0; color: var(--ink); font-size: 1.6rem; }.modal_subtitle { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.85rem; }.modal_close { width: 2rem; height: 2rem; border: 0; border-radius: 50%; background: var(--navy-soft); color: var(--muted); cursor: pointer; font-size: 1.4rem; }.delete_vehicle_summary { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 1.25rem; padding: 0.8rem 0.9rem; border: 1px solid var(--line); border-radius: 8px; background: var(--navy-soft); color: var(--ink); }.delete_vehicle_summary span, .delete_message span { color: var(--muted); font-size: 0.8rem; }.modal_field { display: flex; flex-direction: column; gap: 0.35rem; }.delete_code_field { margin-top: 1rem; }.modal_field span { color: var(--muted); font-size: 0.8rem; font-weight: 700; }.modal_field input { box-sizing: border-box; width: 100%; height: 2.5rem; padding: 0 0.7rem; border: 1px solid var(--line); border-radius: 8px; }.delete_code_error { margin: 0.5rem 0 0; color: #9b5d55; font-size: 0.8rem; }.delete_message { margin: 1.35rem 0 0; color: var(--muted); line-height: 1.6; }.delete_message strong { color: var(--ink); }.modal_actions { align-items: center; justify-content: flex-end; margin-top: 1.25rem; }.modal_cancel, .modal_submit { min-width: 6rem; padding: 0.6rem 0.9rem; border-radius: 8px; cursor: pointer; font-weight: 700; }.modal_cancel { border: 1px solid var(--line); background: #fff; color: var(--muted); }.modal_submit { border: 1px solid var(--accent-dark); background: var(--accent-dark); color: #fff; }.delete_submit { border-color: #9b5d55; background: #9b5d55; }
</style>
