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
          <v-btn
            text
            color="green"
            @click="approve(selected)"
          >Godkjenn</v-btn>
          <v-btn
            text
            color="red"
            @click="decline(selected)"
          >Avvis</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="unapprovedUsers.length > 0">
      <v-card-title>
        Kunder til godkjenning
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
        :headers="unapprovedHeaders"
        :items="unapprovedUsers"
        :search="search"
        @click:row="handleClickedUser"
        item-key="userId"
        class="row-pointer"
      >
      </v-data-table>
    </v-card>
    <br />
    <v-card>
      <v-card-title>
        Kunder med abonnement
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
        :headers="usersubHeaders"
        :items="userSubscriptions"
        :search="search"
        @click:row="handleClickedUser"
        class="row-pointer"
      >
      </v-data-table>
    </v-card>
    <br />
    <v-card>
      <v-card-title>
        Kunder uten abonnement
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
        :headers="usersWOSubsHeaders"
        :items="usersWOSubscriptions"
        :search="search"
        @click:row="handleClickedUser"
        class="row-pointer"
      >
      </v-data-table>
    </v-card>
    <br />
    <v-card>
      <v-card-title>
        Avviste kunder
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
        :headers="unapprovedHeaders"
        :items="declinedUsers"
        :search="search"
        @click:row="handleClickedUser"
        class="row-pointer"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../../api/api";
import Component from "vue-class-component";
import { SubscriptionAction, UserSubscription } from "../../../../../common/interfaces";
import { UserDto } from "../../../../../common/dto";
import CustomerInfo from "./CustomerInfo.vue";
import { mdiCheckCircleOutline, mdiCloseCircleOutline  } from "@mdi/js";

@Component({
  components: {
    CustomerInfo,
  },
})
export default class CustomerLists extends Vue {
  private users: UserDto[] = [];
  private editCustomer = false;
  private selected: UserDto | null = null;
  private mdiCheckCircleOutline = mdiCheckCircleOutline;
  private mdiCloseCircleOutline = mdiCloseCircleOutline;
  private dialog = false;

  async created() {
    this.users = await api.getUsersAndSubscriptions();
  }

  get userSubscriptions() {
    const users = this.users.filter( user => {
      return (user.approved === "approved") && !!user.subscription;
    });
    if (users) {
      return users.map((user) => {
        if (user.subscription) {
          return {
            ...user,
            oldUser: user,
            days: user.subscription.schedule
              .map((schedule) => schedule.day)
              .join(", "),
            allergies: user.allergies.join(", "),
            pausedString: user.subscription.paused ? "Pauset" : "Aktiv",
          };
        }
      });
    }
  }

  get usersWOSubscriptions() {
    const usersWOSubs = this.users.filter((user) => {
      return (user.approved === "approved") && !user.subscription;
    });
    return usersWOSubs.map((user) => {
      return {
        ...user,
        oldUser: user,
        allergies: user.allergies.join(", "),
      };
    });
  }

  get unapprovedUsers() {
    const unapprovedUsers = this.users.filter((user) => {
      return (user.approved === "new");
    });
    return unapprovedUsers.map((user) => {
      return {
        ...user,
        oldUser: user,
        allergies: user.allergies.join(", "),
      };
    });
  }

  get declinedUsers() {
    const declinedUsers = this.users.filter((user) => {
      return (user.approved === "denied");
    });
    return declinedUsers.map((user) => {
      return {
        ...user,
        oldUser: user,
        allergies: user.allergies.join(", "),
      };
    });
  }

  private search = "";

  private usersubHeaders = [
    {
      text: "Navn",
      align: "start",
      sortable: true,
      value: "fullname",
    },
    { text: "Status", value: "pausedString", sortable: true },
    { text: "Adresse", value: "address" },
    { text: "Antall", value: "subscription.noOfMeals" },
    { text: "Allergier", value: "allergies" },
    { text: "Leveringsdager", value: "days" },
    { text: "", value: "controls", sortable: false },
  ];
  private unapprovedHeaders = [
    {
      text: "Navn",
      align: "start",
      sortable: true,
      value: "fullname",
    },
    { text: "Adresse", value: "address" },
    { text: "Allergier", value: "allergies" },
    { text: "Leveringsdager", value: "days" },
    { text: "", value: "controls", sortable: false },
  ];
  private usersWOSubsHeaders = [
    {
      text: "Navn",
      align: "start",
      sortable: true,
      value: "fullname",
    },
    { text: "Adresse", value: "address" },
    { text: "Allergier", value: "allergies" },
  ];

  deliveryDays(item: UserSubscription) {
    const days = item.schedule.map((menuItem) => {
      return menuItem.day;
    });
    return days.join(", ");
  }

  async approve(item: any) {
    try {
      await api.updateApproval(item.email, true,  this.selected!.note);
      item.oldUser.approved = "approved";
      item.oldUser.note =  this.selected!.note;
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
      this.editCustomer = false;
      this.users = await api.getUsersAndSubscriptions();
    }
  }
}
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>