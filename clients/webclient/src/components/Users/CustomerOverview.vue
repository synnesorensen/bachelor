<template>
    <main>
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
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
                            {{ $refs.calendar.title.toUpperCase() }}
                        </v-toolbar-title>
                    </v-toolbar>
                </v-sheet>
                <v-spacer></v-spacer>
                <v-sheet height="600">
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
                </v-sheet>
            </v-col>
            <v-col>
                <v-card v-if="!$store.getters.subscription.approved">
                    <v-card-title class="headline">
                        Velkommen til Lunsj på Hjul
                    </v-card-title>
                    <v-card-text>
                        Så snart det er blitt verifisert at du bor innenfor leveringsområdet til Lunsj på hjul, vil du motta faktura for kommende periode.
                        Når denne er betalt vil du kunne se dine leveranser i kalenderen. Ta kontakt med Lunsj på Hjul dersom det er noe du lurer på.   
                    </v-card-text>
                </v-card>
                <v-card v-if="selectedEvent && !selectedEvent.ordered">
                    <v-card-title class="headline">
                        {{selectedEvent.name + " " + toLocalPresentation(selectedDate)}}
                    </v-card-title>
                    <v-card-text>
                        Lunsj på Hjul tilbyr leveranse på denne dagen. Hvis du ønsker å abonnere på denne leveringen, endre ditt abonnement før neste periode starter.  
                    </v-card-text>
                </v-card>
                <v-card v-else-if="selectedEvent && !selectedEvent.delivery.cancelled">
                    <v-card-title class="headline">
                        {{selectedEvent.name + " " + toLocalPresentation(selectedDate)}}
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
                                        @click="cancelDelivery()"
                                        >
                                        Kanseller
                                    </v-btn>
                                </div>
                            </template>
                            <span>Det er for sent å avbestille denne leveringen</span>
                        </v-tooltip>
                    </v-card-actions>
                </v-card>
                <v-card v-else-if="selectedEvent">
                    <v-card-title class="headline">
                        {{selectedEvent.name + " " + toLocalPresentation(selectedDate)}}
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
import { Prop } from "vue-property-decorator";
import api from "../../api/api";
import { Delivery, Userprofile, Vendor, VendorSubscription } from "../../../../../server/src/interfaces";

@Component({})
export default class CustomerOverview extends Vue {
    private today = new Date().toISOString().substr(0, 10);
    private focus = new Date().toISOString().substr(0, 10);
    private type = "month";
    private start: any | null = null;
    private end: any | null = null;
    private events: any[] = [];
    private selectedEvent: any = null;
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

    async getEvents({ start, end }: { start: any; end: any }) {
        this.start = start;
        this.end = end;
        this.populateCalendar();
    }

    async populateCalendar() {
        const usersSub:VendorSubscription = this.$store.getters.subscription;
        const usersSchedule = usersSub.schedule;
        const vendor:Vendor = await api.getSingleVendor();
        const vendorDeliveries = await api.scheduleToDates(vendor.vendorId, this.start.date);

        let events: any[] = [];
        if (this.start && this.end) {
            let deliveries = await api.getAllUsersDeliveries(this.start.date, this.end.date);
            if (deliveries) {
                deliveries.forEach((del) => {
                    const delStart = new Date(`${del.deliverytime.substring(0, 10)}T00:00:00`);
                    const delEnd = new Date(`${del.deliverytime.substring(0, 10)}T23:59:59`);
                    const menu = usersSchedule.find(({ id }) => id == del.menuId);
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
            if (vendorDeliveries && !this.$store.getters.subscription.paused && this.$store.getters.subscription.approved) {
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
    }

    showEvent(event: any) {
        this.selectedEvent = event.event;
        this.selectedDate = event.day.date;
        console.log(this.selectedEvent)
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
    }

    // Kan implementeres hvis vendor ønsker å tilby ekstra kjøp. 
    async orderDelivery() {
        let delivery = {
            vendorId: this.selectedEvent.del.vendorId,
            userId: this.$store.getters.loggedInUser,
            deliverytime: this.selectedEvent.del.deliverytime,
            menuId: this.selectedEvent.del.menuId,
            cancelled: false
        }
        await api.putDelivery(this.$store.getters.subscription.vendorId, this.$store.getters.loggedInUser, delivery);
        // TODO: Håndtere regningen!?
    }

    toLocalPresentation(lastDeliveryDate: string) {
        const delDate = new Date(lastDeliveryDate);
        return delDate.toLocaleDateString();
    }
}
</script>