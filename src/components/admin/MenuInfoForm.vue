<template>
  <div>
    <EditForm :item="selectedItem" :isEdit="isEdit" @reset="setSelectedItem(null)" @submitted="fetchMenu"/>
    <div>
      <MenuList :menuItems="menuItems"
      :key="formKey"
      @edit="setSelectedItem"/>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref} from 'vue';
 import EditForm from "./MenuEdit.vue"
 import MenuList from "./MenuList.vue";
 import { getMenuItems, getMenuItem } from '../../../api/api-calls.js';

  const menuItems = ref([]);
  const selectedItem = ref({});
  const error = ref(null);
  const isEdit = ref(false)
  const formKey = ref(0); 

const setSelectedItem = async(id) => {
  try {
        if(id){
          const response = await getMenuItem(id);
          selectedItem.value = response.data;
          isEdit.value = true
        }else{
          selectedItem.value = {}
          isEdit.value = false
          formKey.value++;
        }
    } catch (err) {
        error.value = "Error loading menu item. Please try again later."; // Handle errors
        console.log(error.value)
    }  
};
const fetchMenu = async() =>{
    try {
        const response = await getMenuItems();
        menuItems.value = response.data;
    } catch (err) {
        error.value = "Error loading menu items. Please try again later."; // Handle errors
        console.log(error.value)
    }  
  }
 onMounted(async () => {
    fetchMenu()
  });
</script>

<style lang="scss" scoped>

</style>