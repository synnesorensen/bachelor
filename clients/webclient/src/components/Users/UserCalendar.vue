<template>
  <v-container fluid>
    <v-row>
      <v-col :xl="8" :lg="8" md="12" sm="12" xs="12">
        <v-sheet>
          <v-spacer></v-spacer>
          <v-toolbar flat>
            <v-btn outlined class="mr-4" @click="setToday"> I dag </v-btn>
            <v-btn fab text small class="mr-4" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small class="mr-4" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{
                $refs.calendar.title.charAt(0).toUpperCase() +
                $refs.calendar.title.slice(1)
              }}
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
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-sheet>
      </v-col>
      <v-col>
        <CalendarCards 
          :event.sync="selectedEvent" 
          :date.sync="selectedDate"
          @update="populateCalendar"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import { Vendor, Subscription } from "../../../../../common/interfaces";
import CalendarCards from "./CalendarCards.vue";

@Component({
  components: {
    CalendarCards
  }
})
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
  }

  async populateCalendar() {
    this.showSpinner = true;
    const usersSub: Subscription = this.$store.getters.subscription;
    const vendor: Vendor = this.$store.getters.vendor;
    const vendorSchedule = vendor.schedule;
    const events: any[] = [];

    if (this.start && this.end) {
      const data = await Promise.all([
        api.scheduleToDates(vendor.vendorId, this.start.date), 
        api.getAllUsersDeliveries(this.start.date, this.end.date), 
        api.getAbsence(this.start.date, this.end.date),
        api.getAway(this.start.date, this.end.date)
      ]);

      const vendorDeliveries = data[0];
      const deliveries = data[1];
      const absenceDates = data[2];
      const awayDates = data[3];

      if (deliveries) {
        deliveries.forEach((del) => {
          if (!(del.deliveryType === "single" && del.cancelled)) {
          const delStart = new Date(`${del.deliverytime.substring(0, 10)}T00:00:00`);
          const delEnd = new Date(`${del.deliverytime.substring(0, 10)}T23:59:59`);

          const menu = vendorSchedule.find(({ id }) => id == del.menuId);
          let color = "green";
          if (new Date(del.deliverytime) < new Date(Date.now()) || (del.deliveryType === "sub" && del.cancelled)) {
            color = "grey"; 
          } else if (del.approved === "new") {
            color = "orange";
          } else if (del.approved === "denied") {
            color = "red"
          } else if (del.deliveryType === "single" && del.approved === "approved") {
            color = "green"
          }

          events.push({
            name: del.cancelled ? "Kansellert" : menu!.menu,
            start: delStart,
            end: delEnd,
            color,
            delivery: del,
            ordered: true,
            type: "delivery"
          });
        }});
      }

      if (vendorDeliveries && this.$store.getters.userprofile.approved === "approved") {
        vendorDeliveries.forEach((del) => {
          const delStart = new Date(`${del.deliverytime.substring(0, 10)}T00:00:00`);
          const delEnd = new Date(`${del.deliverytime.substring(0, 10)}T23:59:59`);
          const menu = vendor.schedule.find(({ id }) => id == del.menuId);
          if (new Date(del.deliverytime) > new Date(Date.now())) {
            events.push({
              name: menu!.menu,
              start: delStart,
              end: delEnd,
              color: "amber",
              delivery: del,
              ordered: false,
              type: "delivery"
            })
          }
        });
      }
      if (absenceDates) {
        absenceDates.forEach(absence => {
          const start = new Date(absence);
          const end = new Date(absence);
          events.push({
            name: "Ingen leveranser",
            start,
            end,
            color: "blue",
            type: "absence"
          });
        })
      }
      if (awayDates) {
        awayDates.forEach(away => {
          const start = new Date(away);
          const end = new Date(away);
          events.push({
            name: "Fravær kunde",
            start,
            end,
            color: "blue",
            type: "away"
          });
        })
      }
      this.events = events;
    }
    this.showSpinner = false;
  }

  showEvent(event: any) {
    this.selectedEvent = event.event;
    this.selectedDate = event.day.date;
  }

}
</script>

<style scoped>
.fixed {
  position: fixed;
}
</style>