<template>
    <main>
	<v-row>
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
        <v-col>
            <Deliveries v-if="showDeliveries" :date="selectedDate"/>
        </v-col>
	</v-row>
    </main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Deliveries from './Deliveries.vue'
import  api from "../../api/api";

@Component({
	components: {
        Deliveries
    },
})
export default class AdminOverview extends Vue {
    private today = new Date().toISOString().substr(0, 10);
	private focus = new Date().toISOString().substr(0, 10);
	private type = "month";
	private start = null;
	private end = null;
    private events: any[] = [];
    private showDeliveries = false;
    private selectedDate = "";

    mounted() {
		this.focus = "";
	}
	viewDay(day: any) {
		this.focus = day.date;
		this.type = "day";
	}
	setToday() {
		this.focus = "";
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
        const userprofile = await api.getUserprofile();
        const vendor = await api.getVendor(userprofile!.email);
        let schedule = vendor!.schedule;
        let events: any[] = [];
        let deliveries = await api.getAllVendorsDeliveries(start.date, end.date, true);
        if (deliveries) {
            deliveries.forEach((del: any) => {
                const delStart = new Date(`${del.date.substring(0,10)}T00:00:00`);
                const delEnd = new Date(`${del.date.substring(0,10)}T23:59:59`);
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
        this.showDeliveries = true;
        this.selectedDate = event.day.date;
        console.log("I AdminOverview ", this.selectedDate)
    }
}
</script>
