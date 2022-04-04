<template>
  <v-container>
    <v-card>
      <v-card-title>Leveranseforespørsler</v-card-title>
      <br />
      <v-data-table
        v-if="newRequests.length > 0"
        :headers="headers"
        :items="newRequests"
        class="row-pointer"
        @click:row="showRequest"
      >
        <template v-slot:[`item.controls`]="props">
          <v-btn
            class="mx-1"
            dark
            x-small
            color="green"
            @click="approve(props.item)"
          >
            Godkjenn
          </v-btn>
          <v-btn
            class="mx-1"
            dark
            x-small
            color="red"
            @click="deny(props.item)"
          >
            Avvis
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
        <v-data-table
          :loading="loading"
          v-if="requests && requests.length > 0"
          :headers="headers"
          :items="allRequests"
          item-key="deliverytime"
          class="pt-2"
        >
          <template v-slot:[`item.controls`]="props">
            <v-btn
              class="mx-1"
              dark
              x-small
              color="green"
              @click="approve(props.item)"
            >
              Godkjenn
            </v-btn>
            <v-btn
              class="mx-1"
              dark
              x-small
              color="red"
              @click="deny(props.item)"
            >
              Avvis
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
import { Prop, Watch } from "vue-property-decorator";
import { DeliveryRequestDto } from "../../../../../common/dto";
import api from "../../api/api";
import DatePicker from "./DatePicker.vue";
import { toLocalPresentation } from "../../utils/utils";
import { Vendor } from "../../../../../common/interfaces";

@Component({
  components: {
    DatePicker,
  },
})

export default class SingleBuy extends Vue {
  private _selectedRequest: DeliveryRequestDto | null = null;
  private requests: DeliveryRequestDto[] | null = [];
  private startDate = "";
  private endDate = "";
  private errorMsg = "";
  private loading = false;
  private vendor: Vendor = this.$store.getters.vendor;
  private vendorSchedule = this.vendor.schedule;


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
    let touched = this.requests!.filter(req => {
      return req.approved !== "new"
    });
    return touched.map((req) => { 
      const menu = this.vendorSchedule.find(({ id }) => id == req.menuId);
      let status = "";
      if (req.approved === "approved") {
        status = "Godkjent";
      } else if (req.approved === "denied") {
        status = "Avslått";
      } else {
        status = "Ubehandlet";
      }
      return {
        ...req,
        localTime: toLocalPresentation(req.deliverytime),
        menu: menu!.menu,
        status,
        id: req.userId + req.deliverytime
      }
    });
  }

  get newRequests() {
    const newReqs:DeliveryRequestDto[] = this.$store.getters.deliveryRequests;
    const onlyNew = newReqs.filter((req) => {
      return req.approved === "new";
    });
    return onlyNew.map((req) => { 
      const menu = this.vendorSchedule.find(({ id }) => id == req.menuId);
      let status = "";
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
    {text: "Meny", value: "menu"},
    {text: "Status", value: "status"},
    {text: "Navn", value: "fullname"},
    {text: "Adresse", value: "deliveryAddress"},
    {text: "", value: "controls", sortable: false },
  ]

  get selectedRequest() {
    return this._selectedRequest;
  }

  set selectedRequest(value) {
    this._selectedRequest = value;
  }

  showRequest(req: DeliveryRequestDto) {
    this._selectedRequest = req;
    console.log(req);
  }

  async approve(item:any) {
    const action: "deny" | "approve" = "approve";
    let payload = {
      deliverytime: item.deliverytime,
      action,
      userId: item.userId
    }
    await api.handleDeliveryRequest(payload);
    this.$store.dispatch("refreshDeliveryRequests");
  }

  async deny(item:any) {
    const action: "deny" | "approve" = "deny";
    let payload = {
      deliverytime: item.deliverytime,
      action,
      userId: item.userId
    }
    await api.handleDeliveryRequest(payload);
    this.$store.dispatch("refreshDeliveryRequests");
  }

}
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>