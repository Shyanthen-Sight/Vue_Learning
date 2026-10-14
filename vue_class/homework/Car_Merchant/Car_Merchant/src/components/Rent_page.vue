<script setup lang="ts">
import { computed, ref } from 'vue';
import AddVehicleModal from './car/AddVehicleModal.vue';
import DeleteVehicleModal from './car/DeleteVehicleModal.vue';
import SuccessToast from './car/SuccessToast.vue';
import VehicleGrid from './car/VehicleGrid.vue';
import VehicleToolbar from './car/VehicleToolbar.vue';
import type { Car, CarType, NewCarInput } from './car/types';

const minBudget = ref(0);
const maxBudget = ref(0);
const selectedTypes = ref<CarType[]>([]);
const isFilterOpen = ref(true);
const selectedCarId = ref<string | null>(null);
const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deleteTargetCarId = ref<string | null>(null);
const successMessage = ref('');
let successMessageTimer: number | undefined;

const carImageModules = import.meta.glob('../assets/image/CarClass/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const carData: Omit<Car, 'id' | 'stock' | 'image'>[] = [
  { fileName: 'zeekr 009.png', name: 'Zeekr 009', type: 'MPV', dailyPrice: 128, mileage: 12400 },
  { fileName: '传祺M8.png', name: 'Trumpchi M8', type: 'MPV', dailyPrice: 86, mileage: 18600 },
  { fileName: '别克GL8.png', name: 'Buick GL8', type: 'MPV', dailyPrice: 78, mileage: 22400 },
  { fileName: '小鹏x9.png', name: 'XPeng X9', type: 'MPV', dailyPrice: 102, mileage: 9800 },
  { fileName: '岚图梦想家.png', name: 'Voyah Dreamer', type: 'MPV', dailyPrice: 112, mileage: 13700 },
  { fileName: '零跑D99.png', name: 'Leapmotor D99', type: 'MPV', dailyPrice: 74, mileage: 15900 },
  { fileName: 'BYD tang.png', name: 'BYD Tang', type: 'SUV', dailyPrice: 68, mileage: 27100 },
  { fileName: 'Benz.png', name: 'Mercedes-Benz SUV', type: 'SUV', dailyPrice: 148, mileage: 21300 },
  { fileName: 'Leapmotor D19.png', name: 'Leapmotor D19', type: 'SUV', dailyPrice: 76, mileage: 11200 },
  { fileName: 'Lincoln navigator.png', name: 'Lincoln Navigator', type: 'SUV', dailyPrice: 156, mileage: 30800 },
  { fileName: 'NIO es8.png', name: 'NIO ES8', type: 'SUV', dailyPrice: 106, mileage: 14500 },
  { fileName: 'Volkswagen.png', name: 'Volkswagen SUV', type: 'SUV', dailyPrice: 72, mileage: 25600 },
  { fileName: 'XiaoMi N70.png', name: 'Xiaomi N70', type: 'SUV', dailyPrice: 84, mileage: 7600 },
  { fileName: 'XiaoMi N90.png', name: 'Xiaomi N90', type: 'SUV', dailyPrice: 96, mileage: 8400 },
  { fileName: 'Xpeng GX.png', name: 'Xpeng GX', type: 'SUV', dailyPrice: 88, mileage: 10300 },
  { fileName: 'Zeeker.png', name: 'Zeeker SUV', type: 'SUV', dailyPrice: 94, mileage: 12900 },
  { fileName: 'Audi A6L.png', name: 'Audi A6L', type: 'Sedan', dailyPrice: 98, mileage: 28600 },
  { fileName: 'Audi E5 sportback.png', name: 'Audi E5 Sportback', type: 'Sedan', dailyPrice: 110, mileage: 9200 },
  { fileName: 'BMW 7.png', name: 'BMW 7 Series', type: 'Sedan', dailyPrice: 136, mileage: 19800 },
  { fileName: 'FengYun A9L.png', name: 'FengYun A9L', type: 'Sedan', dailyPrice: 82, mileage: 11700 },
  { fileName: 'Lincoln Z.png', name: 'Lincoln Z', type: 'Sedan', dailyPrice: 92, mileage: 17400 },
  { fileName: 'panamera.png', name: 'Porsche Panamera', type: 'Sedan', dailyPrice: 188, mileage: 22100 },
  { fileName: 'volvo s90.png', name: 'Volvo S90', type: 'Sedan', dailyPrice: 90, mileage: 24300 },
  { fileName: 'XiaoMi Su7.png', name: 'Xiaomi SU7', type: 'Sedan', dailyPrice: 86, mileage: 6800 },
  { fileName: 'Xpeng mono.png', name: 'Xpeng Mona', type: 'Sedan', dailyPrice: 64, mileage: 13500 },
  { fileName: 'Xpeng p7.png', name: 'Xpeng P7', type: 'Sedan', dailyPrice: 78, mileage: 16200 },
  { fileName: 'AMG GT.png', name: 'Mercedes-AMG GT', type: 'Sports', dailyPrice: 246, mileage: 8900 },
  { fileName: 'Bentley PHEV.png', name: 'Bentley PHEV', type: 'Sports', dailyPrice: 328, mileage: 12700 },
  { fileName: 'Benz CLE.png', name: 'Mercedes-Benz CLE', type: 'Sports', dailyPrice: 198, mileage: 10600 },
  { fileName: 'BMW M2.png', name: 'BMW M2', type: 'Sports', dailyPrice: 176, mileage: 14300 },
  { fileName: 'Ferrari 296.png', name: 'Ferrari 296', type: 'Sports', dailyPrice: 520, mileage: 4100 },
  { fileName: 'Ford Mustang.png', name: 'Ford Mustang', type: 'Sports', dailyPrice: 156, mileage: 18900 },
  { fileName: 'Lexus LC.png', name: 'Lexus LC', type: 'Sports', dailyPrice: 224, mileage: 9700 },
  { fileName: 'Lotus Emira.png', name: 'Lotus Emira', type: 'Sports', dailyPrice: 212, mileage: 6200 },
  { fileName: 'porsche 718.png', name: 'Porsche 718', type: 'Sports', dailyPrice: 268, mileage: 7800 },
  { fileName: 'Subaru BRZ.png', name: 'Subaru BRZ', type: 'Sports', dailyPrice: 132, mileage: 15400 },
  { fileName: 'Cybertruck.png', name: 'Tesla Cybertruck', type: 'Pickup', dailyPrice: 164, mileage: 7300 },
  { fileName: 'Ford ranger.png', name: 'Ford Ranger', type: 'Pickup', dailyPrice: 82, mileage: 21800 },
  { fileName: '大道.png', name: 'Dadao', type: 'Pickup', dailyPrice: 70, mileage: 26400 },
  { fileName: '山海炮.png', name: 'Shanhai Po', type: 'Pickup', dailyPrice: 88, mileage: 19600 },
  { fileName: '炮phev.png', name: 'Po PHEV', type: 'Pickup', dailyPrice: 76, mileage: 15300 },
  { fileName: '纵横F700.png', name: 'ZX F700', type: 'Pickup', dailyPrice: 92, mileage: 18100 },
  { fileName: '长安猎手k50.png', name: 'Changan Hunter K50', type: 'Pickup', dailyPrice: 80, mileage: 12700 },
];

const initialCars: Car[] = carData.map((car, index) => ({
  ...car,
  id: `CAR-${String(index + 1).padStart(3, '0')}`,
  stock: ((index * 7 + 3) % 12) + 1,
  image: carImageModules[`../assets/image/CarClass/${car.type === 'Sports' ? 'SportsCar' : car.type}/${car.fileName}`] ?? '',
}));

const cars = ref<Car[]>(initialCars);

const selectedCar = computed(() =>
  cars.value.find((car) => car.id === selectedCarId.value),
);

const deleteTargetCar = computed(() =>
  cars.value.find((car) => car.id === deleteTargetCarId.value),
);

const activeFilterCount = computed(() => {
  let count = selectedTypes.value.length;

  if (minBudget.value > 0) count += 1;
  if (maxBudget.value > 0) count += 1;

  return count;
});

const filteredCars = computed(() =>
  cars.value.filter((car) => {
    const matchesType =
      selectedTypes.value.length === 0 || selectedTypes.value.includes(car.type);
    const matchesMinBudget = minBudget.value <= 0 || car.dailyPrice >= minBudget.value;
    const matchesMaxBudget = maxBudget.value <= 0 || car.dailyPrice <= maxBudget.value;

    return matchesType && matchesMinBudget && matchesMaxBudget;
  }),
);

const showSuccessMessage = (message: string) => {
  successMessage.value = message;
  if (successMessageTimer !== undefined) {
    window.clearTimeout(successMessageTimer);
  }
  successMessageTimer = window.setTimeout(() => {
    successMessage.value = '';
    successMessageTimer = undefined;
  }, 2500);
};

const addCar = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
};

const submitNewCar = (input: NewCarInput) => {
  const nextNumber =
    Math.max(
      0,
      ...cars.value.map((car) => Number.parseInt(car.id.replace('CAR-', ''), 10) || 0),
    ) + 1;
  const newCar: Car = {
    id: `CAR-${String(nextNumber).padStart(3, '0')}`,
    fileName: 'new-car.png',
    ...input,
  };

  cars.value.push(newCar);
  selectedCarId.value = newCar.id;
  closeAddModal();
  showSuccessMessage(`Vehicle added successfully: ${newCar.name}`);
};

const openDeleteModal = () => {
  if (!selectedCar.value) return;
  deleteTargetCarId.value = selectedCar.value.id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deleteTargetCarId.value = null;
};

const deleteSelectedCar = (targetCarId: string) => {
  const selectedIndex = cars.value.findIndex((car) => car.id === targetCarId);
  if (selectedIndex === -1) return;

  const targetCar = cars.value[selectedIndex];
  if (!targetCar) return;

  const targetCarName = targetCar.name;
  cars.value.splice(selectedIndex, 1);
  if (selectedCarId.value === targetCarId) {
    selectedCarId.value = null;
  }
  closeDeleteModal();
  showSuccessMessage(`Vehicle deleted successfully: ${targetCarName}`);
};

const toggleType = (type: CarType) => {
  if (selectedTypes.value.includes(type)) {
    selectedTypes.value = selectedTypes.value.filter(
      (selectedType) => selectedType !== type,
    );
    return;
  }

  selectedTypes.value.push(type);
};

const resetFilters = () => {
  minBudget.value = 0;
  maxBudget.value = 0;
  selectedTypes.value = [];
};
</script>

<template>
  <div id="rent_page">
    <SuccessToast :message="successMessage" />

    <div id="manu_bar" class="bar">
      <button id="add" class="manu_area" type="button" title="Add a car" @click="addCar">
        <svg t="1791884166134" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="3067" width="200" height="200">
          <path
            d="M512 938.666667C276.362667 938.666667 85.333333 747.637333 85.333333 512S276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667z m0-64c200.298667 0 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667z m32-394.666667h128a32 32 0 0 1 0 64H544v128a32 32 0 0 1-64 0V544H352a32 32 0 0 1 0-64h128V352a32 32 0 0 1 64 0v128z"
            fill="#2c2c2c" p-id="3068"></path>
        </svg>
      </button>
      <button id="del" class="manu_area" type="button" title="Delete selected car" :disabled="selectedCarId === null" @click="openDeleteModal">
        <svg t="1791884188418" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="3280" width="200" height="200">
          <path
            d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z"
            fill="#2c2c2c" p-id="3281"></path>
        </svg>
      </button>
    </div>

    <AddVehicleModal :visible="isAddModalOpen" @close="closeAddModal" @submit="submitNewCar" />
    <DeleteVehicleModal :visible="isDeleteModalOpen" :car="deleteTargetCar" @close="closeDeleteModal" @confirm="deleteSelectedCar" />

    <div id="content">
      <VehicleToolbar v-model:min-budget="minBudget" v-model:max-budget="maxBudget"
        :selected-types="selectedTypes" :is-filter-open="isFilterOpen"
        :active-filter-count="activeFilterCount"
        @update:is-filter-open="isFilterOpen = $event"
        @toggle-type="toggleType" @reset-filters="resetFilters" />
      <VehicleGrid :cars="filteredCars" :total-cars="cars.length" :selected-car-id="selectedCarId"
        @select="selectedCarId = $event" />
    </div>
  </div>
</template>

<style scoped>
#rent_page {
  display: flex;
  height: 100%;
}

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
  padding: 0;
  border: 0;
  background: transparent;
  transition: background-color 0.3s ease;
}

.manu_area:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-radius: 15px;
}

.manu_area:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.manu_area:disabled:hover {
  background-color: transparent;
}

.manu_area svg {
  width: 40%;
  height: 40%;
}

.modal_backdrop {
  position: fixed;
  z-index: 10;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(23, 35, 52, 0.48);
}

.add_car_modal {
  width: min(34rem, 100%);
  max-height: 90vh;
  overflow: auto;
  padding: 1.5rem;
  border: 1px solid #e0d4c2;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 18px 50px rgba(23, 35, 52, 0.22);
}

.delete_car_modal {
  width: min(30rem, 100%);
}

.modal_header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.modal_title {
  margin: 0;
  color: var(--ink);
  font-size: 1.6rem;
}

.modal_subtitle {
  margin: 0.35rem 0 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.modal_close {
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 50%;
  background-color: var(--navy-soft);
  color: var(--muted);
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
}

.modal_close:hover {
  background-color: var(--accent-soft);
  color: var(--accent-dark);
}

.modal_form_grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.modal_field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.35rem;
}

.modal_field_wide {
  grid-column: 1 / -1;
}

.modal_field span {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.modal_field input,
.modal_field select {
  box-sizing: border-box;
  width: 100%;
  height: 2.5rem;
  padding: 0 0.7rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background-color: #fff;
  color: var(--ink);
  outline: none;
}

.modal_field input:focus,
.modal_field select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(181, 139, 82, 0.15);
}

.image_drop_zone {
  position: relative;
  display: flex;
  min-height: 8.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 1.1rem;
  overflow: hidden;
  border: 1.5px dashed #c9b18e;
  border-radius: 12px;
  background-color: #fbf8f3;
  color: var(--muted);
  cursor: pointer;
  text-align: center;
}

.image_drop_zone.dragging,
.image_drop_zone:hover {
  border-color: var(--accent);
  background-color: var(--accent-soft);
}

.image_file_input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.image_placeholder_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--accent);
  color: #fff;
  font-size: 1.4rem;
}

.image_drop_zone strong {
  color: var(--ink);
  font-size: 0.9rem;
}

.image_drop_zone span,
.image_drop_zone small {
  font-size: 0.75rem;
}

.image_drop_zone small {
  color: var(--soft-muted);
}

.image_preview {
  width: 100%;
  height: 8.5rem;
  object-fit: contain;
}

.image_file_name {
  position: absolute;
  right: 0.6rem;
  bottom: 0.45rem;
  max-width: calc(100% - 1.2rem);
  overflow: hidden;
  color: var(--accent-dark);
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal_actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 1.25rem;
}

.delete_message {
  margin: 1.35rem 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.delete_message strong {
  color: var(--ink);
}

.delete_message span {
  color: var(--soft-muted);
  font-size: 0.85rem;
}

.delete_vehicle_summary {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 1.25rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background-color: var(--navy-soft);
  color: var(--ink);
}

.delete_vehicle_summary span {
  color: var(--muted);
  font-size: 0.8rem;
}

.delete_code_field {
  margin-top: 1rem;
}

.delete_code_error {
  margin: 0.5rem 0 0;
  color: #9b5d55;
  font-size: 0.8rem;
}

.modal_cancel,
.modal_submit {
  min-width: 6rem;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.modal_cancel {
  border: 1px solid var(--line);
  background-color: #fff;
  color: var(--muted);
}

.modal_submit {
  border: 1px solid var(--accent-dark);
  background-color: var(--accent-dark);
  color: #fff;
}

.modal_cancel:hover {
  border-color: #c9b18e;
  background-color: var(--accent-soft);
}

.modal_submit:hover {
  background-color: #76552f;
}

.delete_submit {
  border-color: #9b5d55;
  background-color: #9b5d55;
}

.delete_submit:hover {
  background-color: #7d4540;
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
  min-height: 14vh;
  height: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  padding: 0.55rem 0.85rem;
  gap: 0;
  flex-shrink: 0;
}

.tool_item {
  box-sizing: border-box;
  width: auto;
  min-width: 0;
  padding: 0 1rem;
}

.tool_item + .tool_item {
  border-left: 1px solid var(--line);
}

#showcase_bar {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  margin-top: 0.8rem;
  overflow: auto;
}

#showcase_bar {
  scrollbar-color: #c5a678 #edf1f5;
  scrollbar-width: thin;
}

#showcase_bar::-webkit-scrollbar {
  width: 0.55rem;
  height: 0.55rem;
}

#showcase_bar::-webkit-scrollbar-track {
  border-radius: 999px;
  background-color: #edf1f5;
}

#showcase_bar::-webkit-scrollbar-thumb {
  border: 2px solid #edf1f5;
  border-radius: 999px;
  background-color: #c5a678;
}

#showcase_bar::-webkit-scrollbar-thumb:hover {
  background-color: #a9824c;
}

.showcase_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.showcase_title {
  margin: 0;
  color: #333;
  font-size: 1.6rem;
}

.showcase_subtitle {
  margin: 0.25rem 0 0;
  color: #8a8f9c;
  font-size: 0.9rem;
}

.car_icon_slot,
.empty_icon_slot {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #b8bfd6;
  border-radius: 8px;
  color: #8c96b3;
  font-size: 0.75rem;
}

.showcase_icon_slot {
  width: 3rem;
  height: 3rem;
}

.car_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;
}

.car_card {
  overflow: hidden;
  border: 1px solid #e3e5eb;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 3px 10px rgba(35, 43, 70, 0.08);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.car_card:hover {
  box-shadow: 0 8px 18px rgba(35, 43, 70, 0.14);
}

.car_card.selected {
  border-color: #b58b52;
  background-color: #fffaf3;
  box-shadow: 0 0 0 3px rgba(181, 139, 82, 0.35), 0 8px 18px rgba(143, 105, 58, 0.18);
  outline: 2px solid #b58b52;
  outline-offset: 2px;
}

.car_card:focus-visible {
  outline: 2px solid #8f693a;
  outline-offset: 2px;
}

.car_image_container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 9rem;
  padding: 0.75rem;
  background-color: #f5f6fa;
}

.car_image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no_car_image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px dashed #c9b18e;
  border-radius: 8px;
  color: var(--muted);
  font-size: 0.85rem;
}

.car_icon_slot {
  width: 2rem;
  height: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
}

.car_card_icon {
  flex: 0 0 2.2rem;
  width: 2.2rem;
  height: 2.2rem;
  padding: 0.42rem;
  border: 1px solid #d8dcef;
  border-radius: 8px;
  background-color: #f5f7ff;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.car_card_icon:hover {
  border-color: #4c64c8;
  background-color: #e9edff;
  transform: scale(1.08);
}

.car_card_content {
  display: flex;
  flex-direction: column;
  min-height: 7rem;
  padding: 0.85rem 0.95rem 0.95rem;
}

.car_card_heading {
  min-width: 0;
}

.car_name_group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.35rem;
}

.car_id_row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 1rem;
  gap: 0.5rem;
}

.car_id {
  flex-shrink: 0;
  color: #8c96b3;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.car_meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
}

.car_title_row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  min-height: 1.6rem;
  gap: 0.75rem;
}

.car_card_footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.75rem;
}

.car_details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 2rem;
  gap: 0;
}

.car_stock {
  color: #7d8b7b;
  font-size: 0.8rem;
  font-weight: 600;
}

.car_name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  margin: 0;
  color: #333;
  font-size: 1.05rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.car_type {
  flex-shrink: 0;
  min-width: 3.2rem;
  box-sizing: border-box;
  text-align: center;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  background-color: #eef1ff;
  color: #4c64c8;
  font-size: 0.7rem;
  font-weight: 700;
}

.car_details {
  min-width: 0;
}

.car_price {
  line-height: 1;
  color: #4c64c8;
  font-size: 1.45rem;
  font-weight: 700;
}

.car_price small {
  color: #7b8191;
  font-size: 0.78rem;
  font-weight: 400;
}

.car_mileage {
  color: #7b8191;
  font-size: 0.8rem;
}

.empty_cars {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  color: #7b8191;
  text-align: center;
}

.empty_icon_slot {
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.75rem;
}

.empty_cars h3,
.empty_cars p {
  margin: 0.25rem 0;
}

.empty_cars h3 {
  color: #4b5563;
}

.tool_name {
  margin-left: 0.5rem;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
  width: 100%;
  height: auto;
}

.filter_button {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: fit-content;
  margin: 0;
  padding: 0.2rem 0;
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
}

.filter_button .title {
  font-size: 2rem;
  font-weight: bold;
}

.filter_button:hover .title {
  color: #4c64c8;
}

.filter_count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background-color: #4c64c8;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}

.filter_panel {
  margin: 0.65rem 0 0;
  padding: 0.6rem;
  border: 1px solid #e1e4ef;
  border-radius: 10px;
  background-color: #f8f9ff;
}

.filter_summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 600;
}

.reset_button {
  padding: 0.3rem 0.6rem;
  border: 1px solid #c7cde5;
  border-radius: 6px;
  background-color: #fff;
  color: #4c64c8;
  cursor: pointer;
  font-size: 0.8rem;
}

.reset_button:hover {
  border-color: #4c64c8;
  background-color: #eef1ff;
}

.filter_hint {
  margin: 0.65rem 0 0;
  color: #7b8191;
  font-size: 0.8rem;
  line-height: 1.4;
}

.budget_inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin: 0.65rem 0 0;
}

.budget_field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.budget_label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.budget_input {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.budget_input::placeholder {
  color: #aaa;
}

.budget_input:focus {
  border-color: #6c8cff;
  box-shadow: 0 0 0 3px rgba(108, 140, 255, 0.18);
}

.budget_input::-webkit-inner-spin-button,
.budget_input::-webkit-outer-spin-button {
  margin: 0;
}

.budget_separator {
  color: #888;
  font-size: 1.1rem;
}

.type_buttons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0.65rem 0 0;
}

.type_class {
  width: 100%;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: #4b5563;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease,
    box-shadow 0.2s ease, transform 0.2s ease;
}

.type_class:hover {
  color: #4c64c8;
  border-color: #8ea2ff;
  background-color: #f5f7ff;
  box-shadow: 0 3px 8px rgba(76, 100, 200, 0.16);
  transform: translateY(-1px);
}

.type_class.selected {
  border-color: #4c64c8;
  background-color: #4c64c8;
  color: #fff;
  box-shadow: 0 3px 8px rgba(76, 100, 200, 0.2);
}

.type_class:active {
  transform: translateY(0);
}

#rent_page {
  --ink: #172334;
  --muted: #728096;
  --soft-muted: #9aa6b8;
  --surface: #f7f8fa;
  --panel: #ffffff;
  --line: #dfe4eb;
  --accent: #b58b52;
  --accent-dark: #8f693a;
  --accent-soft: #f4ecdf;
  --navy-soft: #edf1f5;
}

#rent_page .bar {
  background-color: var(--surface);
  border-color: rgba(23, 35, 52, 0.08);
  box-shadow: 0 8px 24px rgba(23, 35, 52, 0.08);
}

#rent_page .manu_area:hover {
  background-color: rgba(181, 139, 82, 0.12);
}

#rent_page .manu_area:disabled:hover {
  background-color: transparent;
}

#rent_page .manu_area svg path {
  fill: var(--ink);
}

#rent_page .tool_name,
#rent_page .filter_button,
#rent_page .showcase_title,
#rent_page .car_name {
  color: var(--ink);
}

#rent_page .filter_button:hover .title {
  color: var(--accent-dark);
}

#rent_page .filter_count {
  background-color: var(--accent);
}

#rent_page .filter_panel {
  border-color: #e8dcc9;
  background-color: #fbf8f3;
}

#rent_page .filter_summary,
#rent_page .car_mileage {
  color: var(--muted);
}

#rent_page .filter_hint,
#rent_page .showcase_subtitle {
  color: var(--soft-muted);
}

#rent_page .reset_button {
  border-color: #d8c5a8;
  color: var(--accent-dark);
}

#rent_page .reset_button:hover {
  border-color: var(--accent);
  background-color: var(--accent-soft);
}

#rent_page .budget_label {
  color: var(--muted);
}

#rent_page .budget_input {
  border-color: var(--line);
  background-color: var(--panel);
  color: var(--ink);
}

#rent_page .budget_input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(181, 139, 82, 0.18);
}

#rent_page .budget_separator {
  color: var(--soft-muted);
}

#rent_page .type_class {
  border-color: var(--line);
  background-color: var(--panel);
  color: var(--ink);
}

#rent_page .type_class:hover {
  border-color: #d8c5a8;
  background-color: var(--accent-soft);
  color: var(--accent-dark);
  box-shadow: 0 4px 10px rgba(181, 139, 82, 0.14);
}

#rent_page .type_class.selected {
  border-color: var(--accent-dark);
  background-color: var(--accent-dark);
  color: #fff;
  box-shadow: 0 4px 10px rgba(143, 105, 58, 0.2);
}

#rent_page .car_card {
  border-color: var(--line);
  background-color: var(--panel);
  box-shadow: 0 5px 16px rgba(23, 35, 52, 0.08);
}

#rent_page .car_card:hover {
  box-shadow: 0 10px 24px rgba(23, 35, 52, 0.14);
}

#rent_page .car_image_container {
  background-color: var(--navy-soft);
}

#rent_page .car_type {
  background-color: #edf1f5;
  color: #65758b;
  font-weight: 600;
}

#rent_page .car_price {
  color: #9a6a2f;
  font-size: 1.5rem;
  letter-spacing: 0.01em;
}

#rent_page .car_card_icon {
  border-color: #d9dee5;
  background-color: #f5f6f8;
}

#rent_page .car_card_icon path {
  fill: #8793a3;
}

#rent_page .car_card_icon:hover {
  border-color: #c5a678;
  background-color: var(--accent-soft);
}

#rent_page .car_card_icon:hover path {
  fill: #9a6a2f;
}

#rent_page .empty_cars h3 {
  color: var(--ink);
}

</style>
