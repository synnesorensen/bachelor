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
            <v-toolbar-title v-if="$refs.calendar" style="cursor: pointer">
              {{
                $refs.calendar.title.charAt(0).toUpperCase() +
                $refs.calendar.title.slice(1)
              }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu fixed offset-y>
              <template v-slot:activator="{ on: menu, attrs }">
                <v-btn v-bind="attrs" v-on="menu" id="menuTab" color="primary">
                  Fravær
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="addAbsenceDialog = true">
                  <v-list-item-title>Legg til fravær</v-list-item-title>
                </v-list-item>
                <v-list-item @click="removeAbsenceDialog = true">
                  <v-list-item-title>Fjern fravær</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
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
            @change="getEvents"
          >
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>

    <v-dialog
      v-model="addAbsenceDialog"
      max-width="800"
      max-height="800"
      persistent
    >
      <v-card>
        <v-app-bar>
          <v-card-title :class="{
              'body-2': $vuetify.breakpoint.xs,
              'h4': $vuetify.breakpoint.mdAndDown,
              'h3': $vuetify.breakpoint.lgAndUp,
            }">
            Sett inn fravær i kalender
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addAbsenceDialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col>
              <p class="font-weight-medium">Fra dato:</p>
              <date-picker :date.sync="startDate" @blur="dateCheck" />
            </v-col>
            <v-col>
              <p class="font-weight-medium">Til dato:</p>
              <date-picker :date.sync="endDate" @blur="dateCheck" />
            </v-col>
          </v-row>
          <v-row>
            <p style="color: red">{{ errorMsg }}</p>
          </v-row>
          <v-card-actions>
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  @click="addAbsence"
                  :disabled="!canAddAbsence"
                  class="justify-center align-center"
                  >Legg til fravær</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      max-width="800"
      max-height="800"
      persistent
      v-model="removeAbsenceDialog"
    >
      <v-card>
        <v-app-bar>
          <v-card-title :class="{
              'body-2': $vuetify.breakpoint.xs,
              'h4': $vuetify.breakpoint.mdAndDown,
              'h3': $vuetify.breakpoint.lgAndUp,
            }"> Fravær denne måneden</v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="removeAbsenceDialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text class="mt-4">
          <v-row no-gutters>
            <v-col class="pl-4" cols="auto">
              <v-list flat>
                <v-list-item-group multiple>
                  <v-list-item v-for="day in absences" :key="day" class="pl-0">
                    <v-list-item-action>
                      <v-checkbox
                        :value="day"
                        :key="day"
                        v-model="selectedAbsence"
                        class="align-center justify-center"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        localPresentation(day)
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-action>
                  <v-btn
                    class="mt-4"
                    color="primary"
                    v-if="absences.length > 0"
                    @click="deleteAbsences"
                    >Fjern fravær</v-btn
                  >
                </v-list-item-action>
              </v-list>
            </v-col>
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
import DatePicker from "../DatePicker.vue";
import { toLocalPresentation } from "@/utils/utils";

@Component({
  components: {
    Deliveries,
    DatePicker,
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
  private showAbsence = false;
  private selectedDate = "";
  private addAbsenceDialog = false;
  private removeAbsenceDialog = false;
  private selectedAbsence: string[] = [];
  private absences: Date[] = [];
  private errorMsg = "";
  private startDate = "";
  private endDate = "";
  private canAddAbsence = false;

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
      const data = await Promise.all([
        api.getAllVendorsDeliveriesSummary(this.start.date, this.end.date),
        api.getAbsence(this.start.date, this.end.date),
      ]);
      const deliveries = data[0];
      const absenceDates = data[1];

      if (absenceDates) {
        absenceDates.forEach((absence) => {
          const start = new Date(absence);
          const end = new Date(absence);
          events.push({
            name: "Fri",
            start,
            end,
            color: "orange",
            type: "absence",
          });
          this.absences = absenceDates;
        });
      }
      if (deliveries) {
        deliveries.forEach((del) => {
          const delStart = new Date(`${del.date.substring(0, 10)}T00:00:00`);
          const delEnd = new Date(`${del.date.substring(0, 10)}T23:59:59`);
          const menu = schedule.find(({ id }) => id === del.menuId);
          events.push({
            name:
              menu!.menu + ": " + (del.count - del.cancelled) + "/" + del.count,
            start: delStart,
            end: delEnd,
            color:
              new Date(del.date) < new Date(Date.now()) ||
              del.count === del.cancelled
                ? "grey"
                : "green",
            type: "deliveries",
          });
        });
        this.events = events;
      }
    }
  }

  handleEventClick(event: any) {
    if (event.event.type === "deliveries") {
      this.selectedDate = event.day.date;
      this.showList = true;
    } else {
      this.selectedDate = event.day.date;
      this.showAbsence = true;
    }
  }

  async dateCheck() {
    if (this.startDate && this.endDate) {
      if (new Date(this.endDate) < new Date(this.startDate)) {
        this.errorMsg = "Fra dato kan ikke være etter til dato.";
        this.canAddAbsence = false;
      } else {
        this.errorMsg = "";
        this.canAddAbsence = true;
      }
    }
  }

  async addAbsence(event: any) {
    try {
      await api.setAbsence(this.startDate, this.endDate);
      this.addAbsenceDialog = false;
      this.startDate = "";
      this.endDate = "";
      this.populateCalendar();
    } catch (err) {
      console.log(err);
      this.startDate = "";
      this.endDate = "";
      this.errorMsg = "Noe gikk galt, kontakt administrator.";
    }
  }

  async deleteAbsences() {
    if (this.selectedAbsence) {
      this.selectedAbsence.forEach(async (ab) => {
        await api.deleteAbsence(ab);
        this.absences = await api.getAbsence(this.start, this.end);
        this.populateCalendar();
        this.removeAbsenceDialog = false;
      });
    }
  }

  deliveriesUpdated() {
    this.populateCalendar();
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }
}
</script>