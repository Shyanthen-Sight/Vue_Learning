<script setup lang="ts">
import type { CarType } from './types';

defineProps<{
  minBudget: number;
  maxBudget: number;
  selectedTypes: CarType[];
  isFilterOpen: boolean;
  activeFilterCount: number;
}>();

const emit = defineEmits<{
  'update:minBudget': [value: number];
  'update:maxBudget': [value: number];
  'update:isFilterOpen': [value: boolean];
  toggleType: [type: CarType];
  resetFilters: [];
}>();

const types: CarType[] = ['MPV', 'SUV', 'Sedan', 'Pickup', 'Sports'];
</script>

<template>
  <div id="tool_bar" class="bar">
    <div id="filter" class="tool_item">
      <button class="filter_button" type="button" @click="emit('update:isFilterOpen', !isFilterOpen)">
        <span class="title">Filter</span>
        <span v-if="activeFilterCount > 0" class="filter_count">{{ activeFilterCount }}</span>
      </button>
      <div v-if="isFilterOpen" class="filter_panel">
        <div class="filter_summary">
          <span>{{ activeFilterCount }} active filter(s)</span>
          <button class="reset_button" type="button" @click="emit('resetFilters')">Reset</button>
        </div>
        <p v-if="activeFilterCount === 0" class="filter_hint">Choose a budget or car type to filter.</p>
        <p v-else class="filter_hint">Your selected filters are ready to apply.</p>
      </div>
    </div>

    <div id="budget_range" class="tool_item">
      <div class="title tool_name">Budget Range</div>
      <div class="budget_inputs">
        <label class="budget_field">
          <span class="budget_label">Min</span>
          <input class="budget_input" type="number" :value="minBudget" placeholder="Minimum budget"
            @input="emit('update:minBudget', Number(($event.target as HTMLInputElement).value))" />
        </label>
        <span class="budget_separator">-</span>
        <label class="budget_field">
          <span class="budget_label">Max</span>
          <input class="budget_input" type="number" :value="maxBudget" placeholder="Maximum budget"
            @input="emit('update:maxBudget', Number(($event.target as HTMLInputElement).value))" />
        </label>
      </div>
    </div>

    <div id="type" class="tool_item">
      <div class="title tool_name">Type</div>
      <div class="type_buttons">
        <button v-for="type in types" :key="type" class="type_class"
          :class="{ selected: selectedTypes.includes(type) }" type="button" @click="emit('toggleType', type)">
          {{ type }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar { background: var(--surface); border: 2px solid rgba(23, 35, 52, 0.08); border-radius: 15px; box-shadow: 0 8px 24px rgba(23, 35, 52, 0.08); }
#tool_bar { min-height: 14vh; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; padding: 0.55rem 0.85rem; gap: 0; flex-shrink: 0; }
.tool_item { box-sizing: border-box; width: auto; min-width: 0; padding: 0 1rem; }
.tool_item + .tool_item { border-left: 1px solid var(--line); }
.tool_name { margin: 0 0 0.25rem 0.5rem; width: 100%; color: var(--ink); font-size: 2rem; font-weight: bold; }
.filter_button { display: flex; align-items: center; gap: 0.6rem; width: fit-content; margin: 0; padding: 0.2rem 0; border: 0; background: transparent; color: var(--ink); cursor: pointer; }
.filter_button .title { font-size: 2rem; font-weight: bold; }
.filter_count { display: inline-flex; align-items: center; justify-content: center; min-width: 1.4rem; height: 1.4rem; padding: 0 0.25rem; border-radius: 999px; background: var(--accent); color: #fff; font-size: 0.8rem; font-weight: 700; }
.filter_panel { margin-top: 0.65rem; padding: 0.6rem; border: 1px solid #e8dcc9; border-radius: 10px; background: #fbf8f3; }
.filter_summary { display: flex; justify-content: space-between; gap: 0.5rem; color: var(--muted); font-size: 0.9rem; font-weight: 600; }
.reset_button { padding: 0.3rem 0.6rem; border: 1px solid #d8c5a8; border-radius: 6px; background: #fff; color: var(--accent-dark); cursor: pointer; font-size: 0.8rem; }
.filter_hint { margin: 0.65rem 0 0; color: var(--soft-muted); font-size: 0.8rem; line-height: 1.4; }
.budget_inputs { display: flex; align-items: center; gap: 0.5rem; width: 100%; margin-top: 0.65rem; }
.budget_field { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 0.35rem; }
.budget_label { color: var(--muted); font-size: 0.9rem; font-weight: 600; }
.budget_input { box-sizing: border-box; width: 100%; min-width: 0; height: 2.5rem; padding: 0 0.75rem; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--ink); font-size: 1rem; }
.budget_separator { color: var(--soft-muted); }
.type_buttons { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.6rem; margin-top: 0.65rem; }
.type_class { width: 100%; min-height: 2.5rem; padding: 0.5rem 0.75rem; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--ink); cursor: pointer; font-size: 1rem; }
.type_class.selected { border-color: var(--accent-dark); background: var(--accent-dark); color: #fff; }
</style>
