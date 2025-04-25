<template>
    <div class="filter-buttons">
        <button
            v-for="category in categories"
            :key="category"
            :class="['filter-btn', { active: activeCategory === category }]"
            @click="changeCategory(category)"
        >
            {{ category }}
        </button>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const categories = ['Main', 'Extra', 'Drinks', 'Pastries'];
const activeCategory = ref('Main');

// Define the emit function
const emit = defineEmits(['categorySwitched']);

// Function to handle category change
const changeCategory = (category) => {
  activeCategory.value = category;
};

// Watch the activeCategory and emit the event when it changes
watch(activeCategory, (newCategory) => {
    console.log("cat changed")
    console.log(newCategory)
  emit('categorySwitched', newCategory);
});
</script>

<style lang="scss" scoped>
.filter-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    padding: 1rem;
}

.filter-btn {
    padding: 0.5rem 1.2rem;
    border: 1px solid #ccc;
    border-radius: 999px; /* pill shape */
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-btn:hover {
    background-color: #f39c12;
}

.filter-btn.active {
    background-color: transparent;
    color: #f39c12;
    border-color: #f39c12;
}
</style>
