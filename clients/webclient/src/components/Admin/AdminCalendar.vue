<template>
  <v-container>
    <v-row justify="center">
      <v-col :xl="6">
        <v-sheet>
          <v-spacer />
          <v-toolbar flat>
            <v-btn outlined class="mr-4" @click="setToday"> I dag </v-btn>
            <v-btn fab text small class="mr-4" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small class="mr-4" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar" @click="showDialog" style="cursor: pointer">
              {{
                $refs.calendar.title.charAt(0).toUpperCase() +
                $refs.calendar.title.slice(1)
              }}
            </v-toolbar-title>
          </v-toolbar>
        </v-sheet>
        <v-spacer />
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            locale="no"
            color="amber"
            weekdays="1, 2, 3, 4, 5"
            show-week
            :now="today"
            :events="events"
            @click:date="showDialog"
            @click:event="showDeliveries"
            @change="getEvents"
          >
          </v-calendar>
        </v-sheet>
      </v-col>
      <v-dialog 
        fullscreen
        v-model="showList"
      >
        <Deliveries
          :date="selectedDate"
          @update="deliveriesUpdated"
          @close="showList = false"
        />
      </v-dialog>
    </v-row>
    <v-dialog
      v-model="datePickDialog"
      max-width="800"
      max-height="800"
      persistent
    >
      <v-card>
        <v-app-bar>
          <v-card-title class="headline"> Sett inn fravær i kalender </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-app-bar>
        <br />
        <v-card-text>
          <v-row>
            <v-col>
              <p class="font-weight-medium">Fra dato:</p>
              <date-picker
                :date.sync="startDate" 
                @blur="dateCheck" />
            </v-col>
            <v-col>
              <p class="font-weight-medium">Til dato:</p>
              <date-picker 
                :date.sync="endDate"
                @blur="dateCheck" />
            </v-col>
          </v-row>
          <v-row>
            <p style="color: red">{{ errorMsg }}</p>
          </v-row>
          <v-row justify="center">
            <v-btn 
              color="primary"
              class="mb-4"
              v-if="setAbsenceBtn" 
              @click="setAbsence"
            >Sett fravær</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Deliveries from "./Deliveries.vue";
import api from "../../api/api";
import DatePicker from "./DatePicker.vue";
import { toLocalPresentation } from "../../utils/utils";

@Component({
  components: {
    Deliveries,
    DatePicker
  },
})
export default class AdminCalendar extends Vue {
  private today = new Date().toISOString().substr(0, 10);
  private focus = new Date().toISOString().substr(0, 10);
  private type = "month";
  private start: any | null = null;
  private end: any | null = null;
  private events: any[] = [];
  private showList = false;
  private selectedDate = "";
  private datePickDialog = false;
  private startDate = "";
  private endDate = "";
  private errorMsg = "";
  private setAbsenceBtn = false;

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
    const vendor = await api.getVendor();
    const schedule = vendor!.schedule;
    const events: any[] = [];
    if (this.start && this.end) {
      const deliveries = await api.getAllVendorsDeliveriesSummary(
        this.start.date,
        this.end.date
      );
      const absenceDates = await api.getAbsence(this.start.date, this.end.date);
      if (absenceDates) {
        absenceDates.forEach(absence => {
          const start = new Date(absence);
          const end = new Date(absence);
          events.push({
            name: "Fri",
            start,
            end,
            color: "orange",
          });
        })
      }
      if (deliveries) {
        deliveries.forEach((del) => {
          const delStart = new Date(`${del.date.substring(0, 10)}T00:00:00`);
          const delEnd = new Date(`${del.date.substring(0, 10)}T23:59:59`);
          const menu = schedule.find(({ id }) => id == del.menuId);
          events.push({
            name:
              menu!.menu + ": " + (del.count - del.cancelled) + "/" + del.count,
            start: delStart,
            end: delEnd,
            color: del.count == del.cancelled ? "grey" : "green",
          });
        });
        this.events = events;
      }
    }
  }

  showDeliveries(event: any) {
    this.selectedDate = event.day.date;
    this.showList = true;
  }

  deliveriesUpdated() {
    this.populateCalendar();
  }

  showDialog() {
    // TODO: Se om det går an å sende inn valgt dato fra kalender til date-picker
    this.startDate = this.selectedDate;
    this.datePickDialog = true;
  }

  async setAbsence(event: any) {
    try {
      await api.setAbsence(this.startDate, this.endDate);
      this.datePickDialog = false;
      this.startDate = "";
      this.endDate = "";
    }
    catch (err) {
      console.log(err);
      this.startDate = "";
      this.endDate = "";
      this.errorMsg = "Noe gikk galt, kontakt administrator.";
    }
  }

  async dateCheck() {
    if (this.startDate && this.endDate) {
      if (new Date(this.endDate) < new Date(this.startDate)) {
        this.errorMsg = "Fra dato kan ikke være etter til dato.";
      } else {
        this.errorMsg = "";
        this.setAbsenceBtn = true;
      }
    }
  }

  close() {
    this.startDate = "";
    this.endDate = "";
    this.datePickDialog = false;
  }
}
</script>