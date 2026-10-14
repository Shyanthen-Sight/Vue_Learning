<script setup lang="ts">
import { ref } from 'vue';
import type { CarType, NewCarInput } from './types';

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [vehicle: NewCarInput];
}>();

const name = ref('');
const type = ref<CarType>('MPV');
const dailyPrice = ref(100);
const mileage = ref(0);
const stock = ref(1);
const image = ref('');
const imageName = ref('');
const isDragging = ref(false);

const reset = () => {
  name.value = '';
  type.value = 'MPV';
  dailyPrice.value = 100;
  mileage.value = 0;
  stock.value = 1;
  image.value = '';
  imageName.value = '';
};

const close = () => {
  isDragging.value = false;
  reset();
  emit('close');
};

const setImage = (file: File | undefined) => {
  if (!file || !file.type.startsWith('image/')) return;
  image.value = URL.createObjectURL(file);
  imageName.value = file.name;
};

const submit = () => {
  const trimmedName = name.value.trim();
  if (!trimmedName || dailyPrice.value < 0 || mileage.value < 0 || stock.value < 0) return;
  emit('submit', { name: trimmedName, type: type.value, dailyPrice: dailyPrice.value, mileage: mileage.value, stock: stock.value, image: image.value });
  close();
};
</script>

<template>
  <div v-if="visible" class="modal_backdrop" @click.self="close">
    <form class="add_car_modal" @submit.prevent="submit">
      <div class="modal_header">
        <div><h2 class="modal_title">Add Vehicle</h2><p class="modal_subtitle">Enter vehicle details and add an optional image.</p></div>
        <button class="modal_close" type="button" aria-label="Close add vehicle dialog" @click="close">&times;</button>
      </div>
      <div class="modal_form_grid">
        <label class="modal_field modal_field_wide"><span>Vehicle name</span><input v-model="name" required type="text" placeholder="e.g. Audi A8" /></label>
        <label class="modal_field"><span>Type</span><select v-model="type"><option v-for="option in ['MPV', 'SUV', 'Sedan', 'Pickup', 'Sports']" :key="option" :value="option">{{ option }}</option></select></label>
        <label class="modal_field"><span>Daily price (USD)</span><input v-model.number="dailyPrice" min="0" required type="number" /></label>
        <label class="modal_field"><span>Mileage (km)</span><input v-model.number="mileage" min="0" required type="number" /></label>
        <label class="modal_field"><span>Stock</span><input v-model.number="stock" min="0" required type="number" /></label>
      </div>
      <label class="image_drop_zone" :class="{ dragging: isDragging }" @dragenter.prevent="isDragging = true" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="isDragging = false; setImage($event.dataTransfer?.files[0])">
        <input class="image_file_input" type="file" accept="image/*" @change="setImage(($event.target as HTMLInputElement).files?.[0])" />
        <img v-if="image" class="image_preview" :src="image" alt="New vehicle preview" />
        <template v-else><span class="image_placeholder_icon">+</span><strong>Drop vehicle image here</strong><span>or click to choose an image</span><small>No vehicle image will be used if left empty.</small></template>
        <span v-if="imageName" class="image_file_name">{{ imageName }}</span>
      </label>
      <div class="modal_actions"><button class="modal_cancel" type="button" @click="close">Cancel</button><button class="modal_submit" type="submit">Add vehicle</button></div>
    </form>
  </div>
</template>

<style scoped>
.modal_backdrop { position: fixed; z-index: 10; inset: 0; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(23, 35, 52, 0.48); }
.add_car_modal { width: min(34rem, 100%); max-height: 90vh; overflow: auto; padding: 1.5rem; border: 1px solid #e0d4c2; border-radius: 16px; background: #fff; box-shadow: 0 18px 50px rgba(23, 35, 52, 0.22); }
.modal_header, .modal_actions { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.modal_title { margin: 0; color: var(--ink); font-size: 1.6rem; }.modal_subtitle { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.85rem; }
.modal_close { width: 2rem; height: 2rem; border: 0; border-radius: 50%; background: var(--navy-soft); color: var(--muted); cursor: pointer; font-size: 1.4rem; }
.modal_form_grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; margin-top: 1.25rem; }.modal_field { display: flex; flex-direction: column; gap: 0.35rem; }.modal_field_wide { grid-column: 1 / -1; }.modal_field span { color: var(--muted); font-size: 0.8rem; font-weight: 700; }.modal_field input, .modal_field select { box-sizing: border-box; width: 100%; height: 2.5rem; padding: 0 0.7rem; border: 1px solid var(--line); border-radius: 8px; color: var(--ink); }
.image_drop_zone { position: relative; display: flex; min-height: 8.5rem; flex-direction: column; align-items: center; justify-content: center; gap: 0.35rem; margin-top: 1.1rem; overflow: hidden; border: 1.5px dashed #c9b18e; border-radius: 12px; background: #fbf8f3; color: var(--muted); cursor: pointer; text-align: center; }.image_drop_zone.dragging, .image_drop_zone:hover { border-color: var(--accent); background: var(--accent-soft); }.image_file_input { position: absolute; width: 1px; height: 1px; opacity: 0; }.image_placeholder_icon { display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 50%; background: var(--accent); color: #fff; font-size: 1.4rem; }.image_drop_zone strong { color: var(--ink); font-size: 0.9rem; }.image_drop_zone span, .image_drop_zone small { font-size: 0.75rem; }.image_preview { width: 100%; height: 8.5rem; object-fit: contain; }.image_file_name { position: absolute; right: 0.6rem; bottom: 0.45rem; max-width: calc(100% - 1.2rem); overflow: hidden; color: var(--accent-dark); font-size: 0.7rem; text-overflow: ellipsis; white-space: nowrap; }
.modal_actions { align-items: center; justify-content: flex-end; margin-top: 1.25rem; }.modal_cancel, .modal_submit { min-width: 6rem; padding: 0.6rem 0.9rem; border-radius: 8px; cursor: pointer; font-weight: 700; }.modal_cancel { border: 1px solid var(--line); background: #fff; color: var(--muted); }.modal_submit { border: 1px solid var(--accent-dark); background: var(--accent-dark); color: #fff; }
</style>
