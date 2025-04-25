<template>
    <div class="menu-list">
      <!-- Filter Buttons -->
      <div class="filter-wrapper">
        <div class="filter-buttons">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
  
      <!-- Scroll Arrows (Desktop only) -->
      <div class="card-scroll-wrapper">
        <button class="scroll-btn left" @click="scroll('left')" v-show="!isMobile">‹</button>
        <div class="card-container" ref="scrollContainer">
          <div
            class="menu-card"
            v-for="item in filteredItems"
            :key="item.id"
            :class="{ selected: selectedItem === item.id }"
            @click="handleSelect(item.id)"
          >
            <img :src="item.image ? `/images/uploads/${item.image}`: '/images/noImage.jpeg'" class="card-img" />
            <div class="card-body">
              <h4>{{ item.name }}</h4>
              <p class="price">ghs{{ item.price.toFixed(2) }}</p>
              <p class="description">{{ item.description }}</p>
              <!-- <button class="edit-btn" @click="$emit('edit', item)">Edit</button> -->
            </div>
          </div>
        </div>
        <button class="scroll-btn right" @click="scroll('right')" v-show="!isMobile">›</button>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable */
  import { ref, computed, onMounted , defineProps, defineEmits} from 'vue';
  
  const props = defineProps({
    menuItems: Array
  });
  const emit = defineEmits(['edit']);
  
  const categories = ['Main', 'Extra', 'Drinks', 'Pastries'];
  const selectedCategory = ref('Main');
  const scrollContainer = ref(null);
  
  const selectedItem = ref(null);

    const handleSelect = (itemId) => {
        if (selectedItem.value == itemId){
            selectedItem.value = null
        }else{
            selectedItem.value = itemId
        }
        emit('edit', selectedItem.value);
    };
  const filteredItems = computed(() =>
    props.menuItems.filter((item) =>
      item.category?.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  );
  
  const scroll = (direction) => {
    const container = scrollContainer.value;
    if (!container) return;
    const scrollAmount = 240;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };
  
  const isMobile = ref(false);
  onMounted(() => {
    isMobile.value = window.innerWidth <= 768;
  });

  // const onImageError = (event) => {
  //   event.target.src = '/images/noImage.jpeg';
  // };
  </script>
  
  <style scoped>
  .menu-list {
    background-color: aliceblue;
    padding: 1rem;
  }
  
  /* Filter Buttons */
  .filter-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .filter-buttons button {
    padding: 0.3rem 0.7rem;
    font-size: 0.75rem;
    border-radius: 20px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .filter-buttons button.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
  
  .filter-buttons button:hover {
    background: #e0e0e0;
  }
  
  /* Cards Layout */
  .card-scroll-wrapper {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .card-container {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding: 0.5rem 0;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    max-height: 15rem;
  }
  
  .menu-card {
    flex: 0 0 auto;
    width: 180px;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    scroll-snap-align: start;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.menu-card.selected {
  border: 2px solid black;
}
  .card-img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  .card-body {
    padding: 0.5rem;
  }
  
  .card-body h4 {
    margin: 0 0 0.3rem;
    font-size: small;
  }
  
  .price {
    color: #007bff;
    font-weight: bold;
    font-size: 0.9rem;
    margin: 0.25rem 0;
  }
  
  .description {
    font-size: 0.75rem;
    color: #555;
    margin-bottom: 0.5rem;
  }
  
  .edit-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    background: #ffc107;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-btn:hover {
    background: #e0a800;
  }
  
  /* Scroll Buttons */
  .scroll-btn {
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  }
  
  .scroll-btn.left {
    left: -10px;
  }
  
  .scroll-btn.right {
    right: -10px;
  }
  
  @media (min-width: 769px) {
    .menu-list{
        position: relative;
        top: -2rem;
    }
    .scroll-btn {
      display: block;
    }
  }
  </style>
  