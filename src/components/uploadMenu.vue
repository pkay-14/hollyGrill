<template>
    <div>
        <form @submit.prevent="uploadMenu">
            <input v-model="form.name" required placeholder="Dish name" />
            <input v-model="form.description" placeholder="Description" />
            <input v-model="form.category" placeholder="Category" />
            <input v-model.number="form.price" required type="number" placeholder="Price" />
            <input type="file" @change="handleFile" />
            <button type="submit">Upload</button>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
    const form = reactive({
        name: '',
        description: '',
        category: '',
        price: null,
    });
    const file = ref(null);

    const handleFile = (e) => {
        file.value = e.target.files[0];
    };

    const uploadMenu = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (file.value) formData.append('image', file.value);
      await axios.post('http://localhost:3000/menu', formData);
    // Refresh or show message
};
</script>

<style lang="scss" scoped>

</style>