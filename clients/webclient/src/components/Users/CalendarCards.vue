<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="auto">
        <v-card
          v-if="selectedEvent"
          :class="{ fixed: !$vuetify.breakpoint.xs }"
        >
          <v-card-title class="headline">
            {{
              selectedEvent &&
                selectedEvent.name + " " + localPresentation(selectedDate)
            }}
          </v-card-title>

          <v-card-text v-if="selectedEvent && selectedEvent.type === 'absence'">
            Lunsj på Hjul tilbyr ingen levering på denne dato.
          </v-card-text>
          <v-card-text
            v-else-if="
              selectedEvent &&
                selectedEvent.ordered &&
                selectedEvent.type === 'request'
            "
          >
            Denne bestillingen venter på godkjenning av Lunsj på Hjul.
          </v-card-text>
          <v-card-text
            v-else-if="
              selectedEvent &&
                selectedEvent.type === 'delivery' &&
                !selectedEvent.ordered &&
                cancelable
            "
          >
            Det er mulig å bestille frem til klokken 10:00 dagen før levering.
            Ønsker du å bestille
            <span class="font-weight-medium">
              {{
                selectedEvent &&
                  selectedEvent.name +
                    " den " +
                    localPresentation(selectedDate)
              }}?
            </span>
          </v-card-text>
          <v-card-text
            v-if="
              selectedEvent &&
                selectedEvent.type === 'delivery' &&
                !selectedEvent.ordered &&
                !cancelable
            "
          >
            Det er ikke mulig å bestille etter klokken 10:00 dagen før levering.
          </v-card-text>
          <v-card-text
            v-else-if="
              selectedEvent &&
                selectedEvent.type === 'delivery' &&
                selectedEvent.delivery.approved === 'denied'
            "
          >
            Forespørsel om levering denne dagen ble avslått.
          </v-card-text>
          <v-card-text
            v-else-if="
              selectedEvent &&
                selectedEvent.type === 'delivery' &&
                !selectedEvent.delivery.cancelled
            "
          >
            Det er mulig å avbestille et måltid frem til klokken 10:00 dagen før
            levering. Kansellerte måltid vil bli flyttet til neste måned, og
            faktura for neste periode vil bli justert i henhold til antall
            avbestillinger.
          </v-card-text>
          <v-card-text
            v-else-if="selectedEvent && selectedEvent.type === 'cancelled'"
          >
            Denne leveransen er kansellert. Dersom du har kansellert en
            leveranse og angrer, må du sende en mail til Lunsj på Hjul for å rette opp i det.
          </v-card-text>
          <v-card-actions>
            <v-tooltip :disabled="cancelable" bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    v-if="selectedEvent && selectedEvent.type !== 'absence'"
                    :disabled="!cancelable"
                    color="primary"
                    small
                    v-on="on"
                    @click="orderDialog = true"
                    class="mr-2"
                  >
                    Bestill
                  </v-btn>
                  <v-btn
                    v-if="
                      selectedEvent &&
                        selectedEvent.ordered &&
                        selectedEvent.type !== 'vendor'
                    "
                    :disabled="!cancelable"
                    color="primary"
                    small
                    v-on="on"
                    @click="cancelDialog = true"
                  >
                    Avbestill
                  </v-btn>
                </div>
              </template>
              <span
                v-if="
                  selectedEvent &&
                    selectedEvent.type === 'delivery' &&
                    !selectedEvent.delivery.cancelled
                "
              >
                Det er for sent å bestille denne leveringen.
              </span>
            </v-tooltip>
            <v-dialog v-model="orderDialog" persistent max-width="500">
              <v-card>
                <v-card-title class="headline">
                  {{ "Bestilling av " + selectedEvent.name }}</v-card-title
                >
                <v-card-text>
                  Velg antall måltid du ønsker levert
                  {{ localPresentation(selectedDate) }}
                  og en forespørsel vil bli sendt til Lunsj på Hjul.
                </v-card-text>
                <v-row no-gutters>
                  <v-col cols="3" class="ml-4">
                    <v-select
                      :menu-props="{ top: true, offsetY: true }"
                      v-model="noOfMeals"
                      :items="noOfMealsList"
                      solo
                    ></v-select>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-row no-gutters>
                    <v-col>
                      <v-btn
                        class="mr-2"
                        color="primary"
                        @click="orderDelivery()"
                      >
                        Bestill levering
                      </v-btn>
                      <v-btn color="#D3D3D3" @click="orderDialog = false">
                        Avbryt
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="cancelDialog" persistent max-width="500">
              <v-card>
                <v-card-title class="headline">Avbestilling</v-card-title>
                <v-card-text>
                  Velg antall måltid du ønsker å avbestille
                  {{ localPresentation(selectedDate) }}
                </v-card-text>
                <v-row no-gutters>
                  <v-col cols="3" class="ml-4">
                    <v-select
                      :menu-props="{ top: true, offsetY: true }"
                      v-model="noOfMealsToCancel"
                      :items="noOfMealsToCancelList"
                      solo
                    ></v-select>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-row no-gutters>
                    <v-col>
                      <v-btn
                        class="mr-2"
                        color="primary"
                        @click="cancelDelivery()"
                        >Avbestill levering</v-btn
                      >
                      <v-btn color="#D3D3D3" @click="cancelDialog = false">
                        Avbryt
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="errorDialog" persistent max-width="300">
              <v-card>
                <v-card-title class="headline">Feilmelding</v-card-title>
                <v-card-text>
                  Noe gikk galt. Prøv igjen senere, eller kontakt Lunsj på Hjul.
                </v-card-text>
                <v-card-actions>
                  <v-btn color="error" @click="errorDialog = false">
                    Lukk
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { toLocalPresentation } from "../../utils/utils";
import { Delivery } from "../../../../../common/interfaces";
import { DeliveryDto } from "../../../../../common/dto";
import api from "../../api/api";

@Component
export default class CalendarCards extends Vue {
  @Prop() event!: any | null;
  @Prop() date!: string;
  private selectedEvent: any | null = null;
  private selectedDate = "";
  private orderDialog = false;
  private cancelDialog = false;
  private errorDialog = false;
  private noOfMealsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private noOfMeals = 1;
  private errMsg = "";
  private noOfMealsToCancelList: number[] = [];
  private noOfMealsToCancel = 1;

  @Watch("event")
  eventChanged() {
    this.selectedEvent = this.event;
    this.noOfMealsToCancelList = Array.from(
      { length: this.selectedEvent.delivery.noOfMeals },
      (_, i) => i
    ).map((num) => num + 1);
  }

  @Watch("date")
  dateChanged() {
    this.selectedDate = this.date;
  }

  get cancelable() {
    if (this.selectedEvent.type !== "absence") {
      const dayBefore = new Date(this.selectedDate).setDate(
        new Date(this.selectedDate).getDate() - 1
      );
      const dayBeforeAt10 = new Date(dayBefore).setHours(10);
      return Date.now() < dayBeforeAt10;
    }
  }

  async cancelDelivery() {
    const deliveries: Delivery[] = [];
    deliveries.push(this.selectedEvent.delivery);
    if (this.selectedEvent.delivery.noOfMeals === this.noOfMealsToCancel) {
      if (!(await api.cancelDeliveries(deliveries, "user"))) {
        alert("Noe gikk gale, prøv igjen senere.");
      } else {
        this.$emit("update");
        this.selectedEvent.delivery.cancelled = true;
      }
      this.cancelDialog = false;
    } else {
      const newNoOfMeals =
        this.selectedEvent.delivery.noOfMeals - this.noOfMealsToCancel;
      const del = {
        ...this.selectedEvent.delivery,
        noOfMeals: newNoOfMeals,
      };
      try {
        await api.putDelivery(
          this.$store.getters.vendor.vendorId,
          this.$store.getters.loggedInUser,
          del
        );
        this.cancelDialog = false;
        this.$emit("update");
      } catch (err) {
        this.cancelDialog = false;
        this.errorDialog = true;
      }
    }
  }

  async orderDelivery() {
    const deliveryInDb = await api.getDelivery(
      this.$store.getters.vendor.vendorId,
      this.$store.getters.loggedInUser,
      this.selectedEvent.delivery.deliverytime
    );

    let delivery: DeliveryDto = {
      deliverytime: this.selectedEvent.delivery.deliverytime,
      menuId: this.selectedEvent.delivery.menuId,
      deliveryType: "single",
      noOfMeals: deliveryInDb ? this.noOfMeals + deliveryInDb.noOfMeals : this.noOfMeals,
    };
    try {
      await api.putDelivery(
        this.$store.getters.vendor.vendorId,
        this.$store.getters.loggedInUser,
        delivery
      );
      this.selectedEvent.ordered = true;
      this.orderDialog = false;
      this.$emit("update");
    } catch (err) {
      this.orderDialog = false;
      this.errorDialog = true;
    }
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }
}
</script>
