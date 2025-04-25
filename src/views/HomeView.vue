<template>
  <div class="header">
    <Navbar/>
  </div>
  <div class="content">
    <BannerImage/>
    <ServiceView/>
    <MenuView/>
    <ContactInfo/>
    <LocationView/>
  </div>
</template>

<script>
/* eslint-disable */
import Navbar from '../components/NavBar.vue'
import BannerImage from '../components/BannerImage.vue';
import ServiceView from '../components/ServiceView.vue';
import MenuView from '../components/MenuView.vue';
import ContactInfo from '../components/ContactInfo.vue';
import LocationView from '../components/LocationView.vue';
export default {
  name: 'Home',
  components: {
    Navbar,
    BannerImage,
    ServiceView,
    MenuView,
    ContactInfo,
    LocationView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.header{
  position: fixed;
  z-index: 1000;
  height: 3.5rem;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
}
.content{
  position: relative;
  top: 3.5rem;
}
body{
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
