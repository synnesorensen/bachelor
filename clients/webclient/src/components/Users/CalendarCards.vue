<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-if="selectedEvent && selectedEvent.type === 'absence'"
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text>
            Lunsj på Hjul tilbyr ingen levering på denne dato.
          </v-card-text>
        </v-card>
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-else-if="selectedEvent && selectedEvent.type === 'away'"
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text>
            Du har valgt å ikke få levering på denne dagen. 
          </v-card-text>
        </v-card>
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-else-if="selectedEvent && selectedEvent.type === 'delivery' && selectedEvent.ordered && selectedEvent.delivery.approved === 'new'"
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text>
            Denne bestillingen venter på godkjenning av Lunsj på Hjul. 
          </v-card-text>
        </v-card>
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-else-if="selectedEvent && selectedEvent.type === 'delivery' && !selectedEvent.ordered"
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text v-if="cancelable">
            Det er mulig å bestille frem til klokken 10:00 dagen før levering.
            Ønsker du å bestille
            <p class="font-weight-medium">
              {{
                selectedEvent.name + " den " + localPresentation(selectedDate)
              }}?
            </p>
          </v-card-text>
          <v-card-text v-if="!cancelable">
            Det er ikke mulig å bestille etter klokken 10:00 dagen før levering.
          </v-card-text>
          <v-card-actions>
            <v-tooltip :disabled="cancelable" bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    :disabled="!cancelable"
                    color="primary"
                    small
                    v-on="on"
                    @click="orderDialog = true"
                  >
                    Bestill
                  </v-btn>
                </div>
              </template>
              <span>Det er for sent å bestille denne leveringen.</span>
            </v-tooltip>
            <v-dialog v-model="orderDialog" persistent max-width="300">
              <v-card>
                <v-card-title class="headline">Bestilling</v-card-title>
                <v-card-text>
                  Ønsker du å bestille
                  {{
                    selectedEvent.name + " " + localPresentation(selectedDate)
                  }}
                  ? En forespørsel vil bli sendt til Lunsj på Hjul.
                </v-card-text>
                <v-card-actions>
                  <v-btn color="success" @click="orderDelivery()">
                    Bestill levering
                  </v-btn>
                  <v-btn color="error" @click="orderDialog = false">
                    Avbryt
                  </v-btn>
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
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-else-if="
            selectedEvent && selectedEvent.type === 'delivery' && selectedEvent.delivery.approved === 'denied'
          "
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text>
            Forespørsel om levering denne dagen ble avslått.
          </v-card-text>
        </v-card>
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-else-if="selectedEvent && selectedEvent.type === 'delivery' && !selectedEvent.delivery.cancelled"
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text style="width: 500px">
            Det er mulig å avbestille et måltid frem til klokken 10:00 dagen før
            levering. Kansellerte måltid vil bli flyttet til neste måned, og
            faktura for neste periode vil bli justert i henhold til antall
            avbestillinger.
          </v-card-text>
          <v-card-actions>
            <v-tooltip :disabled="cancelable" bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    :disabled="!cancelable"
                    color="primary"
                    small
                    v-on="on"
                    @click="cancelDialog = true"
                  >
                    Kanseller
                  </v-btn>
                </div>
              </template>
              <span>Det er for sent å avbestille denne leveringen</span>
            </v-tooltip>
            <v-dialog v-model="cancelDialog" persistent max-width="300">
              <v-card>
                <v-card-title class="headline">Avbestilling</v-card-title>
                <v-card-text>
                  Er du sikker på at du vil avbestille
                  {{
                    selectedEvent.name + " " + localPresentation(selectedDate)
                  }}
                  ?
                </v-card-text>
                <v-card-actions>
                  <v-btn color="error" @click="cancelDialog = false">
                    Avbryt
                  </v-btn>
                  <v-btn color="success" @click="cancelDelivery()">
                    Avbestill levering
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
        <v-card
          :class="{ fixed: !$vuetify.breakpoint.xs }"
          v-else-if="selectedEvent && selectedEvent.type === 'delivery' && selectedEvent.delivery.cancelled"
        >
          <v-card-title class="headline">
            {{ selectedEvent.name + " " + localPresentation(selectedDate) }}
          </v-card-title>
          <v-card-text>
            Denne leveransen er kansellert. Dersom du har kansellert en
            leveranse og angrer, kan du trykke på Angre-knappen under. En
            forespørsel vil bli sendt til Lunsj på Hjul om å endre
            kanselleringen og du får svar på forespørselen på e-post.
          </v-card-text>
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
  @Prop() event: any | null = null;
  @Prop() date = "";
  private selectedEvent: any | null = null;
  private selectedDate = "";
  private cancelDialog = false;
  private orderDialog = false;
  private errorDialog = false;

  @Watch("event")
  eventChanged() {
    console.log(this.$store.getters.subscription.vendorId);
    this.selectedEvent = this.event;
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
    if (!(await api.cancelDeliveries(deliveries, "user"))) {
      alert("Noe gikk gale, prøv igjen senere.");
    } else {
      this.$emit("update");
      this.selectedEvent.delivery.cancelled = true;
    }
    this.cancelDialog = false;
  }

  async orderDelivery() {
    let delivery: DeliveryDto = {
      deliverytime: this.selectedEvent.delivery.deliverytime,
      menuId: this.selectedEvent.delivery.menuId,
      deliveryType: "single",
    };
    try {
      await api.putDelivery(
        this.$store.getters.subscription.vendorId,
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
