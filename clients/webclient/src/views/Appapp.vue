<template>
    <AppBar></AppBar>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AppBar from '../components/AppBar.vue';

@Component({
	components: {
		AppBar
	}
})


export default class Appapp extends Vue{};
</script>