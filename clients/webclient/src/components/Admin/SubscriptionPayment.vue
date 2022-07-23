<template>
  <v-card>
    <v-app-bar dark color="success">
      <v-card-title>Valgt kunde</v-card-title>
    </v-app-bar>
    <br />
    <v-card-text v-if="!selectedUser">
      <v-row>
        <v-col>
          <p class="font-weight-medium">
            Velg en kunde fra listen til venstre.
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="selectedUser">
      <v-row dense>
        <v-col :xl="4" :lg="5">
          <p class="font-weight-medium">Navn</p>
        </v-col>
        <v-col>
          <p class="font-weight-light">
            {{ selectedUser.fullname }}
          </p>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col :xl="4" :lg="5">
          <p class="font-weight-medium">Siste betalte levering</p>
        </v-col>
        <v-col>
          <p class="font-weight-light">
            {{ isNaN(selectedUser.subscription.lastDeliveryDate) ? "Ingen" : localPresentation(selectedUser.subscription.lastDeliveryDate)}}
          </p>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col :xl="4" :lg="5">
          <p class="font-weight-medium">
            Ubetalte måltid i {{ selectedMonth  }}
          </p>
        </v-col>
        <v-col>
          <p class="font-weight-light">{{ unpaidDeliveries }}</p>
        </v-col>
      </v-row>
      <v-row dense>
        <v-btn class="ma-1" small @click="prev()">Forrige</v-btn>
        <v-btn class="ma-1" small @click="next()">Neste</v-btn>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="selectedUser">
      <v-btn @click="showPaymentDialog" color="success">
        Registrer betaling
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="datePickDialog = true" color="grey lighten-3">
        Leveranser
      </v-btn>
      <v-dialog
        v-model="datePickDialog"
        max-width="800"
        max-height="800"
        persistent
      >
        <v-card>
          <v-app-bar>
            <v-card-title class="headline"> Leveranser for {{selectedUser.fullname}} </v-card-title>
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
                  @blur="dateCheck" 
                />
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
              v-model="selectedDeliveries"
              v-if="deliveries && deliveries.length > 0"
              :headers="headers"
              :items="deliveriesWithMenu"
              item-key="deliverytime"
              show-select
              class="pt-2"
            >
              <template v-slot:item="{ item }">
                <tr :key="item.deliverytime">
                  <td>
                    <v-checkbox
                      v-model="selectedDeliveries"
                      :value="item"
                      class="align-center justify-center"
                    ></v-checkbox>
                  </td>
                  <td>{{ localPresentation(item.deliverytime) }}</td>
                  <td>{{ item.menu }}</td>
                  <td>{{ item.cancelled ? "Ja" : "Nei" }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions v-if="deliveries && deliveries.length">
            <v-btn
              @click="deleteDeliveries"
              :disabled="selectedDeliveries.length < 1"
              text
              color="error"
            >
              Slett
            </v-btn>
            <v-btn
              v-if="selectedDeliveries.length > 0"
              @click="cancelDel"
              text
              color="orange"
            >
              Kanseller
            </v-btn>
            <v-btn
              v-if="selectedDeliveries.length > 0"
              @click="activateDel"
              text
              color="orange"
            >
              Aktiver
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="close" text color="primary"> Lukk </v-btn>
          </v-card-actions>
        </v-card>
        <v-overlay absolute opacity="0.1" v-if="loading">
          <v-progress-circular indeterminate size="56"></v-progress-circular>
        </v-overlay>
      </v-dialog>
      <v-dialog v-model="paymentDialog" max-width="400" max-height="800">
        <v-card>
          <v-card-title class="headline"> Registrer betaling </v-card-title>
          <v-card-text>
            <p class="font-weight-medium">Navn</p>
            <p class="font-weight-regular">{{ selectedUser.fullname }}</p>
            <v-text-field
              v-model="paidDeliveries"
              label="Betalte leveringer"
            ></v-text-field>
            <p class="font-weight-medium">Sett første leveringsdato:</p>
            <v-date-picker 
              v-model="paymentPicker"
              no-title
            ></v-date-picker>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="paymentDialog = false">
              Avbryt
            </v-btn>
            <v-btn color="green darken-1" text @click="registerPayment()">
              Registrer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import api from "../../api/api";
import * as interfaces from "../../../../../common/interfaces";
import * as dto from "../../../../../common/dto";
import DatePicker from "../DatePicker.vue";
import CustomerInfo from "./CustomerInfo.vue";
import { toLocalPresentation, getMonth } from "../../utils/utils";

@Component({
  components: {
    DatePicker,
    CustomerInfo,
  },
})
export default class SubscriptionPayment extends Vue {
  private vendor: interfaces.Vendor = this.$store.getters.vendor;
  private vendorSchedule = this.vendor.schedule;
  private loading = false;
  @Prop() selectedUser!: dto.UserDto | null;
  private paymentDialog = false;
  private datePickDialog = false;
  private paymentPicker = new Date().toISOString().substr(0, 10);
  private startDate = "";
  private endDate = "";
  private selectedDeliveries: interfaces.Delivery[] = [];
  private paidDeliveries = 0;
  private unpaidDeliveries = 0;
  private deliveries: interfaces.Delivery[] | null = [];
  private monthOffset = 1;
  private errorMsg = "";
  private headers = [
    { text: "Dato", value: "deliverytime" },
    { text: "Meny", value: "menu" },
    { text: "Kansellert", value: "cancelled" },
  ];

  get selectedMonth() {
    return this.toYearMonth(this.nextMonth());
  }

  nextMonth() {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + this.monthOffset, 1);
  }
  async prev() {
    this.monthOffset--;
    this.updateUnpaidDeliveries();
  }
  async next() {
    this.monthOffset++;
    this.updateUnpaidDeliveries();
  }
  toYearMonth(date: Date) {
    let monthNo = date.getMonth() + 1;
    let month = monthNo.toString();
    if (monthNo < 10) {
      month = "0" + monthNo;
    }
    return date.getFullYear().toString() + "-" + month;
  }

  @Watch("selectedUser")
  async onChange() {
    if (this.selectedUser != null) {
      this.updateUnpaidDeliveries();
    }
  }

  userSelected(user: dto.UserDto) {
    this.selectedUser = user;
  }

  @Watch("datePickDialog")
  onShowDialog() {
    this.startDate = "";
    this.endDate = "";
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }

  async updateUnpaidDeliveries() {
    if (this.selectedUser?.subscription) {
      this.unpaidDeliveries = await api.getUnpaidDeliveries(
        this.selectedUser.subscription.userId,
        this.selectedMonth
      );
      this.paidDeliveries = this.unpaidDeliveries;
      this.selectedUser.subscription.lastDeliveryDate = await api.lastDelilveryDate(this.selectedUser.email);
    }
  }

  async registerPayment() {
    const now = new Date(this.paymentPicker);
    const time = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();
    
    if (this.selectedUser?.subscription?.userId) {
      let newDels = await api.postNewDeliveries(
        time,
        this.paidDeliveries,
        this.selectedUser.subscription.userId
      );
      this.selectedUser.subscription.lastDeliveryDate =
        newDels[newDels.length - 1].deliverytime;
      this.updateUnpaidDeliveries();
      this.paymentDialog = false;
    }
  }

  showPaymentDialog() {
    this.paymentPicker = this.selectedMonth + "-01";
    this.paymentDialog = true;
  }

  async dateCheck() {
    if (this.startDate && this.endDate && this.selectedUser?.subscription) {
      if (new Date(this.endDate) < new Date(this.startDate)) {
        this.errorMsg = "Fra dato kan ikke være etter til dato.";
      } else {
        this.loading = true;
        this.errorMsg = "";
        try {
          this.deliveries = await api.getOneUsersDeliveries(
            this.selectedUser.subscription.userId,
            this.startDate,
            this.endDate
          );
        } catch (err) {
          console.log(err);
        } finally {
            this.loading = false;
        }
      }
    }
  }

  async deleteDeliveries() {
    if (this.selectedUser?.subscription) {
      this.selectedDeliveries.forEach(async (del) => {
        await api.deleteDelivery(
          this.$store.getters.loggedInUser,
          del.userId,
          del.deliverytime
        );
        this.deliveries = await api.getOneUsersDeliveries(
          del.userId,
          this.startDate,
          this.endDate
        );
      });
      this.updateUnpaidDeliveries();
    }
  }

  get deliveriesWithMenu() {
    return this.deliveries!.map(del => {
      const menu = this.vendorSchedule.find(({ id }) => id === del.menuId);
      return {
        ...del,
        menu: menu!.menu
      };
    });
  }

  async cancelDel() {
    const updatedDeliveries: interfaces.Delivery[] = [];
    this.selectedDeliveries.forEach((del) => {
      del.cancelled = true;
      updatedDeliveries.push(del);
    });
    await api.updateDeliveries(updatedDeliveries);
  }

  async activateDel() {
    const updatedDeliveries: interfaces.Delivery[] = [];
    this.selectedDeliveries.forEach((del) => {
      del.cancelled = false;
      updatedDeliveries.push(del);
    });
    await api.updateDeliveries(updatedDeliveries);
  }

  close() {
    this.startDate = "";
    this.endDate = "";
    this.deliveries = [];
    this.selectedDeliveries = [];
    this.datePickDialog = false;
  }
}
</script>