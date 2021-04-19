<template>
    <CalendarOverview />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CalendarOverview from './Calendar/CalendarOverview.vue';

@Component({
	components: {
		CalendarOverview,
	},
})
export default class CustomerOverview extends Vue {}
</script>
