<template>
  <v-container>
    <v-row class="justify-center ma-6">
      <v-btn @click="datepickDialog = true">Velg dato</v-btn>
    </v-row>
    <v-dialog v-model="datepickDialog" max-width="400" max-height="800">
      <v-card>
        <v-card-title class="headline"> Leveringsdag: </v-card-title>
        <v-card-actions>
          <v-date-picker no-title :first-day-of-week="1" v-model="deliveryDate"></v-date-picker>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="justify-center ma-4">
      <v-col>
        <p 
          :class="{
            'h-6': $vuetify.breakpoint.smAndDown,
            'headline': $vuetify.breakpoint.mdAndUp,
          }"
        >Leveringer {{ localPresentation(deliveryDate) }}</p>
      </v-col>
    </v-row>
    <v-row class="justify-center ma-4">
      <v-col cols="12">
        <v-data-table
          v-if="$vuetify.breakpoint.smAndUp"
          :loading="loading"
          dense
          :headers="headers"
          :items="deliveryDetails"
          fixed-header
          @current-items="currentItems"
        >
          <template v-slot:item="{ item }">
            <tr :key="item.userId">
              <td class="handle">
                <v-btn icon><v-icon small>mdi-cursor-move</v-icon></v-btn>
              </td>
              <td>{{ item.fullname }}</td>
              <td>{{ item.deliveryAddress }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.box }}</td>
              <td>{{ item.noOfMeals }}</td>
              <td>
                {{ item.allergies ? item.allergies.toString() : "" }}
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-data-table
          v-if="$vuetify.breakpoint.xs"
          :loading="loading"
          dense
          :headers="mobileHeaders"
          :items="deliveryDetails"
          fixed-header
        >
        </v-data-table>

      </v-col>
    </v-row>
    <v-row class="justify-center" v-if="$vuetify.breakpoint.smAndUp">
      <v-btn class="mr-4" color="primary" :disabled="!deliveryDetails.length" @click="saveOrder()">Lagre rekkefølge</v-btn>
      <v-btn color="error" :disabled="isAllCancelled()" @click="cancelDialog = true">Kanseller alle</v-btn>
      <v-dialog v-model="cancelDialog" persistent max-width="300">
        <v-card>
          <v-card-title class="headline">Kansellering</v-card-title>
          <v-card-text>
            Er du sikker på at du vil kansellere alle leveranser denne dagen?
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="cancelDeliveries">
              Kanseller
            </v-btn>
            <v-btn color="error" @click="cancelDialog = false">
              Avbryt
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import { DeliveryDetail } from "../../../../../common/interfaces";
import { Watch } from "vue-property-decorator";
import Sortable from "sortablejs";
import { toLocalPresentation } from "../../utils/utils";

@Component({
  components: {},
})
export default class Deliveries extends Vue {
  private deliveryDate = new Date().toISOString().substr(0, 10);
  private datepickDialog = false;
  private loading = false;
  private cancelDialog = false;
  private start = "";
  private end = "";
  private deliveryDetails: DeliveryDetail[] = [];
  private sortedDeliveries: DeliveryDetail[] = [];
  @Watch("deliveryDate", { immediate: true })
  async onDateChanged() {
    if (this.deliveryDate) {
      let startDate = new Date(this.deliveryDate);
      let UTCStartDate = startDate.toISOString();
      let UTCEndDate = UTCStartDate.substr(0, 10) + "T23:59:59.000Z";
      this.loading = true;
      try {
        this.deliveryDetails = await api.getDeliveryDetails(
          UTCStartDate,
          UTCEndDate
        );

        this.deliveryDetails = this.deliveryDetails.map(del => {
          return {
            ...del,
            box: del.box.startsWith("E") ? "E" : "G"
          }
        })

      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
        this.datepickDialog = false;
      }
    }
  }
  private headers = [
    {
      text: "",
      align: "left",
      sortable: false,
    },
    {
      text: "Navn",
      align: "start",
      sortable: true,
      value: "fullname",
    },
    { text: "Adresse", value: "deliveryAddress" },
    { text: "Telefon", value: "phone" },
    { text: "Boks", value: "box" },
    { text: "Antall", value: "noOfMeals" },
    { text: "Allergier", value: "allergies" },
  ];

    private mobileHeaders = [
    {
      text: "Navn",
      align: "start",
      sortable: false,
      value: "fullname",
    },
    { text: "Adresse", value: "deliveryAddress",  sortable: false},
    { text: "Boks", value: "box", sortable: false },
    { text: "Antall", value: "noOfMeals", sortable: false },
  ];

  mounted() {
    let table = document.querySelector(
      ".v-data-table__wrapper tbody"
    ) as HTMLElement;
    const _self = this;
    if (table) {
      Sortable.create(table, {
        handle: ".handle",
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          if (oldIndex != undefined && newIndex != undefined) {
            const rowSelected = _self.deliveryDetails.splice(oldIndex, 1)[0];
            _self.deliveryDetails.splice(newIndex, 0, rowSelected);
          }
        },
      });
    }
  }

  currentItems(value: any) {
    this.sortedDeliveries = value;
  }

  async cancelDeliveries() {
    if (!(await api.cancelDeliveries(this.deliveryDetails, "vendor"))) {
      alert("Something went wrong");
    } else {
      this.$emit("update");
      this.deliveryDetails.forEach((del) => {
        del.cancelled = true;
      });
      this.cancelDialog = false;
    }
  }

  isAllCancelled() {
    return this.deliveryDetails.every(del => del.cancelled)
  }

  close() {
    this.$emit("close");
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }

  async saveOrder() {
    let sortedKeys = this.sortedDeliveries.map(user => user.userId);
    await api.updateOrder(sortedKeys, new Date(this.deliveryDate));
  }
}
</script>

<style scoped lang="css">
.handle {
  cursor: move !important;
  cursor: -webkit-grabbing !important;
}
</style>
