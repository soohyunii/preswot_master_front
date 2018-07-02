<template>
<div class="image-wrapper">
    <img :src="require('@/assets/dev/ratio_4_3.png')">
</div>
</template>

<script></script>

<style>

.image-wrapper {
    position: relative;
    padding-bottom: 56.25%;
} 
.image-wrapper img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
}
  
  </style>