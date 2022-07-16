<template>
  <v-container>
    <v-dialog v-model="dialog" width="500">
      <v-card v-if="selected">
        <v-app-bar>
          <v-card-title>Kundeinformasjon</v-card-title><br />
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-app-bar>
        <br />
        <v-card-text>
          <CustomerInfo :selectedUser="selected" />
          <br />
          <v-textarea
            outlined
            label="Legg til notat"
            v-model="selected.note"
          ></v-textarea>
          <v-row class="justify-center">
            <v-btn
              v-if="selected && selected.subscription"
              text
              color="orange"
              @click="toggleSubscriptionPause()"
            >
              {{ buttonText }}
            </v-btn>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn text color="green" @click="approve(selected)">Godkjenn</v-btn>
          <v-btn text color="red" @click="decline(selected)">Avvis</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card :users="localUsers">
      <v-card-title>
        {{ localTitle }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Søk"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        dense
        :headers="localHeaders"
        :items="localUsers"
        :search="search"
        @click:row="handleClickedUser"
        item-key="userId"
        class="row-pointer"
      >
        <template v-slot:[`item.controls`]="props">
          <v-btn icon color="green" @click.stop="approve(props.item)">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ mdiCheckCircleOutline }}
                </v-icon>
              </template>
              <span>Godkjenn</span>
            </v-tooltip>
          </v-btn>
          <v-btn icon color="red" @click.stop="decline(props.item)">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ mdiCloseCircleOutline }}
                </v-icon>
              </template>
              <span>Avslå</span>
            </v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../../api/api";
import Component from "vue-class-component";
import { SubscriptionAction } from "../../../../../common/interfaces";
import { UserDto } from "../../../../../common/dto";
import CustomerInfo from "./CustomerInfo.vue";
import { mdiCheckCircleOutline, mdiCloseCircleOutline } from "@mdi/js";
import { Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    CustomerInfo,
  },
})
export default class CustomerList extends Vue {
  @Prop() users!: any[];
  @Prop() headers!: any[];
  @Prop() title!: string;
  private localUsers: any[] = [];
  private localHeaders: any[] = [];
  private localTitle = "";
  private editCustomer = false;
  private selected: UserDto | null = null;
  private mdiCheckCircleOutline = mdiCheckCircleOutline;
  private mdiCloseCircleOutline = mdiCloseCircleOutline;
  private dialog = false;
  private search = "";

  @Watch("users")
  usersChanged() {
    this.localUsers = this.users;
  }

  @Watch("headers")
  headersChanged() {
    this.localHeaders = this.headers;
  }

  @Watch("title")
  titleChanged() {
    this.localTitle = this.title;
  }

  async approve(item: any) {
    try {
      await api.updateApproval(item.email, true, this.selected!.note);
      item.oldUser.approved = "approved";
      item.oldUser.note = this.selected!.note;
      this.$store.dispatch("refreshNewUserRequests");
      this.dialog = false;
    } catch (err) {
      alert("Noe gikk galt, prøv igjen senere.");
      console.log(err);
    }
  }

  async decline(item: any) {
    try {
      await api.updateApproval(item.email, false, this.selected!.note);
      item.oldUser.approved = "denied";
      item.oldUser.note = this.selected!.note;
      this.$store.dispatch("refreshNewUserRequests");
      this.dialog = false;
    } catch (err) {
      alert("Noe gikk galt, prøv igjen senere.");
      console.log(err);
    }
  }

  handleClickedUser(user: UserDto) {
    this.selected = user;
    this.dialog = true;
  }

  get buttonText() {
    if (this.selected?.subscription?.paused) {
      return "Aktiver abonnement";
    }
    return "Pause abonnement";
  }

  async toggleSubscriptionPause() {
    if (this.selected && this.selected.subscription) {
      let time = new Date(Date.now());
      if (time.getHours() < 10) {
        time.setDate(time.getDate() + 1);
      } else {
        time.setDate(time.getDate() + 2);
      }
      let action: SubscriptionAction = {
        time: time.toISOString().substr(0, 10),
        action: this.selected.subscription.paused ? "unpause" : "pause",
      };
      await api.postSubscriptionAsVendor(
        this.selected.subscription.userId,
        action
      );
      this.editCustomer = false; // Hva gjør denne?
      this.localUsers = await api.getUsersAndSubscriptions();
    }
  }
}
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>