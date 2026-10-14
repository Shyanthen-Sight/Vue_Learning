# Car Merchant 项目完整详解

## 一、项目简介

Car Merchant 是一个基于 Vue 3、TypeScript、Vite 和 Vue Router 实现的汽车租赁展示项目。

项目目前包含两个主要页面：

- 首页：展示视频背景、项目标题和进入租车页面的入口。
- 租车页面：展示车辆列表，支持按价格区间和车辆类型筛选，并支持添加、选择和删除车辆。

这个项目适合用来学习以下 Vue 知识：

- Vue 3 Composition API
- `<script setup>` 语法
- `ref`、`computed`、`watch`
- 父子组件通信
- `props` 和 `emit`
- `v-model` 双向绑定
- `v-if`、`v-for`、`v-bind`、`v-on`
- Vue Router 路由跳转
- TypeScript 接口和联合类型
- 组件化开发
- CSS 作用域和 CSS 自定义变量

---

## 二、项目目录结构

项目核心目录如下：

```text
Car_Merchant/
├─ public/
│  └─ video/
│     └─ vi-hero-4.mp4
├─ src/
│  ├─ assets/
│  │  ├─ fonts/
│  │  ├─ image/
│  │  │  ├─ CarClass/
│  │  │  └─ logo/
│  │  └─ ...
│  ├─ components/
│  │  ├─ Home_hero_page.vue
│  │  ├─ Nav_header.vue
│  │  ├─ Rent_page.vue
│  │  └─ car/
│  │     ├─ AddVehicleModal.vue
│  │     ├─ DeleteVehicleModal.vue
│  │     ├─ SuccessToast.vue
│  │     ├─ VehicleGrid.vue
│  │     ├─ VehicleToolbar.vue
│  │     └─ types.ts
│  ├─ router/
│  │  └─ index.ts
│  ├─ stores/
│  │  └─ counter.ts
│  ├─ App.vue
│  └─ main.ts
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

### 2.1 目录职责

| 目录或文件 | 作用 |
|---|---|
| `src/main.ts` | Vue 应用启动入口 |
| `src/App.vue` | 应用的根组件，负责公共导航和路由出口 |
| `src/router/index.ts` | 配置页面路径和组件的对应关系 |
| `src/components/Nav_header.vue` | 顶部导航栏 |
| `src/components/Home_hero_page.vue` | 首页英雄区 |
| `src/components/Rent_page.vue` | 租车页面的业务容器 |
| `src/components/car/VehicleToolbar.vue` | 筛选工具栏 |
| `src/components/car/VehicleGrid.vue` | 车辆卡片网格 |
| `src/components/car/AddVehicleModal.vue` | 添加车辆弹窗 |
| `src/components/car/DeleteVehicleModal.vue` | 删除车辆弹窗 |
| `src/components/car/SuccessToast.vue` | 操作成功提示 |
| `src/components/car/types.ts` | 车辆数据的 TypeScript 类型 |
| `src/assets` | 图片、字体等参与构建的静态资源 |
| `public` | 不经过模块导入、直接通过 URL 访问的静态资源 |

---

## 三、应用启动过程

应用从 `src/main.ts` 开始执行：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

### 3.1 `createApp`

```ts
const app = createApp(App)
```

`createApp(App)` 会创建一个 Vue 应用实例，`App.vue` 是这个应用的根组件。

可以把它理解成：

```text
浏览器页面
  └─ Vue 应用
      └─ App.vue
          ├─ Nav_header.vue
          └─ router-view 当前页面
```

### 3.2 `app.use(router)`

```ts
app.use(router)
```

这一步将 Vue Router 安装到当前 Vue 应用中。安装后，组件中才能使用：

```ts
import { useRouter, useRoute } from 'vue-router'
```

以及模板中的：

```vue
<router-view />
```

### 3.3 `app.use(createPinia())`

项目注册了 Pinia：

```ts
app.use(createPinia())
```

Pinia 是 Vue 官方推荐的状态管理工具。不过当前项目的车辆状态仍然保存在 `Rent_page.vue` 中，没有通过 Pinia store 共享。

这并不是错误，只说明目前项目规模还可以由页面组件自己管理状态。如果以后需要让订单页、用户页和租车页共享车辆数据，就可以把 `cars` 移动到 Pinia store 中。

### 3.4 `app.mount('#app')`

```ts
app.mount('#app')
```

这会把 Vue 应用挂载到 `index.html` 中的元素：

```html
<div id="app"></div>
```

挂载后，Vue 开始接管这个 DOM 节点。

---

## 四、App.vue 的作用

`App.vue` 是根组件：

```vue
<script setup lang="ts">
import Nav_header from './components/Nav_header.vue'
</script>

<template>
  <Nav_header />
  <router-view />
</template>
```

它做了两件事：

1. 无论当前在哪个路由，都显示顶部导航。
2. 使用 `<router-view />` 显示当前路由匹配到的页面组件。

因此导航栏不会随着首页和租车页面切换而消失。

### 4.1 `<router-view />`

`<router-view />` 是 Vue Router 提供的组件占位符。

当当前路径是 `/` 时：

```text
<router-view />
  └─ Home_hero_page.vue
```

当当前路径是 `/rent_page` 时：

```text
<router-view />
  └─ Rent_page.vue
```

页面切换时，通常不会发生传统多页面网站的整页刷新，而是由 Vue Router 替换路由出口中的组件。

---

## 五、Router 的实现和页面跳转

路由配置位于 `src/router/index.ts`：

```ts
import { createRouter, createWebHistory } from 'vue-router'
import Home_hero_page from '@/components/Home_hero_page.vue'
import Rent_page from '@/components/Rent_page.vue'

const routes = [
  {
    path: '/',
    name: 'Home_page',
    component: Home_hero_page
  },
  {
    path: '/rent_page',
    name: 'Rent_page',
    component: Rent_page
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

### 5.1 路由对象

一个路由对象通常包含三个重要属性：

```ts
{
  path: '/rent_page',
  name: 'Rent_page',
  component: Rent_page
}
```

#### `path`

访问地址：

```text
/rent_page
```

浏览器访问：

```text
http://localhost:5173/rent_page
```

就会匹配到这个路由。

#### `name`

路由名称：

```ts
name: 'Rent_page'
```

使用路由名称跳转比直接写路径更安全：

```ts
router.push({ name: 'Rent_page' })
```

如果以后修改路径为 `/cars`，只要路由名称不变，跳转代码仍然可以正常工作。

#### `component`

指定匹配成功后显示的组件：

```ts
component: Rent_page
```

### 5.2 `createWebHistory`

```ts
history: createWebHistory(import.meta.env.BASE_URL)
```

这里使用 HTML5 History 模式。地址看起来比较自然：

```text
/
/rent_page
```

另一种模式是 `createWebHashHistory`，地址会带 `#`：

```text
/#/rent_page
```

History 模式更适合正式网站，但部署到服务器时需要服务器将未知路径回退到 `index.html`，否则直接刷新 `/rent_page` 可能出现 404。

### 5.3 导航栏中的路由跳转

`Nav_header.vue` 中使用：

```ts
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isRentPage = computed(() => route.name === 'Rent_page')
```

#### `useRouter`

`useRouter()` 获取路由操作对象：

```ts
router.push({ name: 'Rent_page' })
```

相当于让程序主动跳转页面。

#### `useRoute`

`useRoute()` 获取当前路由信息：

```ts
route.name
route.path
route.params
route.query
```

本项目用 `route.name` 判断当前是否处于租车页。

### 5.4 根据当前路由切换文字

```ts
const leapText = computed(() =>
  isRentPage.value ? 'Back' : "Let's start"
)
```

如果当前是租车页面，按钮显示 `Back`；否则显示 `Let's start`。

这里使用 `computed`，因为文字依赖于当前路由状态。当路由变化时，`leapText` 会自动重新计算。

### 5.5 导航函数

```ts
function goToRentPage() {
  if (isRentPage.value) {
    router.push({ name: 'Home_page' })
  } else {
    router.push({ name: 'Rent_page' })
  }
}
```

这个函数实现了一个来回切换：

```text
首页       --点击--> 租车页
租车页     --点击--> 首页
```

模板中通过事件绑定调用：

```vue
<div @click="goToRentPage">
```

---

## 六、组件之间的关系

项目的组件关系可以表示为：

```text
App.vue
├─ Nav_header.vue
└─ router-view
   ├─ Home_hero_page.vue
   └─ Rent_page.vue
      ├─ SuccessToast.vue
      ├─ AddVehicleModal.vue
      ├─ DeleteVehicleModal.vue
      ├─ VehicleToolbar.vue
      └─ VehicleGrid.vue
```

其中 `Rent_page.vue` 是租车功能的父组件和业务容器。

它负责：

- 保存车辆列表
- 保存筛选条件
- 保存选中的车辆
- 控制添加弹窗
- 控制删除弹窗
- 接收子组件事件
- 根据条件计算过滤后的车辆

子组件负责展示界面和收集用户操作。

这是一种很常见的组件设计：

```text
父组件：管理状态和业务规则
子组件：展示数据和发出用户操作事件
```

---

## 七、父传子：Props

父组件向子组件传递数据，需要使用 props。

例如 `Rent_page.vue` 向 `VehicleGrid.vue` 传递：

```vue
<VehicleGrid
  :cars="filteredCars"
  :total-cars="cars.length"
  :selected-car-id="selectedCarId"
  @select="selectedCarId = $event"
/>
```

这里传递了三个 props：

| 父组件绑定 | 子组件接收字段 | 含义 |
|---|---|---|
| `:cars="filteredCars"` | `cars` | 当前筛选后的车辆 |
| `:total-cars="cars.length"` | `totalCars` | 所有车辆总数 |
| `:selected-car-id="selectedCarId"` | `selectedCarId` | 当前选中的车辆 ID |

子组件中使用：

```ts
defineProps<{
  cars: Car[];
  totalCars: number;
  selectedCarId: string | null;
}>();
```

### 7.1 为什么使用 `defineProps`

`defineProps` 是 `<script setup>` 中的编译宏，用于声明组件可以接收哪些数据。

它不需要手动导入：

```ts
const props = defineProps<{
  visible: boolean;
}>()
```

如果需要在脚本中访问，可以保存返回值：

```ts
const props = defineProps<{
  visible: boolean;
}>()

console.log(props.visible)
```

如果只在模板中使用，也可以不保存返回值。

### 7.2 Props 是单向数据流

父组件可以修改传给子组件的数据，子组件不能直接修改 props。

正确的流程是：

```text
父组件拥有数据
  ↓ props
子组件读取数据
  ↓ emit
子组件通知父组件
  ↓
父组件修改数据
```

这可以避免多个组件随意修改同一份数据，使数据来源更加清晰。

---

## 八、子传父：defineEmits 和 emit

子组件不能直接修改父组件状态，因此要通过事件通知父组件。

`VehicleGrid.vue` 中声明事件：

```ts
const emit = defineEmits<{
  select: [carId: string];
}>();
```

当用户点击车辆卡片时：

```vue
<article
  v-for="car in cars"
  :key="car.id"
  @click="emit('select', car.id)"
>
```

它会发出：

```text
事件名称：select
事件参数：car.id
```

父组件监听：

```vue
<VehicleGrid @select="selectedCarId = $event" />
```

其中 `$event` 就是子组件传出的车辆 ID。

完整数据流：

```text
用户点击 CAR-003
  ↓
VehicleGrid emit('select', 'CAR-003')
  ↓
Rent_page 接收到 $event
  ↓
selectedCarId = 'CAR-003'
  ↓
Vue 重新渲染选中样式和删除按钮状态
```

### 8.1 TypeScript 类型事件

例如 `VehicleToolbar.vue`：

```ts
const emit = defineEmits<{
  'update:minBudget': [value: number];
  'update:maxBudget': [value: number];
  'update:isFilterOpen': [value: boolean];
  toggleType: [type: CarType];
  resetFilters: [];
}>();
```

这表示：

- `update:minBudget` 必须传入数字
- `update:maxBudget` 必须传入数字
- `update:isFilterOpen` 必须传入布尔值
- `toggleType` 必须传入合法的 `CarType`
- `resetFilters` 不需要参数

这样可以在编译阶段发现错误，例如误传字符串：

```ts
emit('update:minBudget', '100')
```

TypeScript 会提示类型不匹配。

---

## 九、`v-model` 和自定义双向绑定

父组件中：

```vue
<VehicleToolbar
  v-model:min-budget="minBudget"
  v-model:max-budget="maxBudget"
/>
```

这是 Vue 的多参数 `v-model` 写法。

它等价于：

```vue
<VehicleToolbar
  :min-budget="minBudget"
  :max-budget="maxBudget"
  @update:min-budget="minBudget = $event"
  @update:max-budget="maxBudget = $event"
/>
```

Vue 会自动把：

```text
v-model:min-budget
```

转换成：

```text
prop: minBudget
event: update:minBudget
```

子组件因此需要声明：

```ts
defineProps<{
  minBudget: number;
  maxBudget: number;
}>();

const emit = defineEmits<{
  'update:minBudget': [value: number];
  'update:maxBudget': [value: number];
}>();
```

输入框发生变化时：

```vue
<input
  :value="minBudget"
  @input="emit(
    'update:minBudget',
    Number(($event.target as HTMLInputElement).value)
  )"
/>
```

数据流是：

```text
用户修改输入框
  ↓
子组件读取 input.value
  ↓
转换成 number
  ↓
emit('update:minBudget', 新值)
  ↓
父组件更新 minBudget
  ↓
filteredCars 重新计算
```

### 9.1 为什么不用子组件直接修改 `minBudget`

因为 `minBudget` 是父组件传入的 prop。直接修改会破坏 Vue 的单向数据流。

错误思路：

```ts
props.minBudget = 100
```

正确思路：

```ts
emit('update:minBudget', 100)
```

---

## 十、Rent_page.vue 的状态管理

租车页面中的状态主要由 `ref` 创建：

```ts
const minBudget = ref(0);
const maxBudget = ref(0);
const selectedTypes = ref<CarType[]>([]);
const isFilterOpen = ref(true);
const selectedCarId = ref<string | null>(null);
const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deleteTargetCarId = ref<string | null>(null);
const successMessage = ref('');
```

### 10.1 `ref`

`ref` 用于创建响应式数据。

```ts
const count = ref(0)
count.value++
```

在 `<script setup>` 中访问需要 `.value`：

```ts
console.log(count.value)
```

但在模板中 Vue 会自动解包：

```vue
<span>{{ count }}</span>
```

不需要写 `count.value`。

本项目中的状态含义：

| 状态 | 类型 | 作用 |
|---|---|---|
| `minBudget` | `number` | 最低预算 |
| `maxBudget` | `number` | 最高预算 |
| `selectedTypes` | `CarType[]` | 选中的车辆类型 |
| `isFilterOpen` | `boolean` | 筛选面板是否展开 |
| `selectedCarId` | `string \| null` | 当前车辆 ID |
| `isAddModalOpen` | `boolean` | 添加弹窗是否打开 |
| `isDeleteModalOpen` | `boolean` | 删除弹窗是否打开 |
| `deleteTargetCarId` | `string \| null` | 待删除车辆 ID |
| `successMessage` | `string` | 成功提示文字 |

### 10.2 `computed`

`computed` 用来声明依赖其他状态的派生数据：

```ts
const selectedCar = computed(() =>
  cars.value.find((car) => car.id === selectedCarId.value),
);
```

它表示：

```text
selectedCarId 改变
  ↓
重新在 cars 中查找车辆
  ↓
selectedCar 更新
```

项目中的计算属性包括：

#### 当前选中的车辆

```ts
const selectedCar = computed(() =>
  cars.value.find((car) => car.id === selectedCarId.value),
);
```

#### 待删除车辆

```ts
const deleteTargetCar = computed(() =>
  cars.value.find((car) => car.id === deleteTargetCarId.value),
);
```

#### 当前筛选条件数量

```ts
const activeFilterCount = computed(() => {
  let count = selectedTypes.value.length;

  if (minBudget.value > 0) count += 1;
  if (maxBudget.value > 0) count += 1;

  return count;
});
```

#### 筛选后的车辆

```ts
const filteredCars = computed(() =>
  cars.value.filter((car) => {
    const matchesType =
      selectedTypes.value.length === 0 ||
      selectedTypes.value.includes(car.type);
    const matchesMinBudget =
      minBudget.value <= 0 ||
      car.dailyPrice >= minBudget.value;
    const matchesMaxBudget =
      maxBudget.value <= 0 ||
      car.dailyPrice <= maxBudget.value;

    return matchesType && matchesMinBudget && matchesMaxBudget;
  }),
);
```

筛选规则是：

```text
没有选择类型       → 类型条件通过
有选择类型         → 车辆类型必须在 selectedTypes 中
最低价格 <= 0      → 不限制最低价格
最高价格 <= 0      → 不限制最高价格
```

只有所有条件都满足，车辆才会保留。

---

## 十一、车辆数据和图片加载

项目使用 `import.meta.glob` 批量读取车辆图片：

```ts
const carImageModules = import.meta.glob(
  '../assets/image/CarClass/**/*.png',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>;
```

### 11.1 `import.meta.glob`

这是 Vite 提供的功能，用来匹配多个文件。

```text
../assets/image/CarClass/**/*.png
```

表示递归匹配 `CarClass` 目录下的所有 PNG 文件。

### 11.2 `eager: true`

```ts
eager: true
```

表示构建时立即导入所有匹配文件。

如果不设置 `eager: true`，Vite 默认可能返回动态导入函数，需要异步加载。

### 11.3 `query: '?url'`

```ts
query: '?url'
```

表示获取图片最终的 URL，而不是图片模块对象。

车辆数据通过路径取出对应的图片：

```ts
image: carImageModules[
  `../assets/image/CarClass/${
    car.type === 'Sports' ? 'SportsCar' : car.type
  }/${car.fileName}`
] ?? ''
```

这里有一个特殊规则：

```text
Sports 类型的图片目录叫 SportsCar
其他类型的目录名和 type 一致
```

---

## 十二、车辆类型与 TypeScript 类型

`types.ts` 中定义：

```ts
export type CarType =
  | 'MPV'
  | 'SUV'
  | 'Sedan'
  | 'Pickup'
  | 'Sports';
```

这叫联合类型。变量只能是这五个字符串之一。

```ts
const type: CarType = 'SUV';
```

下面的写法会报错：

```ts
const type: CarType = 'Truck';
```

车辆完整类型：

```ts
export interface Car {
  id: string;
  fileName: string;
  name: string;
  type: CarType;
  dailyPrice: number;
  mileage: number;
  stock: number;
  image: string;
}
```

新增车辆表单数据：

```ts
export interface NewCarInput {
  name: string;
  type: CarType;
  dailyPrice: number;
  mileage: number;
  stock: number;
  image: string;
}
```

`NewCarInput` 没有 `id`，因为 ID 由父组件创建：

```ts
const newCar: Car = {
  id: `CAR-${String(nextNumber).padStart(3, '0')}`,
  fileName: 'new-car.png',
  ...input,
};
```

这体现了一个重要设计：

```text
表单负责收集车辆信息
父组件负责生成系统字段 ID
```

---

## 十三、添加车辆的完整通信流程

### 13.1 父组件打开弹窗

左侧添加按钮：

```vue
<button
  type="button"
  title="Add a car"
  @click="addCar"
>
```

执行：

```ts
const addCar = () => {
  isAddModalOpen.value = true;
};
```

然后父组件把状态传给弹窗：

```vue
<AddVehicleModal
  :visible="isAddModalOpen"
  @close="closeAddModal"
  @submit="submitNewCar"
/>
```

### 13.2 弹窗接收 `visible`

```ts
defineProps<{
  visible: boolean;
}>();
```

模板中：

```vue
<div v-if="visible" class="modal_backdrop">
```

当 `visible` 为 `true`，弹窗显示；为 `false`，弹窗不渲染。

### 13.3 表单使用 `v-model`

```vue
<input v-model="name" type="text" />
```

`v-model` 负责：

1. 把 `name` 显示到输入框。
2. 用户输入时自动更新 `name`。

数字输入使用：

```vue
<input v-model.number="dailyPrice" type="number" />
```

`.number` 会尝试将输入值转换为数字。

### 13.4 子组件提交表单

```ts
const submit = () => {
  const trimmedName = name.value.trim();

  if (
    !trimmedName ||
    dailyPrice.value < 0 ||
    mileage.value < 0 ||
    stock.value < 0
  ) {
    return;
  }

  emit('submit', {
    name: trimmedName,
    type: type.value,
    dailyPrice: dailyPrice.value,
    mileage: mileage.value,
    stock: stock.value,
    image: image.value,
  });

  close();
};
```

模板中：

```vue
<form @submit.prevent="submit">
```

`.prevent` 会阻止浏览器默认提交行为，防止页面刷新。

### 13.5 父组件创建新车辆

父组件监听：

```vue
@submit="submitNewCar"
```

执行：

```ts
const submitNewCar = (input: NewCarInput) => {
  const nextNumber =
    Math.max(
      0,
      ...cars.value.map(
        (car) => Number.parseInt(car.id.replace('CAR-', ''), 10) || 0,
      ),
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
```

完整流程：

```text
点击添加
  ↓
Rent_page: isAddModalOpen = true
  ↓
AddVehicleModal 显示
  ↓
用户填写表单
  ↓
子组件 emit('submit', 表单数据)
  ↓
Rent_page 接收 NewCarInput
  ↓
父组件生成 id
  ↓
cars.push(newCar)
  ↓
VehicleGrid 自动显示新车辆
```

---

## 十四、删除车辆的完整通信流程

### 14.1 选择车辆

`VehicleGrid.vue` 中：

```vue
<article
  v-for="car in cars"
  :class="{ selected: selectedCarId === car.id }"
  @click="emit('select', car.id)"
>
```

父组件接收：

```vue
@select="selectedCarId = $event"
```

### 14.2 激活删除按钮

```vue
<button
  :disabled="selectedCarId === null"
  @click="openDeleteModal"
>
```

当没有选择车辆时：

```text
selectedCarId === null
```

删除按钮禁用。

选择车辆后：

```text
selectedCarId === 'CAR-003'
```

删除按钮恢复可用。

### 14.3 打开删除弹窗

```ts
const openDeleteModal = () => {
  if (!selectedCar.value) return;

  deleteTargetCarId.value = selectedCar.value.id;
  isDeleteModalOpen.value = true;
};
```

父组件传递：

```vue
<DeleteVehicleModal
  :visible="isDeleteModalOpen"
  :car="deleteTargetCar"
  @close="closeDeleteModal"
  @confirm="deleteSelectedCar"
/>
```

### 14.4 删除弹窗的两步验证

`DeleteVehicleModal.vue` 使用：

```ts
const step = ref<1 | 2>(1);
const code = ref('');
const error = ref('');
```

第一步要求输入车辆编号：

```ts
if (code.value.trim().toUpperCase() !== props.car.id) {
  error.value = 'The vehicle code does not match the selected vehicle.';
  return;
}

step.value = 2;
```

编号正确后进入第二步最终确认。

### 14.5 `watch` 重置弹窗状态

```ts
watch(() => props.visible, (visible) => {
  if (visible) {
    step.value = 1;
    code.value = '';
    error.value = '';
  }
});
```

每次弹窗重新打开时，将步骤、输入框和错误信息重置。

这样可以避免上一次删除操作留下的错误状态影响下一次打开。

### 14.6 父组件真正删除车辆

```ts
const deleteSelectedCar = (targetCarId: string) => {
  const selectedIndex = cars.value.findIndex(
    (car) => car.id === targetCarId,
  );

  if (selectedIndex === -1) return;

  const targetCar = cars.value[selectedIndex];
  if (!targetCar) return;

  cars.value.splice(selectedIndex, 1);

  if (selectedCarId.value === targetCarId) {
    selectedCarId.value = null;
  }

  closeDeleteModal();
  showSuccessMessage(
    `Vehicle deleted successfully: ${targetCar.name}`,
  );
};
```

子组件只负责验证并发出 `confirm` 事件，真正修改车辆数组的工作由父组件完成。

---

## 十五、SuccessToast 的实现

父组件：

```vue
<SuccessToast :message="successMessage" />
```

子组件：

```ts
defineProps<{
  message: string;
}>();
```

模板：

```vue
<Transition name="success-toast">
  <div
    v-if="message"
    class="success_message"
    role="status"
    aria-live="polite"
  >
    <span class="success_icon">✓</span>
    <span>{{ message }}</span>
  </div>
</Transition>
```

### 15.1 `v-if`

只有 `message` 非空时，提示框才会存在：

```text
message = ''              → 不渲染
message = 'Vehicle added' → 渲染
```

### 15.2 `<Transition>`

```vue
<Transition name="success-toast">
```

Vue 会根据 `name` 自动添加过渡类：

```text
success-toast-enter-active
success-toast-enter-from
success-toast-leave-active
success-toast-leave-to
```

因此提示框出现和消失时会有淡入淡出和位移动画。

### 15.3 定时隐藏提示

父组件：

```ts
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
```

如果连续进行多次操作，会先清除旧定时器，再设置新定时器，避免多个定时器互相干扰。

---

## 十六、Vue 模板语法详解

### 16.1 插值表达式 `{{ }}`

```vue
<span>{{ car.name }}</span>
```

双大括号用于把 JavaScript 数据渲染到页面。

可以使用简单表达式：

```vue
{{ cars.length }}
{{ car.mileage.toLocaleString() }}
{{ activeFilterCount > 0 ? 'Active' : 'None' }}
```

不建议在模板中写复杂业务逻辑，复杂逻辑应该放到 `computed` 或方法中。

### 16.2 `v-if`

```vue
<div v-if="cars.length > 0">
```

条件为假时，元素不会被创建。

配合 `v-else`：

```vue
<div v-if="cars.length > 0">
  车辆列表
</div>
<div v-else>
  没有匹配车辆
</div>
```

### 16.3 `v-for`

```vue
<article
  v-for="car in cars"
  :key="car.id"
>
```

`v-for` 遍历车辆数组。

`:key` 用于帮助 Vue 识别每一个列表项。列表中应该使用稳定且唯一的值：

```vue
:key="car.id"
```

不建议直接使用数组下标，因为删除和排序时可能造成 DOM 复用错误。

### 16.4 `v-bind` 简写

完整写法：

```vue
<img v-bind:src="car.image" v-bind:alt="car.name" />
```

简写：

```vue
<img :src="car.image" :alt="car.name" />
```

项目中大量使用：

```vue
:disabled="selectedCarId === null"
:class="{ selected: selectedCarId === car.id }"
:visible="isAddModalOpen"
```

### 16.5 动态 class

```vue
:class="{ selected: selectedCarId === car.id }"
```

含义是：

```text
条件为 true  → 添加 selected 类
条件为 false → 不添加 selected 类
```

导航栏中还使用了数组形式：

```vue
:class="[
  'icon',
  { rotated: iconRotated, flipped: isRentPage }
]"
```

这表示固定类 `icon` 和条件类 `rotated`、`flipped` 同时存在。

### 16.6 `v-on` 和事件简写

完整写法：

```vue
<button v-on:click="addCar">Add</button>
```

简写：

```vue
<button @click="addCar">Add</button>
```

项目中的常见事件：

```vue
@click="goToRentPage"
@submit.prevent="submit"
@mouseenter="icon_rotate"
@mouseleave="icon_reset"
@keydown.enter="emit('select', car.id)"
```

### 16.7 事件修饰符

#### `.prevent`

```vue
@submit.prevent="submit"
```

阻止表单默认提交和页面刷新。

#### `.self`

```vue
@click.self="close"
```

只有点击事件绑定元素自身时才执行。

点击弹窗内容区域不会关闭弹窗，点击背景区域才会关闭。

#### `.enter`

```vue
@keydown.enter="emit('select', car.id)"
```

只有按下 Enter 键时触发。

### 16.8 `v-model`

普通输入框：

```vue
<input v-model="name" />
```

选择框：

```vue
<select v-model="type">
```

数字转换：

```vue
<input v-model.number="dailyPrice" />
```

### 16.9 `v-bind` 与 TypeScript 类型断言

模板中：

```vue
@input="emit(
  'update:minBudget',
  Number(($event.target as HTMLInputElement).value)
)"
```

`$event.target` 的通用类型不一定能直接访问 `.value`，因此使用：

```ts
$event.target as HTMLInputElement
```

告诉 TypeScript：这个事件目标就是一个 HTML 输入框。

---

## 十七、CSS scoped 和 CSS 变量

组件中的：

```vue
<style scoped>
```

表示样式只作用于当前组件。

Vue 会为元素添加类似的内部属性：

```html
<div data-v-xxxxxx></div>
```

同时将 CSS 选择器转换为带属性选择器的形式，避免不同组件之间的类名冲突。

### 17.1 CSS 自定义变量

`Rent_page.vue` 中定义：

```css
#rent_page {
  --ink: #172334;
  --muted: #728096;
  --surface: #f7f8fa;
  --panel: #ffffff;
  --line: #dfe4eb;
  --accent: #b58b52;
}
```

子组件中使用：

```css
.car_card {
  border-color: var(--line);
  background: var(--panel);
}
```

CSS 自定义属性会沿 DOM 父子关系继承，因此租车页下的子组件可以使用这些主题变量。

这比在每个组件中重复写颜色更容易维护。

### 17.2 父组件样式的职责

当前父组件只保留：

- 整体页面布局
- 左侧添加/删除工具栏
- 主内容区布局
- 主题变量

车辆网格样式由 `VehicleGrid.vue` 管理，筛选栏样式由 `VehicleToolbar.vue` 管理，弹窗样式由对应弹窗组件管理。

这样可以避免所有样式都堆积到 `Rent_page.vue` 中。

---

## 十八、事件和数据流总图

### 18.1 筛选流程

```text
用户修改最低价格
  ↓
VehicleToolbar 的 input
  ↓
emit('update:minBudget', value)
  ↓
Rent_page 更新 minBudget
  ↓
filteredCars computed 重新计算
  ↓
VehicleGrid 收到新的 cars
  ↓
车辆卡片列表更新
```

### 18.2 类型筛选流程

```text
用户点击 SUV
  ↓
VehicleToolbar emit('toggleType', 'SUV')
  ↓
Rent_page 执行 toggleType
  ↓
selectedTypes 增加或移除 SUV
  ↓
filteredCars 重新计算
  ↓
VehicleGrid 更新显示结果
```

### 18.3 选择车辆流程

```text
用户点击车辆卡片
  ↓
VehicleGrid emit('select', car.id)
  ↓
Rent_page 更新 selectedCarId
  ↓
卡片增加 selected 样式
  ↓
删除按钮解除 disabled
```

### 18.4 删除流程

```text
用户选择车辆
  ↓
点击删除
  ↓
Rent_page 打开 DeleteVehicleModal
  ↓
用户输入车辆编号
  ↓
DeleteVehicleModal 验证编号
  ↓
进入最终确认步骤
  ↓
emit('confirm', car.id)
  ↓
Rent_page 从 cars 删除车辆
  ↓
SuccessToast 显示成功信息
```

---

## 十九、项目中几个重要的 Vue 设计原则

### 19.1 状态应该放在真正拥有它的组件中

车辆列表被多个子组件使用：

- `VehicleGrid` 需要读取
- `VehicleToolbar` 需要影响筛选
- `DeleteVehicleModal` 需要读取选中的车辆
- `AddVehicleModal` 需要提交新车辆

因此车辆状态放在共同父组件 `Rent_page.vue` 中最合适。

### 19.2 子组件尽量不要直接处理父级业务

`VehicleGrid` 不负责真正删除车辆，它只发出选择事件。

`DeleteVehicleModal` 不负责修改车辆数组，它只负责验证并发出确认事件。

这样每个组件的职责更加清晰。

### 19.3 UI 状态和业务数据分开

例如：

```ts
const cars = ref<Car[]>(initialCars);
const isAddModalOpen = ref(false);
```

`cars` 是业务数据，`isAddModalOpen` 是界面状态。分开管理便于理解和维护。

### 19.4 派生数据使用 computed

不要手动在多个地方同步筛选结果：

```ts
const filteredCars = computed(() => ...)
```

只要源数据变化，计算属性会自动更新。

---

## 二十、如何启动和构建项目

在项目目录下执行：

```powershell
cd C:\Users\Shyanthen\Desktop\Vue\vue_class\homework\Car_Merchant\Car_Merchant
npm install
npm run dev
```

开发服务器启动后，在浏览器打开终端显示的地址，通常是：

```text
http://localhost:5173
```

### 20.1 类型检查和构建

```powershell
npm run type-check
npm run build
```

项目中的 `build` 脚本同时执行类型检查和 Vite 构建：

```json
{
  "scripts": {
    "build": "run-p type-check \"build-only {@}\" --",
    "type-check": "vue-tsc --build",
    "build-only": "vite build"
  }
}
```

### 20.2 代码格式化

```powershell
npm run format
```

### 20.3 代码检查

```powershell
npm run lint
```

---

## 二十一、后续可以如何改进

### 21.1 将车辆初始数据单独拆出

目前车辆数据直接写在 `Rent_page.vue` 中：

```ts
const carData = [...]
```

可以新建：

```text
src/components/car/carData.ts
```

然后：

```ts
import { carData } from './car/carData';
```

这样页面组件只负责逻辑，车辆数据单独维护。

### 21.2 将车辆状态移动到 Pinia

如果多个页面都需要访问车辆列表，可以创建：

```text
src/stores/car.ts
```

示意：

```ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCarStore = defineStore('car', () => {
  const cars = ref<Car[]>([]);

  const addCar = (car: Car) => {
    cars.value.push(car);
  };

  const removeCar = (id: string) => {
    cars.value = cars.value.filter((car) => car.id !== id);
  };

  return {
    cars,
    addCar,
    removeCar,
  };
});
```

页面中使用：

```ts
const carStore = useCarStore();
carStore.addCar(newCar);
```

### 21.3 添加路由懒加载

目前路由直接导入页面：

```ts
import Rent_page from '@/components/Rent_page.vue'
```

页面较多时，可以使用懒加载：

```ts
const Rent_page = () =>
  import('@/components/Rent_page.vue');
```

这样租车页面只会在真正访问时加载。

### 21.4 改善资源 URL 生命周期

添加车辆图片时使用：

```ts
URL.createObjectURL(file)
```

实际项目中删除图片或关闭页面时，可以调用：

```ts
URL.revokeObjectURL(imageUrl)
```

释放浏览器创建的临时 URL，避免长期运行时产生资源占用。

### 21.5 增加后端持久化

目前车辆数据保存在前端内存中：

```text
刷新页面后，新增车辆和删除操作会丢失
```

如果要做成真正的租车系统，需要连接后端 API 或数据库，例如：

```text
GET    /api/cars
POST   /api/cars
DELETE /api/cars/:id
```

---

## 二十二、总结

Car Merchant 的核心结构可以概括为：

```text
main.ts
  ↓ 注册 Vue、Router、Pinia
App.vue
  ↓ 公共导航 + 路由出口
router/index.ts
  ↓ 根据 URL 选择页面
Rent_page.vue
  ↓ 管理车辆数据和业务状态
子组件
  ├─ VehicleToolbar：收集筛选条件
  ├─ VehicleGrid：展示并选择车辆
  ├─ AddVehicleModal：收集新车信息
  ├─ DeleteVehicleModal：验证删除操作
  └─ SuccessToast：展示操作结果
```

最重要的数据流原则是：

```text
父组件通过 props 把数据传给子组件
子组件通过 emit 把操作通知父组件
父组件修改状态
Vue 根据响应式状态自动更新页面
```

最重要的 Vue 语法包括：

```text
ref       创建响应式状态
computed  创建派生状态
watch     监听状态变化
v-if      条件渲染
v-for     列表渲染
v-model   表单双向绑定
:prop     动态属性绑定
@event    事件监听
defineProps 接收父组件数据
defineEmits 发出子组件事件
router-view 显示当前路由页面
router.push 程序化跳转路由
```

通过这个项目，可以完整理解一个中小型 Vue 3 应用从启动、路由、组件拆分、状态管理到父子通信的基本实现方式。
