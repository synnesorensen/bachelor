<template>
  <v-card>
    <v-app-bar>
      <v-card-title
        >Leveringer for {{ localPresentation(date) }}</v-card-title
      >
      <v-spacer></v-spacer>
      <v-btn icon @click="close">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-row justify="center">
        <v-data-table
          :loading="loading"
          dense
          :headers="headers"
          :items="deliveryDetails"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr :key="item.userId">
              <td class="handle">
                <v-btn icon><v-icon small>mdi-cursor-move</v-icon></v-btn>
              </td>
              <td>{{ item.fullname }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.box }}</td>
              <td>{{ item.noOfMeals }}</td>
              <td>{{ item.allergies.toString() }}</td>
              <td>{{ item.cancelled ? "Ja" : "Nei" }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-row>
      <v-row justify="center">
        <v-card-actions class="justify-center">
          <v-btn color="error" @click="cancelDialog = true">Kanseller alle</v-btn>
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
        </v-card-actions>
      </v-row>
    </v-content>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import { DeliveryDetail } from "../../../../../common/interfaces";
import { Prop, Watch } from "vue-property-decorator";
import Sortable from "sortablejs";
import { toLocalPresentation } from "../../utils/utils";

@Component({
  components: {},
})
export default class Deliveries extends Vue {
  private loading = false;
  private cancelDialog = false;
  @Prop() date!: string;
  private start = "";
  private end = "";
  private deliveryDetails: DeliveryDetail[] = [];
  @Watch("date", { immediate: true })
  async onDateChanged() {
    if (this.date) {
      let startDate = new Date(this.date + "T00:00:00");
      let endDate = new Date(this.date + "T23:59:59");
      let UTCStartDate = startDate.toISOString();
      let UTCEndDate = endDate.toISOString();
      this.loading = true;
      try {
        this.deliveryDetails = await api.getDeliveryDetails(
          UTCStartDate,
          UTCEndDate
        );
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
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
    { text: "Adresse", value: "address" },
    { text: "Telefon", value: "phone" },
    { text: "Boks", value: "box" },
    { text: "Antall", value: "noOfMeals" },
    { text: "Allergier", value: "allergies" },
    { text: "Kansellert", value: "cancelled" },
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

  async cancelDeliveries() {
    if (!(await api.cancelDeliveries(this.deliveryDetails))) {
      alert("Something went wrong");
    } else {
      this.$emit("update");
      this.deliveryDetails.forEach((del) => {
        del.cancelled = true;
      });
      this.cancelDialog = false;
    }
  }

  close() {
    this.$emit("close");
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }
}
</script>

<style scoped>
.handle {
  cursor: move !important;
  cursor: -webkit-grabbing !important;
}

</style>