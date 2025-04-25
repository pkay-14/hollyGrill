<template>
  <div class="admin-layout">
    <!-- Hamburger -->
    <button class="hamburger" v-if="!sidebarVisible" @click="sidebarVisible = true">☰</button>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ visible: sidebarVisible }">
      <div class="sidebar-header">
        <!-- Logo and Name -->
        <div class="logo-container" @click="goToHome">
          <img class="logo" src="../../public/holyGrillLogo.jpeg" alt="Logo" />
          <h2 class="sidebar-name">Holy Grill</h2> <!-- Restaurant name -->
        </div>
      </div>

      <ul>
        <li :class="{ active: currentTab === 'contact' }" @click="selectTab('contact')">Contact Info</li>
        <li :class="{ active: currentTab === 'menu' }" @click="selectTab('menu')">Menu</li>
      </ul>

      <!-- Logout Button -->
      <button class="logout-btn" @click="logout">Logout</button>
    </aside>

    <!-- Main Content -->
    <section class="main-content" @click="handleMainClick">
      <ContactInfoForm v-if="currentTab === 'contact'" />
      <MenuInfoForm v-else />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ContactInfoForm from '@/components/admin/ContactInfoForm.vue';
import MenuInfoForm from '@/components/admin/MenuInfoForm.vue';
import { checkTokenValidity } from '../../api/api-calls'; // Assume this is your API function to check token validity

const router = useRouter();
const currentTab = ref(localStorage.getItem('currentTab') || 'contact');
const sidebarVisible = ref(false);

// Watch for changes in currentTab and save to localStorage
const selectTab = (tab) => {
  currentTab.value = tab;
  localStorage.setItem('currentTab', tab); // Save the selected tab to localStorage
  if (window.innerWidth <= 768) {
    sidebarVisible.value = false;
  }
};

const handleMainClick = () => {
  if (window.innerWidth <= 768 && sidebarVisible.value) {
    sidebarVisible.value = false;
  }
};

// Function to check if the auth token exists and is valid
const checkAuthToken = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // If there's no token, redirect to the login page
    router.push('/login');
  } else {
    try {
      const isValid = await checkTokenValidity(token); // Check if the token is valid via an API call
      if (!isValid) {
        // If the token is not valid, redirect to the login page
        router.push('/login');
      }
    } catch (error) {
      // If there's an error during the token validation (e.g., network failure), redirect to login
      console.error('Token validation failed:', error);
      router.push('/login');
    }
  }
};

// Function to handle logout
const logout = () => {
  localStorage.removeItem('authToken'); // Remove token from localStorage
  router.push('/login'); // Redirect to login page
};

// Function to navigate to the homepage
const goToHome = () => {
  router.push('/'); // Navigate to the homepage or the main page
};

onMounted(() => {
  // Check the auth token when the component is mounted
  checkAuthToken();

  // Ensure localStorage data is properly reflected on component mount
  currentTab.value = localStorage.getItem('currentTab') || 'contact';
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #f4f4f4;
  padding: 1.5rem;
  border-right: 1px solid #ddd;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures logout is at the bottom */
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.sidebar-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  margin-left: 10px;
}

.sidebar-name:hover {
  text-decoration: underline;
}

/* Sidebar list */
.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: background 0.2s ease;
}

.sidebar li:hover {
  background: #ddd;
}

.sidebar li.active {
  background: #cce5ff;
  font-weight: bold;
}

/* Logout Button */
.logout-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: auto; /* Pushes the button to the bottom */
  width: 100%;
}

.logout-btn:hover {
  background: #d32f2f;
}

/* Main content */
.main-content {
  flex: 1;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  transition: background 0.2s ease;
}

/* Hamburger */
.hamburger {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  z-index: 20;
  cursor: pointer;
}

/* Mobile */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    z-index: 10;
    width: 220px;
    background-color: #f4f4f4;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .sidebar.visible {
    transform: translateX(0);
    height: 95%;
  }

  .main-content {
    padding: 1rem;
    width: 100%;
  }
}
</style>
