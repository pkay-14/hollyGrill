<template>
  <form @submit.prevent="handleSubmit" class="contact-form">
    <h2>📇 Contact Information</h2>

    <div class="form-group">
      <label for="instagram">
        <i class="fab fa-instagram icon instagram-icon"></i> Instagram
      </label>
      <input
        id="instagram"
        v-model="form.instagram"
        type="text"
        placeholder="@holygrill"
        :class="{'changed': isFieldChanged('instagram')}"
      />
    </div>

    <div class="form-group">
      <label for="tiktok">
        <i class="fab fa-tiktok icon tiktok-icon"></i> TikTok
      </label>
      <input
        id="tiktok"
        v-model="form.tiktok"
        type="text"
        placeholder="@holygrill"
        :class="{'changed': isFieldChanged('tiktok')}"
      />
    </div>

    <div class="form-group">
      <label for="mobile">
        <i class="fas fa-mobile-alt icon mobile-icon"></i> Mobile
      </label>
      <input
        id="mobile"
        v-model="form.mobile"
        type="text"
        placeholder="+233 50 000 0000"
        :class="{'changed': isFieldChanged('mobile')}"
      />
    </div>

    <!-- Save button disabled unless content is changed -->
    <button type="submit" :disabled="!isFormChanged">💾 Save Contact Info</button>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getContactInfo, updateContactInfo } from '../../../api/api-calls'; // adjust path if needed

const form = ref({
  instagram: '',
  tiktok: '',
  mobile: ''
});

const initialFormState = ref({
  instagram: '',
  tiktok: '',
  mobile: ''
});

const contactId = ref(null);

// Fetch contact info from API
const fetchContactInfo = async () => {
  try {
    const { data } = await getContactInfo();
    if (data.length > 0) {
      const contact = data[0];
      contactId.value = contact.id;
      form.value.instagram = contact.instagram;
      form.value.tiktok = contact.tiktok;
      form.value.mobile = contact.mobile;
      
      // Save initial state for comparison
      initialFormState.value = { ...form.value };
    }
  } catch (error) {
    console.error('Failed to fetch contact info', error);
  }
};

// Handle form submission (update contact info)
const handleSubmit = async () => {
  try {
    if (!contactId.value) return alert("No contact record to update.");
    await updateContactInfo(contactId.value, form.value);
    alert('✅ Contact info updated!');
    // Update initial state after successful save
    initialFormState.value = { ...form.value };
  } catch (err) {
    console.error(err);
    alert('❌ Failed to update contact info.');
  }
};

// Check if the form has changed by comparing current form data with initial state
const isFormChanged = computed(() => {
  return (
    form.value.instagram !== initialFormState.value.instagram ||
    form.value.tiktok !== initialFormState.value.tiktok ||
    form.value.mobile !== initialFormState.value.mobile
  );
});

// Check if a specific field has changed
const isFieldChanged = (field) => {
  return form.value[field] !== initialFormState.value[field];
};

// Fetch the contact information when the component is mounted
onMounted(fetchContactInfo);
</script>

<style scoped>
.contact-form {
  max-width: 500px;
  margin: 2rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

.contact-form h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input {
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #f39c12;
  outline: none;
}

/* Highlight changed fields */
input.changed {
  background-color: #f0f8ff; /* Light blue background for changed fields */
}

button {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #f39c12;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #d87e00;
}

.icon {
  font-size: 1.1rem;
}

.instagram-icon {
  color: #E1306C;
}

.tiktok-icon {
  color: #000;
}

.mobile-icon {
  color: #27ae60;
}
</style>
