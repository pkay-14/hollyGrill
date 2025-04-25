<template>
    <div class="menu-container">
      <button class="scroll-btn left" @click="scroll('left')">◀</button>
  
      <div ref="scrollContainer" class="menu-row" @click="clearSelected">
        <div
          v-for="item in props.menuItems"
          :key="item.id"
          class="menu-card"
          :class="{ selected: selectedItem === item.id }"
          @click="selectItem(item.id)"
        >
          <img :src="item.image ? `/images/uploads/${item.image}`:'/images/noImage.jpeg'" :alt="item.name" class="menu-image"/>
          <div class="menu-details">
            <h3 class="menu-name">{{ item.name }}</h3>
            <p class="menu-price">ghs{{ item.price.toFixed(2) }}</p>
  
            <transition name="fade-slide">
              <div v-if="selectedItem === item.id" class="menu-extra">
                <p class="menu-description">{{ item.description }}</p>
                <a class="add-button" :href="`tel:+233 501076005`" @click.stop>
                  Call
                  <i class="fas fa-phone-alt phone-icon"></i>
                </a>
              </div>
            </transition>
          </div>
        </div>
      </div>
  
      <button class="scroll-btn right" @click="scroll('right')">▶</button>
    </div>
  </template>
<script setup>
import { ref, defineProps} from "vue";

const props = defineProps({
  menuItems: Array,
});

const scrollContainer = ref(null)
const selectedItem = ref(null)

const selectItem = (id) => {
  selectedItem.value = selectedItem.value === id ? null : id
}

const clearSelected = (event) => {
  if (event.target === event.currentTarget) {
    selectItem(null)
  }
}

const scroll = (direction) => {
  const container = scrollContainer.value
  if (!container) return

  const scrollAmount = container.clientWidth / 2 // scroll half a row
  container.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  })
}
</script>
<style scoped>
/* === Container for scroll + arrows === */
.menu-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 20rem;
}

/* === Arrow buttons === */
.scroll-btn {
  background: transparent;
  border: 2px solid orange;
  color: orange;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.scroll-btn:hover {
  background-color: rgba(255, 165, 0, 0.1); /* light orange */
  transform: scale(1.1);
}
.scroll-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.scroll-btn.left {
  margin-right: 0.5rem;
}
.scroll-btn.right {
  margin-left: 0.5rem;
}

/* === Scrollable card row === */
.menu-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  max-width: 100%;
  flex: 1;
  height: 100%;

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
}
.menu-row::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

/* === Menu card === */
.menu-card {
  flex: 0 0 auto;
  width: 180px;
  height: fit-content;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: black;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.menu-card.selected {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* === Image and content === */
.menu-image {
  width: 100%;
  height: 9rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.menu-name {
  position: relative;
  top: -0.4rem;
  font-size: small;
  margin: 0;
}

.menu-price {
  margin: -3px 0 0 0;
  color: orange;
  /* font-weight: bold; */
}

.menu-extra {
  margin-top: 0.5rem;
}

.menu-description {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.add-button {
  background-color: lightgreen;
  text-decoration: none;
  border: 1px solid black;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  color: black;
  transition: background 0.2s ease;
}
.add-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* === Fade animation for extra content === */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* === Responsive tweak (optional) === */
@media (max-width: 768px) {
  .menu-card {
    width: 140px;
  }
}
</style>

  