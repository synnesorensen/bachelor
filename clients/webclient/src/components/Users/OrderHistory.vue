<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Ordrehistorikk</v-card-title>
          <v-card-text>
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
              <v-checkbox
                v-if="startDate && endDate"
                v-model="showRejectedRequests"
                color="yellow"
                :label="showRejectedRequests ? `Vis avslåtte forespørsler` :  `Gjem avslåtte forespørsler`"
              ></v-checkbox>
            </v-card-actions>
              <v-data-table
                :loading="loading"
                v-if="deliveries && deliveries.length > 0"
                :headers="headers"
                :items="filteredDeliveries"
                item-key="deliverytime"
                :footer-props="{'items-per-page-options':[15, 30, 50, -1]}"
                class="pt-2"
                fixed-header
              >
            >
              </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DatePicker from "../DatePicker.vue";
import { toLocalPresentation } from "../../utils/utils";
import { Delivery, Vendor } from "../../../../../common/interfaces";
import api from "../../api/api";

@Component({
  components: {
    DatePicker,
  },
})

export default class OrderHistory extends Vue {
  private startDate = "";
  private endDate = "";
  private errorMsg = "";
  private loading = false;
  private deliveries: Delivery[] | null = [];
  private showRejectedRequests = false;
  private vendor: Vendor = this.$store.getters.vendor;
  private vendorSchedule = this.vendor.schedule;

  private headers = [
    {
      text: "Dato",
      align: "start",
      sortable: true,
      value: "localTime"
    },
    {text: "Meny", value: "menu"},
    {text: "Kansellert", value: "cancelled"},
    {text: "Type", value: "type"},
    {text: "Status", value: "status"},
    {text: "Betalt", value: "payment"}
  ];

    async dateCheck() {
    if (this.startDate && this.endDate) {
      if (new Date(this.endDate) < new Date(this.startDate)) {
        this.errorMsg = "Fra dato kan ikke være etter til dato.";
      } else {
        this.loading = true;
        this.errorMsg = "";
        try {
          this.deliveries = await api.getAllUsersDeliveries( this.startDate, this.endDate);
        } catch (err) {
          console.log(err);
        } finally {
          this.loading = false;
        }
      }
    }
  }
  
  get filteredDeliveries() {
    const deliveries = this.deliveries!.filter(del => {
      if (this.showRejectedRequests) {
        return del.approved !== "denied";
      }
      return true;
    });
    return deliveries!.map((del) => { 
      const menu = this.vendorSchedule.find(({ id }) => id == del.menuId);
      let status = "";
      let type = "";
      let payment = "";
      if (del.approved === "approved") {
        status = "Godkjent";
      } else if (del.approved === "denied") {
        status = "Avslått";
      } else {
        status = "Ubehandlet";
      }
      if (del.deliveryType === "sub") {
        type = "Abonnement";
      } else {
        type = "Enkeltkjøp";
      }
      if (del.paid === "paid") {
        payment = "Betalt";
      } else {
        payment = "Ikke betalt";
      }

      return {
        ...del,
        cancelled: del.cancelled ? "Ja" : "Nei",
        localTime: toLocalPresentation(del.deliverytime),
        status,
        type,
        payment, 
        menu: menu!.menu
      }
    });
  }
}
</script>
