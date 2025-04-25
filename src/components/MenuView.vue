<template>
    <div class="menu" id="menu">
        <h2>Our Menu</h2>
        <MenuFilter @categorySwitched="changeCategory"/>
        <MenuCard :menuItems="filteredItems"/>
    </div>
</template>

<script setup>
    import MenuFilter from './MenuFilter.vue';
    import MenuCard from './MenuCard.vue';
    import { ref, onMounted, computed } from "vue";
    import { getMenuItems } from '../../api/api-calls.js';
    
    const selectedCategory = ref('Main');
    const menuItems = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const changeCategory = (newCategory) => selectedCategory.value = newCategory
    const filteredItems = computed(() =>
    menuItems.value.filter((item) =>
      item.category?.toLowerCase() === selectedCategory.value.toLowerCase()
        )
    );
        onMounted(async () => {
    try {
        const response = await getMenuItems();
        menuItems.value = response.data;
        console.log("fetched menu")
    } catch (err) {
        error.value = "Error loading menu items. Please try again later."; // Handle errors
        console.log(error.value)
    } finally {
        loading.value = false; 
    }
    });
</script>

<style lang="scss" scoped>
    .menu{
        color: black;
        background-color: aliceblue;
        height: 30rem;
        padding: 1rem;
    }

</style>