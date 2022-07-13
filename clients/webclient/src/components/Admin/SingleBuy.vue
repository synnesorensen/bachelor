<template>
  <v-container>
    <v-card>
      <v-card-title>Leveranseforespørsler</v-card-title>
      <br />
      <v-data-table
        v-if="newRequests.length > 0"
        :headers="computedHeaders"
        :items="newRequests"
        class="no-hover"
      >
        <template v-slot:[`item.controls`]="props">
          <v-btn
            icon
            color="green"
            @click="approve(props.item)"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  {{mdiCheckCircleOutline}}
                </v-icon>
              </template>
              <span>Godkjenn</span>
            </v-tooltip>
          </v-btn>
          <v-btn
            icon
            color="red"
            @click="deny(props.item)"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  {{mdiCloseCircleOutline}}
                </v-icon>
              </template>
              <span>Avslå</span>
            </v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
      <v-card-text v-else>
        Det er ingen nye leveranseforespørsler.
      </v-card-text>
    </v-card>
    <br />
    <v-card>
      <v-card-title>Tidligere forespørsler</v-card-title>
      <v-card-text>
        <v-row dense>
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
        <v-row v-if="requests && requests.length > 0">
          <v-col></v-col>
          <v-col>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Søk"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <br />
        <v-data-table
          multi-sort
          :search="search"
          :loading="loading"
          v-if="requests && requests.length > 0"
          :headers="headers"
          :items="allRequests"
          item-key="deliverytime"
          class="no-hover"
        >
          <template v-slot:[`item.controls`]="props">
            <v-btn
              icon
              color="primary"
            >
              <v-menu
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="240px"
                min-width="240px"
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">{{mdiDotsHorizontal}}</v-icon>
                </template>
                <v-card>
                  <v-list dense>
                    <v-list-item>
                      <v-btn 
                        text 
                        @click="toggleApproval(props.item)"
                      >
                        {{props.item.approved === "approved" ? `Avslå` : `Godkjenn`}}
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn 
                        text 
                        @click="changePaymentStatus(props.item)"
                      >
                        {{props.item.paid === "paid" ? `Sett som ikke betalt` : `Sett som betalt`}}
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DeliveryRequestDto } from "../../../../../common/dto";
import api from "../../api/api";
import DatePicker from "../DatePicker.vue";
import { toLocalPresentation } from "../../utils/utils";
import { Vendor } from "../../../../../common/interfaces";
import { mdiDotsHorizontal, mdiCheckCircleOutline, mdiCloseCircleOutline  } from "@mdi/js";

@Component({
  components: {
    DatePicker,
  },
})

export default class SingleBuy extends Vue {
  private requests: DeliveryRequestDto[] | null = [];
  private startDate = "";
  private endDate = "";
  private errorMsg = "";
  private loading = false;
  private vendor: Vendor = this.$store.getters.vendor;
  private vendorSchedule = this.vendor.schedule;
  private mdiDotsHorizontal = mdiDotsHorizontal;
  private mdiCheckCircleOutline = mdiCheckCircleOutline;
  private mdiCloseCircleOutline = mdiCloseCircleOutline;
  private search = "";

  async dateCheck() {
    if (this.startDate && this.endDate) {
      if (new Date(this.endDate) < new Date(this.startDate)) {
        this.errorMsg = "Fra dato kan ikke være etter til dato.";
      } else {
        this.loading = true;
        this.errorMsg = "";
        try {
          this.requests = await api.getSelectedDeliveryRequests(this.startDate, this.endDate);
        } catch (err) {
          console.log(err);
        } finally {
          this.loading = false;
        }
      }
    }
  }

  get allRequests() {
    const touched = this.requests!.filter(req => {
      return req.approved !== "new"
    });
    return touched.map((req) => { 
      const menu = this.vendorSchedule.find(({ id }) => id == req.menuId);
      let status = "";
      let payment = "";
      if (req.approved === "approved") {
        status = "Godkjent";
      } else if (req.approved === "denied") {
        status = "Avslått";
      } else {
        status = "Ubehandlet";
      }
      if (req.paid === "paid") {
        payment = "Betalt";
      } else {
        payment = "Ikke betalt";
      }
      return {
        ...req,
        localTime: toLocalPresentation(req.deliverytime),
        menu: menu!.menu,
        status,
        payment,
        id: req.userId + req.deliverytime
      }
    });
  }

  get newRequests() {
    const newReqs:DeliveryRequestDto[] = this.$store.getters.newDeliveryRequests;
    return newReqs.map((req) => { 
      const menu = this.vendorSchedule.find(({ id }) => id == req.menuId);
      if (req.approved === "new") {
        return {
          ...req,
          localTime: toLocalPresentation(req.deliverytime),
          menu: menu!.menu,
          status: "Ubehandlet",
          id: req.userId + req.deliverytime
        };
      }
    });
  }

  private headers = [
    {
      text: "Dato",
      align: "start",
      sortable: true,
      value: "localTime"
    },
    {text: "Navn", value: "fullname"},
    {text: "Adresse", value: "deliveryAddress"},
    {text: "Meny", value: "menu"},
    {text: "Status", value: "status"},
    {text: "Betalt", value: "payment"},
    {text: "", value: "controls", sortable: false },
  ]

  get computedHeaders () {
      return this.headers.filter(header => header.text !== "Betalt")  
   }

  async approve(item:any) {
    const action: "deny" | "approve" = "approve";
    let payload = {
      deliverytime: item.deliverytime,
      action,
      userId: item.userId
    }
    await api.handleDeliveryRequest(payload);
    this.$store.dispatch("refreshNewDeliveryRequests");
    this.requests = await api.getSelectedDeliveryRequests(this.startDate, this.endDate);
  }

  async deny(item:any) {
    const action: "deny" | "approve" = "deny";
    let payload = {
      deliverytime: item.deliverytime,
      action,
      userId: item.userId
    }
    await api.handleDeliveryRequest(payload);
    this.$store.dispatch("refreshNewDeliveryRequests");
    this.requests = await api.getSelectedDeliveryRequests(this.startDate, this.endDate);
  }

  async toggleApproval(item:any) {
    if (item.approved === "approved") {
      const action: "deny" | "approve" = "deny";
      const payload = {
        deliverytime: item.deliverytime,
        action,
        userId: item.userId
      }
      await api.handleDeliveryRequest(payload);
    } else if (item.approved === "denied") {
      const action: "deny" | "approve" = "approve";
      const payload = {
        deliverytime: item.deliverytime,
        action,
        userId: item.userId
      }
    await api.handleDeliveryRequest(payload);
    }
    this.requests = await api.getSelectedDeliveryRequests(this.startDate, this.endDate);
  }

  async changePaymentStatus(item:any) {
    await api.payDelivery(item.userId, item.deliverytime, item.paid);
    this.requests = await api.getSelectedDeliveryRequests(this.startDate, this.endDate);
  }

}
</script>

<style lang="css" scoped>
.no-hover >>> tbody tr:hover {
  background-color: transparent !important;
}
</style>