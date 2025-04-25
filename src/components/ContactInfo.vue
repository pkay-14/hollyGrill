<template>
  <div class="contact-info" id="contacts">
    <span class="title"><h2>Contact Us</h2></span>

    <a
      class="contact-item"
      :href="`https://www.instagram.com/${contact.instagram}`"
      target="_blank"
      rel="noopener"
    >
      <i class="fab fa-instagram instagram-icon"></i>
      <span>{{ contact.instagram || 'N/A' }}</span>
    </a>

    <a
      class="contact-item"
      :href="`https://www.tiktok.com/@${contact.tiktok}`"
      target="_blank"
      rel="noopener"
    >
      <i class="fab fa-tiktok tiktok-icon"></i>
      <span>{{ contact.tiktok || 'N/A' }}</span>
    </a>

    <a
      v-if="isMobile"
      :href="`tel:${contact.mobile}`"
      class="contact-item"
    >
      <i class="fas fa-phone-alt phone-icon"></i>
      <span>{{ contact.mobile || 'N/A' }}</span>
    </a>
    <div v-else class="contact-item">
      <i class="fas fa-phone-alt phone-icon"></i>
      <span>{{ contact.mobile || 'N/A' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getContactInfo } from '../../api/api-calls'; // adjust path if needed

const isMobile = ref(false);
const contact = ref({
  instagram: '',
  tiktok: '',
  mobile: ''
});

// Fetch contact info from API
const fetchContactInfo = async () => {
  try {
    const { data } = await getContactInfo();
    if (data.length > 0) {
      contact.value = data[0];
    }
  } catch (error) {
    console.error('Failed to fetch contact info', error);
  }
};

onMounted(() => {
  isMobile.value = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  fetchContactInfo();
});
</script>

<style scoped>
.contact-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 5rem;
  padding: 1rem;
  box-sizing: border-box;
}

.contact-item {
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.contact-item i {
  font-size: 2rem;
  transition: transform 0.3s ease;
}

.contact-item:hover i {
  transform: scale(1.2);
}

/* 🎨 Icon-specific colors */
.instagram-icon {
  color: #e1306c; /* Instagram pink */
}

.tiktok-icon {
  color: #69c9d0; /* TikTok teal */
}

.phone-icon {
  color: #34af23; /* WhatsApp/Phone green */
}

@media (max-width: 768px) {
  .contact-info span.title {
    display: none;
  }
}
</style>
