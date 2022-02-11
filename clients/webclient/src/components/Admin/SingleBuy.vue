<template>
  <v-card>
    <v-app-bar dark color="success">
      <v-card-title>Leveranseforespørsler</v-card-title>
    </v-app-bar>
    <br />
    <v-data-table
      v-if="newRequests.length > 0"
      :headers="newRequestsHeaders"
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
    <v-data-table
      v-if="allRequests.length > 0"
      :headers="allRequestsHeaders"
      :items="allRequests"
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
    <v-card-text
      v-else
    >Det er ingen nye leveranseforespørsler.
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DeliveryRequestDto } from "../../../../../common/dto";
import api from "../../api/api";
import { toLocalPresentation } from "../../utils/utils";

@Component({
  components: {},
})

export default class SingleBuy extends Vue {
  private _selectedRequest: DeliveryRequestDto | null = null;

  get allRequests() {
    const reqs:DeliveryRequestDto[] = this.$store.getters.deliveryRequests;
    return reqs.map((req) => { 
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
      let status = "";
      if (req.approved === "new") {
        return {
          ...req,
          localTime: toLocalPresentation(req.deliverytime),
          status: "Ubehandlet",
          id: req.userId + req.deliverytime
        };
      }
    });
  }

  private newRequestsHeaders = [
    {
      text: "Dato",
      align: "start",
      sortable: true,
      value: "localTime"
    },
    {text: "Status", value: "status"},
    {text: "Navn", value: "fullname"},
    {text: "Adresse", value: "deliveryAddress"},
    {text: "", value: "controls", sortable: false },
  ]

    private allRequestsHeaders = [
    {
      text: "Dato",
      align: "start",
      sortable: true,
      value: "localTime"
    },
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