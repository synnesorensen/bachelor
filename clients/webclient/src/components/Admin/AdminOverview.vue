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
                <v-menu
                    v-model="selectedOpen"
                    :close-on-content-click="false"
                    :activator="selectedElement"
                    offset-x
                >
                    <v-card color="grey lighten-4" min-width="350px" flat >
                        <v-toolbar :color="selectedEvent.color" dark >
                            <v-toolbar-title v-html= "selectedEvent.name"></v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-card-actions>
                                <v-btn text color="secondary" @click="showDeliveries" > Leveringer </v-btn>
                                <v-btn text color="secondary" @click="cancelDelivery" > Kanseller levering </v-btn>
                            </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-menu>
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
import {Delivery, Userprofile} from '../../../../../server/src/interfaces'
import { Prop } from 'vue-property-decorator';

@Component({
	components: {
        Deliveries
    },
})
export default class AdminOverview extends Vue {
    @Prop() userprofile!: Userprofile;
    private today = new Date().toISOString().substr(0, 10);
	private focus = new Date().toISOString().substr(0, 10);
	private type = "month";
	private start = null;
	private end = null;
    private events: any[] = [];
    private showList = false;
    private selectedDate = "";
    private selectedEvent = {};
    private selectedElement = null;
    private selectedOpen = false;

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
        const vendor = await api.getVendor(this.userprofile!.email);
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
    
    showEvent ( {nativeEvent, event}:{nativeEvent: any, event: any} ) {
        const open = () => {
            this.selectedEvent = event;
            this.selectedElement = nativeEvent.target;
            requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
            this.selectedOpen = false
            requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
            open()
        }
        nativeEvent.stopPropagation()
    };

      showDeliveries(event:any) {
        this.selectedDate = event.day.date;
        this.showList = true;
        console.log("I AdminOverview ", this.selectedDate)
    }

    async cancelDelivery(event:any) {
        this.selectedDate = event.day.date;
        let deliveries = await api.getAllVendorsDeliveries(this.selectedDate, this.selectedDate);
        if (deliveries) {
            deliveries!.forEach((del: any) => {
                del.cancelled = true;
            });
            await api.updateDeliveries(deliveries as Delivery[]);
        }
    }
}
</script>
