<template>
	<v-sheet height="600">
		<v-calendar locale="no" color="primary"> </v-calendar>
	</v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class AdminOverview extends Vue {}
</script>
