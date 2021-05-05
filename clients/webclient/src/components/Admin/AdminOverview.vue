<template>
    <main>
    <div>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64">
				<v-spacer />
				<v-toolbar flat>
					<v-btn outlined @click="setToday"> I dag </v-btn>
					<v-btn fab text small @click="prev">
						<v-icon small>mdi-chevron-left</v-icon>
					</v-btn>
					<v-btn fab text small @click="next">
						<v-icon small>mdi-chevron-right</v-icon>
					</v-btn>
					<v-toolbar-title v-if="$refs.calendar">
						{{ $refs.calendar.title }}
					</v-toolbar-title>
				</v-toolbar>
			</v-sheet>
            <v-spacer />
			<v-sheet height="600">
				<v-calendar
					ref="calendar"
					v-model="focus"
					locale="no"
					color="primary"
					weekdays="1, 2, 3, 4, 5"
                    show-week
					:now="today"
                    :events="events"
                    @click:event="showEvent"
					@change="getEvents"
				>
				</v-calendar>
			</v-sheet>
		</v-col>
	</v-row>
    </div>
    <Deliveries v-if="showDeliveries" :date="selectedDate"/>
    </main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Deliveries from './Deliveries.vue'
import { getAllVendorsDeliveries, getUserprofile, getVendor } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"

@Component({
	components: {
        Deliveries
    },
})
export default class AdminOverview extends Vue {
    private today = new Date().toISOString().substr(0, 10);
	private focus = new Date().toISOString().substr(0, 10);
	private type = 'month';
	private start = null;
	private end = null;
    private events: any[] = [];
    private showDeliveries = false;
    private selectedDate = null;

    mounted() {
		this.focus = '';
	}
	viewDay(day: any) {
		this.focus = day.date;
		this.type = 'day';
	}
	setToday() {
		this.focus = '';
	}
	prev() {
		(this.$refs.calendar as any).prev();
	}
	next() {
		(this.$refs.calendar as any).next();
	}
	updateRange(range: any) {
		this.start = range.start;
		this.end = range.end;
	}

    async getEvents( {start, end}:{start:any, end:any} ) {
        const userprofile = await getUserprofile();
        const vendor = await getVendor(userprofile!.email);
        let schedule = vendor!.schedule;

        const events: any[] = [];
        const deliveries = await getAllVendorsDeliveries(start.date, end.date);
        if (deliveries) {
            deliveries.forEach((del) => {
            const delStart = new Date(`${del.deliverytime.substring(0,10)}T00:00:00`);
            const delEnd = new Date(`${del.deliverytime.substring(0,10)}T23:59:59`);
            const menu = schedule.find(({id}) => id == del.menuId);

            events.push({
                name: menu!.menu,
                start: delStart,
                end: delEnd, 
                color: "green"
            });
        });
        this.events = events;
        }
    }
    showEvent(event:any) {
        this.selectedDate = event.day.date;
        this.showDeliveries = true;
    }
}
</script>
