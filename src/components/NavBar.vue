<template>
  <nav class="navbar">
    <div class="logo">
      <span>
        <img src="../../public/holyGrillLogo.jpeg" alt="">
      </span>
      <h4 class="nameTag">Holy Grill</h4> 
    </div>

    <div class="hamburger" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
    </div>

    <ul :class="['nav-links', { open: isMenuOpen }]">
      <li><a href="#home" @click.prevent="scrollToSection('home')">Home</a></li>
  <li><a href="#menu" @click.prevent="scrollToSection('menu')">Menu</a></li>
  <li><a href="#contacts" @click.prevent="scrollToSection('contacts')">Contact</a></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const headerOffset = 80; // Adjust this to match your fixed header height

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  closeMenu(); // Assuming you want to close the menu too
}

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>


<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem 0.5rem 0.4rem;
  color: black;
  font-family: 'Segoe UI', sans-serif;
  position: relative;
}

/* Logo styling */
.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
}
.logo img {
  height: 2.5rem;
}
.logo .nameTag {
  padding: 0;
  margin: 0.5rem 0.2rem;
  font-family: 'Sacramento', cursive;
  font-size: larger;
  font-weight: bold;
}

/* Nav links */
.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
  transition: max-height 0.3s ease-out;
}
.nav-links li a {
  color: black;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.nav-links li a:hover {
  color: #f39c12;
}

/* Hamburger button */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
}
.hamburger span {
  width: 25px;
  height: 3px;
  background-color: black;
  transition: all 0.3s ease;
}
.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Responsive behavior */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    display: none; /* hide completely */
    position: absolute;
    top: 70px;
    right: 32px;
    background-color: white;
    flex-direction: column;
    width: 200px;
    text-align: left;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-links.open {
    display: flex;
    opacity: 1;
  }

  .nav-links li {
    padding: 10px 16px;
  }

  .nav-links li a {
    display: block;
    width: 100%;
  }
}
</style>
