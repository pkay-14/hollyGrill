<template>
  <div>
    <EditForm 
      :item="selectedItem" 
      :isEdit="isEdit" 
      @reset="setSelectedItem(null)" 
      @submitEvent="handleSubmitEvent"
      @loading="setLoading"
    />
    
    <div>
      <MenuList 
        :menuItems="menuItems"
        :key="formKey"
        @edit="setSelectedItem"
      />
    </div>

    <!-- Spinner Overlay -->
    <div v-if="isLoading" class="overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import EditForm from "./MenuEdit.vue";
import MenuList from "./MenuList.vue";
import { getMenuItems, getMenuItem } from '../../../api/api-calls.js';

const menuItems = ref([]);
const selectedItem = ref({});
const error = ref(null);
const isEdit = ref(false);
const formKey = ref(0);
const isLoading = ref(false);

const setSelectedItem = async (id) => {
  try {
    if (id) {
      isLoading.value = true;
      const response = await getMenuItem(id);
      selectedItem.value = response.data;
      isEdit.value = true;
    } else {
      selectedItem.value = {};
      isEdit.value = false;
      formKey.value++;
    }
  } catch (err) {
    error.value = "Error loading menu item. Please try again later.";
    console.log(error.value);
  } finally {
    isLoading.value = false;
  }
};

const fetchMenu = async () => {
  try {
    const response = await getMenuItems();
    menuItems.value = response.data;
  } catch (err) {
    error.value = "Error loading menu items. Please try again later.";
    console.log(error.value);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmitEvent = async () => {
  isLoading.value = true;
  await fetchMenu();
};

const setLoading = (loading) => {
  isLoading.value = loading;
};

onMounted(async () => {
  fetchMenu();
});
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top-color: #007BFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
