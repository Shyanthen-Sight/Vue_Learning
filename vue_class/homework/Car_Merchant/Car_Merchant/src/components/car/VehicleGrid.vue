<script setup lang="ts">
import type { Car } from './types';

defineProps<{
  cars: Car[];
  totalCars: number;
  selectedCarId: string | null;
}>();

const emit = defineEmits<{
  select: [carId: string];
}>();
</script>

<template>
  <section id="showcase_bar" class="bar">
    <div class="showcase_header">
      <div>
        <h2 class="showcase_title">Available Cars</h2>
        <p class="showcase_subtitle">{{ cars.length }} of {{ totalCars }} cars</p>
      </div>
    </div>

    <div v-if="cars.length > 0" class="car_grid">
      <article v-for="car in cars" :key="car.id" class="car_card"
        :class="{ selected: selectedCarId === car.id }" :aria-selected="selectedCarId === car.id"
        tabindex="0" @click="emit('select', car.id)" @keydown.enter="emit('select', car.id)">
        <div class="car_image_container">
          <img v-if="car.image" class="car_image" :src="car.image" :alt="car.name" />
          <div v-else class="no_car_image">No vehicle image</div>
        </div>
        <div class="car_card_content">
          <div class="car_id_row">
            <span class="car_id">{{ car.id }}</span>
            <div class="car_meta">
              <span class="car_mileage">{{ car.mileage.toLocaleString() }} km</span>
              <span class="car_stock">Stock {{ car.stock }}</span>
            </div>
          </div>
          <div class="car_title_row">
            <h3 class="car_name">{{ car.name }}</h3>
            <span class="car_type">{{ car.type }}</span>
          </div>
          <div class="car_card_footer">
            <span class="car_price">${{ car.dailyPrice }}<small>/day</small></span>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="empty_cars">
      <div class="empty_icon_slot" aria-label="Reserved icon position">Icon</div>
      <h3>No cars match your filters</h3>
      <p>Try widening your budget range or selecting fewer car types.</p>
    </div>
  </section>
</template>

<style scoped>
.bar { background: var(--surface); border: 2px solid rgba(23, 35, 52, 0.08); border-radius: 15px; box-shadow: 0 8px 24px rgba(23, 35, 52, 0.08); }
#showcase_bar { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem; margin-top: 0.8rem; overflow: auto; }
.showcase_header { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: 1rem; }
.showcase_title { margin: 0; color: var(--ink); font-size: 1.6rem; }
.showcase_subtitle { margin: 0.25rem 0 0; color: var(--soft-muted); font-size: 0.9rem; }
.car_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: 1rem; }
.car_card { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); box-shadow: 0 5px 16px rgba(23, 35, 52, 0.08); cursor: pointer; transition: box-shadow 0.2s ease; }
.car_card:hover { box-shadow: 0 10px 24px rgba(23, 35, 52, 0.14); }
.car_card.selected { border-color: var(--accent); background: #fffaf3; box-shadow: 0 0 0 3px rgba(181, 139, 82, 0.35), 0 8px 18px rgba(143, 105, 58, 0.18); outline: 2px solid var(--accent); outline-offset: 2px; }
.car_card:focus-visible { outline: 2px solid var(--accent-dark); outline-offset: 2px; }
.car_image_container { height: 10rem; background: var(--navy-soft); }
.car_image { width: 100%; height: 100%; object-fit: contain; }
.no_car_image { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--soft-muted); }
.car_card_content { display: flex; min-height: 7rem; padding: 0.85rem 0.95rem 0.95rem; flex-direction: column; }
.car_id_row, .car_title_row, .car_card_footer { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.car_id_row { min-height: 1rem; }
.car_id { color: var(--soft-muted); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; }
.car_meta { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.65rem; }
.car_mileage, .car_stock { color: var(--muted); font-size: 0.8rem; }
.car_stock { color: #7d8b7b; font-weight: 600; }
.car_title_row { min-height: 1.6rem; margin-top: 0.35rem; }
.car_name { min-width: 0; overflow: hidden; margin: 0; color: var(--ink); font-size: 1.05rem; text-overflow: ellipsis; white-space: nowrap; }
.car_type { flex-shrink: 0; padding: 0.2rem 0.45rem; border-radius: 999px; background: #edf1f5; color: #65758b; font-size: 0.7rem; font-weight: 600; }
.car_card_footer { margin-top: auto; padding-top: 0.75rem; }
.car_price { color: #9a6a2f; font-size: 1.5rem; font-weight: 700; line-height: 1; }
.car_price small { color: var(--muted); font-size: 0.78rem; font-weight: 400; }
.empty_cars { display: flex; flex: 1; min-height: 12rem; flex-direction: column; align-items: center; justify-content: center; color: var(--muted); text-align: center; }
.empty_icon_slot { display: flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; margin-bottom: 0.75rem; border: 1px dashed #b8bfd6; border-radius: 8px; color: #8c96b3; font-size: 0.75rem; }
.empty_cars h3, .empty_cars p { margin: 0.25rem 0; }
.empty_cars h3 { color: var(--ink); }
</style>
