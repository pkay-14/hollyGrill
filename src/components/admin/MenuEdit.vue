<template>
  <div class="menu-form">
    <h2>{{ isEdit ? 'Edit Menu Item' : 'Add Menu Item' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label>Name:</label>
        <input v-model.trim="form.name" type="text" maxlength="35" required />
      </div>

      <div class="form-row">
        <label>Description:</label>
        <textarea v-model.trim="form.description" rows="3" maxlength="50"></textarea>
      </div>

      <div class="form-row">
        <label>Category:</label>
        <select v-model="form.category">
          <option disabled value="">Select category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="form-row">
        <label>Price:</label>
        <div class="currency-input">
          <span>ghs</span>
          <input v-model.number="form.price" type="number" step="0.01" min="0" />
        </div>
      </div>

      <div class="form-row">
        <label>Image:</label>
        <input type="file" @change="handleImageUpload" />
      </div>

      <div class="form-row" v-if="form.imagePreview">
        <label>Preview:</label>
        <img :src="imagePreviewUrl" alt="Preview" class="preview" />
      </div>

      <div class="form-actions">
        <button
          type="submit"
          :disabled="!isFormValid"
          :class="['primary', isEdit ? 'update' : 'create']"
        >
          {{ isEdit ? 'Update' : 'Create' }}
        </button>

        <button type="button" class="reset" @click="handleReset" :disabled="!isFormDirty">
          Reset
        </button>

        <button
          v-if="isEdit"
          type="button"
          class="delete"
          @click="handleDelete"
          :disabled="!props.item?.id"
        >
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, computed } from 'vue';
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../../../api/api-calls';

const props = defineProps({
  item: Object,
  isEdit: Boolean
});

const emit = defineEmits(['submitted', 'reset']);

const form = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  imageFile: null,
  imagePreview: ''
});

const initialForm = () => ({
  name: '',
  description: '',
  category: '',
  price: 0,
  imageFile: null,
  imagePreview: ''
});

const categories = ['main', 'extra', 'drinks', 'pastries'];

watch(
  () => props.item,
  (item) => {
    if (item) {
      form.value.name = item.name || '';
      form.value.description = item.description || '';
      form.value.category = item.category || '';
      form.value.price = item.price || 0;
      form.value.imagePreview = item.image || '';
      form.value.imageFile = null;
    }
  },
  { immediate: true }
);

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.value.imageFile = file;
    form.value.imagePreview = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('description', form.value.description);
  formData.append('category', form.value.category);
  formData.append('price', form.value.price);

  if (form.value.imageFile) {
    formData.append('image', form.value.imageFile);
  }

  try {
    if (props.isEdit && props.item?.id) {
      await updateMenuItem(props.item.id, formData);
    } else {
      await createMenuItem(formData);
    }
    emit('submitted');
    handleReset();
  } catch (err) {
    console.error('Error saving item:', err);
  }
};

const handleReset = () => {
  form.value = initialForm();
  emit('reset');
};

const handleDelete = async () => {
  if (props.item?.id && confirm('Are you sure you want to delete this item?')) {
    try {
      await deleteMenuItem(props.item.id);
      emit('submitted');
      handleReset();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  }
};

const isFormValid = computed(() =>
  form.value.name.trim() &&
  form.value.description.trim() &&
  form.value.category.trim() &&
  form.value.price > 0
);

const isFormDirty = computed(() =>
  form.value.name || form.value.description || form.value.category || form.value.price || form.value.imageFile
);

const imagePreviewUrl = computed(() =>
  form.value.imagePreview
);
</script>

<style scoped>
.menu-form {
  padding: 1rem;
  background: #fdfdfd;
  border-right: 1px solid #e0e0e0;
  width: 95%;
  border: none;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

label {
  width: 100px;
  font-weight: 500;
}

input,
textarea,
select {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.currency-input {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 0.5rem;
  background: white;
  flex: 1;
}

.currency-input span {
  font-size: 1rem;
  color: #444;
  margin-right: 0.25rem;
}

.currency-input input {
  border: none;
  outline: none;
  padding: 0.5rem 0;
  font-size: 1rem;
  flex: 1;
}

button {
  transition: all 0.2s ease;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

button.create {
  background-color: green;
}
button.create:hover {
  background-color: lightgreen;
}

button.update {
  background-color: #007bff;
}
button.update:hover {
  background-color: #0056b3;
}

button.reset {
  background-color: #f4f4f4;
  color: #333;
}
button.reset:hover {
  background-color: #ddd;
}

button.delete {
  background-color: #dc3545;
}
button.delete:hover {
  background-color: #c82333;
}

.preview {
  max-height: 100px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

@media (min-width: 768px) {
  .menu-form {
    max-width: 50%;
    position: relative;
    top: -2rem;
  }
}
</style>
