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

.bar {
  border: 2px solid rgba(23, 35, 52, 0.08);
  border-radius: 15px;
  background-color: var(--surface);
  box-shadow: 0 8px 24px rgba(23, 35, 52, 0.08);
}

#manu_bar {
  display: flex;
  flex-direction: column;
  width: 5vw;
  height: 91vh;
  margin-top: 8vh;
  margin-left: 0.8rem;
}

.manu_area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
  padding: 0;
  border: 0;
  background: transparent;
  transition: background-color 0.3s ease;
}

.manu_area:hover {
  border-radius: 15px;
  background-color: rgba(181, 139, 82, 0.12);
  cursor: pointer;
}

.manu_area:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.manu_area:disabled:hover {
  background-color: transparent;
}

.manu_area svg {
  width: 40%;
  height: 40%;
}

.manu_area svg path {
  fill: var(--ink);
}

#add {
  position: relative;
}

#add::after {
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 1px;
  border-radius: 1px;
  background-color: #000;
  content: "";
}

#content {
  display: flex;
  flex: 1;
  min-width: 0;
  height: 91vh;
  margin: 8vh 0.8rem 0;
  flex-direction: column;
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
</style>