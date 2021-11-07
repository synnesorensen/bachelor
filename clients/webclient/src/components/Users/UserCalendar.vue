<template>
    <main>
        <v-row>
            <v-col>
                <v-sheet>
                    <v-spacer></v-spacer>
                    <v-toolbar flat>
                        <v-btn
                            outlined
                            class="mr-4"
                            @click="setToday"
                        >
                            I dag
                        </v-btn>
                        <v-btn
                            fab
                            text
                            small
                            class="mr-4"
                            @click="prev"
                        >
                            <v-icon small>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            text
                            small
                            class="mr-4"
                            @click="next"
                        >
                            <v-icon small>mdi-chevron-right</v-icon>
                        </v-btn>
                        <v-toolbar-title v-if="$refs.calendar">
                            {{ $refs.calendar.title.charAt(0).toUpperCase() + $refs.calendar.title.slice(1) }}
                        </v-toolbar-title>
                    </v-toolbar>
                </v-sheet>
                <v-spacer></v-spacer>
                <v-sheet height="680">
                    <v-calendar
                        ref="calendar"
                        v-model="focus"
                        locale="no"
                        color="primary"
                        weekdays="1, 2, 3, 4, 5"
                        :events="events"
                        :now="today"
                        show-week
                        @click:event="showEvent"
                        @change="getEvents"
                    >
                    </v-calendar>
                    <v-overlay absolute opacity="0.1" v-if="showSpinner">
                        <v-progress-circular
                            indeterminate
                            size="64"
                        ></v-progress-circular>
                    </v-overlay>
                </v-sheet>
            </v-col>
            <v-col>
                <v-card :class="{'fixed': !$vuetify.breakpoint.xs}" v-if="selectedEvent && !selectedEvent.ordered">
                    <v-card-title class="headline">
                        {{selectedEvent.name + " " + localPresentation(selectedDate)}}
                    </v-card-title>
                    <v-card-text v-if="cancelable">
                        Det er mulig å bestille frem til klokken 10:00 dagen før levering. Ønsker du å bestille 
                        <p class="font-weight-medium">{{selectedEvent.name + " den " + localPresentation(selectedDate)}}?</p>
                    </v-card-text>
                    <v-card-text v-if="!cancelable">
                        Det er ikke mulig å bestille etter klokken 10:00 dagen før levering.
                    </v-card-text>
                    <v-card-actions>
                        <v-tooltip :disabled="cancelable" bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <v-btn 
                                        :disabled="!cancelable" 
                                        color="primary" 
                                        small 
                                        v-on="on"
                                        @click="orderDialog=true"
                                        >
                                        Bestill
                                    </v-btn>
                                </div>
                            </template>
                            <span>Det er for sent å bestille denne leveringen</span>
                        </v-tooltip>
                        <v-dialog v-model="orderDialog" persistent max-width="300">
                            <v-card>
                                <v-card-title class="headline">Bestilling</v-card-title>
                                <v-card-text>
                                    Er du sikker på at du vil bestille {{selectedEvent.name + " " + localPresentation(selectedDate)}} ?
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn 
                                        color="success"
                                        @click="orderDelivery()"
                                    > Bestill levering
                                    </v-btn>
                                    <v-btn
                                        color="error"
                                        @click="orderDialog=false"
                                    > Avbryt
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
                <v-card :class="{'fixed': !$vuetify.breakpoint.xs}" v-else-if="selectedEvent && !selectedEvent.delivery.cancelled">
                    <v-card-title class="headline">
                        {{selectedEvent.name + " " + localPresentation(selectedDate)}}
                    </v-card-title>
                    <v-card-text>
                        Det er mulig å avbestille en måltid frem til klokken 10:00 dagen før levering. 
                        Dersom du har kansellert en leveranse og angrer, kan du sende en mail til 
                        lunsj@hjul.no med informasjon om hvilken dato det gjelder. 
                        Kansellerte måltid vil bli flyttet til neste måned, og faktura for neste periode 
                        vil bli justert i henhold til antall avbestillinger. 
                    </v-card-text>
                    <v-card-actions>
                        <v-tooltip :disabled="cancelable" bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <v-btn 
                                        :disabled="!cancelable" 
                                        color="primary" 
                                        small 
                                        v-on="on"
                                        @click="cancelDialog=true"
                                        >
                                        Kanseller
                                    </v-btn>
                                </div>
                            </template>
                            <span>Det er for sent å avbestille denne leveringen</span>
                        </v-tooltip>
                        <v-dialog v-model="cancelDialog" persistent max-width="300">
                            <v-card>
                                <v-card-title class="headline">Avbestilling</v-card-title>
                                <v-card-text>
                                    Er du sikker på at du vil avbestille {{selectedEvent.name + " " + localPresentation(selectedDate)}} ?
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                        color="error"
                                        @click="cancelDialog=false"
                                    > Avbryt
                                    </v-btn>
                                    <v-btn 
                                        color="success"
                                        @click="cancelDelivery()"
                                    > Avbestill levering
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
                <v-card :class="{'fixed': !$vuetify.breakpoint.xs}" v-else-if="selectedEvent">
                    <v-card-title class="headline">
                        {{selectedEvent.name + " " + localPresentation(selectedDate)}}
                    </v-card-title>
                    <v-card-text>
                        Denne leveransen er kansellert. Dersom du har kansellert en leveranse og angrer, kan du sende en mail til 
                        lunsj@hjul.no med informasjon om hvilken dato det gjelder. 
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import { Delivery, Vendor, VendorSubscription } from "../../../../../common/interfaces";
import { toLocalPresentation } from "@/utils/utils";

@Component({})
export default class UserCalendar extends Vue {
    private today = new Date().toISOString().substr(0, 10);
    private focus = new Date().toISOString().substr(0, 10);
    private type = "month";
    private start: any | null = null;
    private end: any | null = null;
    private events: any[] = [];
    private selectedEvent: any = null;
    private selectedDate = "";
    private showSpinner = false;
    private cancelDialog = false;
    private orderDialog = false;

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

    async getEvents({ start, end }: { start: any; end: any }) {
        this.start = start;
        this.end = end;
        this.populateCalendar();
    }

    async populateCalendar() {
        this.showSpinner = true;
        const usersSub:VendorSubscription = this.$store.getters.subscription;
        const vendor:Vendor = await api.getVendor();
        const vendorSchedule = vendor.schedule;
        const vendorDeliveries = await api.scheduleToDates(vendor.vendorId, this.start.date);

        let events: any[] = [];
        if (this.start && this.end) {
            let deliveries = await api.getAllUsersDeliveries(this.start.date, this.end.date);
            if (deliveries) {
                deliveries.forEach((del) => {
                    const delStart = new Date(`${del.deliverytime.substring(0, 10)}T00:00:00`);
                    const delEnd = new Date(`${del.deliverytime.substring(0, 10)}T23:59:59`);
                    const menu = vendorSchedule.find(({ id }) => id == del.menuId);
                    events.push({
                        name: del.cancelled ? "Kansellert" : menu!.menu,
                        start: delStart,
                        end: delEnd,
                        color: new Date(del.deliverytime) < new Date(Date.now()) || del.cancelled ? "grey" : "green",
                        delivery: del,
                        ordered: true
                    });
                });
            }
            if (vendorDeliveries) {
                vendorDeliveries.forEach((del) => {
                    const delStart = new Date(`${del.deliverytime.substring(0, 10)}T00:00:00`);
                    const delEnd = new Date(`${del.deliverytime.substring(0, 10)}T23:59:59`);
                    const menu = vendor.schedule.find(({ id }) => id == del.menuId);
                    if (!deliveries?.find(({ deliverytime }) => deliverytime == del.deliverytime) && new Date(del.deliverytime) > new Date(Date.now())) {
                        events.push({
                            name: menu!.menu,
                            start: delStart,
                            end: delEnd,
                            color: "amber",
                            delivery: del,
                            ordered: false
                        });
                    }
                });
            }
            this.events = events;
        }
        this.showSpinner = false;
    }

    showEvent(event: any) {
        this.selectedEvent = event.event;
        this.selectedDate = event.day.date;
    }

    get cancelable() {
        const dayBefore = new Date(this.selectedDate).setDate(new Date(this.selectedDate).getDate() - 1);
        const dayBeforeAt10 = new Date(dayBefore).setHours(10);
        return Date.now() < dayBeforeAt10;
    }

    async cancelDelivery() {
        const deliveries: Delivery[] = [];
        deliveries.push(this.selectedEvent.delivery);
        if (!(await api.cancelDeliveries(deliveries))) {
            alert("Something went wrong");
        } else {
            this.populateCalendar();
            this.selectedEvent.delivery.cancelled = true;
        }
        this.cancelDialog = false;
    }

    async orderDelivery() {
        let delivery = {
            vendorId: this.selectedEvent.delivery.vendorId,
            userId: this.$store.getters.loggedInUser,
            deliverytime: this.selectedEvent.delivery.deliverytime,
            menuId: this.selectedEvent.delivery.menuId,
            cancelled: false
        }
        await api.putDelivery(this.$store.getters.subscription.vendorId, this.$store.getters.loggedInUser, delivery);
        this.selectedEvent.ordered = true;
        this.orderDialog = false;
        this.populateCalendar();
    }

    localPresentation(time: string) {
        return toLocalPresentation(time);
    }
}
</script>

<style scoped>

.fixed {
    position: fixed;
}

</style>