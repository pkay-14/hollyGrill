<template>
  <div>
    <!-- Swiper for Mobile -->
    <swiper v-if="isMobile"  
      :loop="true"
      :autoplay="{ delay: 3000 }"
      :pagination="{ clickable: true }"
      :space-between="5"
      :slides-per-view="1" 
      class="mobile-carousel">
      <swiper-slide v-for="(item, index) in cards" :key="index">
        <div class="card">
          <img :src="item.img" alt="">
          <div class="text-container">
            <h2>{{ item.title }}</h2>
            <!-- <p>{{ item.text }}</p> -->
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Grid Layout for Larger Screens -->
    <div v-else class="card-grid">
      <div class="card" v-for="(item, index) in cards" :key="index">
        <img :src="item.img" alt="">
        <span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import 'swiper/swiper-bundle.css';

// Register modules
SwiperCore.use([Autoplay, Pagination]);
export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768, // Determine if the screen size is mobile
      cards: [
        { title: 'For Vegans', text: 'short descriptive text', img: '/images/veganSpecial2.jpeg' },
        { title: 'Order Online', text: 'short descriptive text', img: '/images/orderMobile.png'},
        { title: 'Specials', text: 'short descriptive text', img: '/images/springrollSpecial.jpeg' }
      ]
    };
  },
  mounted() {
    // Watch for window resize events to toggle layout
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Clean up event listener when the component is destroyed
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 768; // Update isMobile when the window is resized
    }
  }
};
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 1rem;
  padding: 1rem;
}

.card {
  padding: 0.5rem;
  border-radius: 10px;
  height: 18rem;
  width: 100%;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card span {
  position: relative;
  top: -3.5rem;
  color: white;
}

.card h2 {
  margin: 0;
}

.card p {
  position: relative;
  top: -1rem;
}

/* Mobile carousel adjustments */
.mobile-carousel {
  padding: 1rem;
}

.text-container {
  position: absolute;
  bottom: 0.3rem;
  left: 0.5rem;
  right: 0.2rem;
  padding: 0.8rem;
  color: white;
  border-radius: 0 0 12px 12px;
}

.text-container h2 {
  margin: 0;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  /* Adjust text and carousel for smaller screens */
  .card {
    height: 12rem; /* Reduce height on mobile */
    width: 95%;
  }

  ::v-deep .swiper-pagination{
    display: none !important;
  }

  /* .text-container {
    font-size: 1rem;
    padding: 0.5rem;
    width: 89%;
    background-color: black;
  } */

  .text-container p {
    font-size: 0.8rem; /* Adjust paragraph size on mobile */
  }
}
</style>
