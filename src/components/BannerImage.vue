<template>
    <div class="banner" id="home">
        <img src="../assets/jollof_banner.jpg" alt="">
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .banner{
        width: 100%;
        height: 20rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
    @media (max-width: 768px) {
        .banner{
            height: 15rem;
        }
    }
</style>