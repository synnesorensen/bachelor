<template>
	<calendar-overview></calendar-overview>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CalendarOverview from '../Calendar/CalendarOverview.vue'

@Component({
    components: {
		CalendarOverview,
    },
})
export default class AdminOverview extends Vue {

}
</script>
