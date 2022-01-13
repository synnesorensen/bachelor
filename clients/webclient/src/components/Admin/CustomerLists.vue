<template>
  <v-container>
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
        @click:row="handleClickedUserSub"
        class="row-pointer">
      </v-data-table>
    </v-card>
    <v-dialog width="unset" v-model="editCustomer">
      <v-card elevation="4" width="400">
        <v-app-bar>
          <v-card-title>Kundeinformasjon</v-card-title><br />
          <v-spacer></v-spacer>
          <v-btn 
            icon
            @click="editCustomer = false"  
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-app-bar><br />
        <v-card-text>
          <CustomerInfo :selectedUser="selected" />
        </v-card-text>
        <v-card-actions>
          <v-btn 
            text 
            color="orange"
            @click="toggleSubscriptionPause()"  
          >
            {{ buttonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        :search="search">
      </v-data-table>
    </v-card>
    <br />
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
        :headers="unapprovedHeaders"
        :items="unapprovedUsers"
        :search="search"
        item-key="userId"
        class="elevation-1"
        >
        <template v-slot:[`item.controls`]="props">
          <v-btn class="mx-2" fab dark small color="green" @click="approve(props.item)">
            <v-icon dark>mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import api from "../../api/api";
import Component from 'vue-class-component';
import { Action, UserSubscription } from '../../../../../common/interfaces';
import { UserDto } from '../../../../../common/dto';
import CustomerInfo from './CustomerInfo.vue';

@Component({
	components: {
    CustomerInfo
	}
})

export default class CustomerLists extends Vue {
  private users: UserDto[] = [];
  private editCustomer = false;
  private selected: UserDto | null = null;
  
  async created() {
    this.users = await api.getUsersAndSubscriptions();
  }

  get userSubscriptions() {
    const users = this.users.filter((user) => {
      return user.approved && !!user.subscription;
    });
    if (users) {
      return users.map((user) => {
        if (user.subscription) {
          return {
            oldUser: user,
            ...user,
            days: user.subscription.schedule.map(schedule => schedule.day).join(", "),
            allergies: user.allergies.join(", "),
            pausedString: user.subscription.paused? "Pauset" : "Aktiv"
          }
        }
      });
    }
  }

  get usersWOSubscriptions() {
    const usersWOSubs = this.users.filter(user => {
      return user.approved && !user.subscription
    })
    return usersWOSubs.map((user) => {
      return {
        ...user,
        allergies: user.allergies.join(", ")
      }
    });
  }

  get unapprovedUsers() {
    const unapprovedUsers = this.users.filter((user) => {
      return !user.approved;
    });
    return unapprovedUsers.map((user) => {
      return {
        oldUser: user,
        ...user,
        allergies: user.allergies.join(", ")
      }
    });
  }

  private search = "";
  
  private usersubHeaders = [
    {
      text: "Navn",
      align: 'start',
      sortable: true,
      value: "fullname",
    },
    { text: "Status", value: "pausedString", sortable: true },
    { text: "Adresse", value: "address" },
    { text: "Telefon", value: "phone" },
    { text: "Epost", value: "email" },
    { text: "Boks", value: "subscription.box" },
    { text: "Antall", value: "subscription.noOfMeals" },
    { text: "Allergier", value: "allergies" },
    { text: "Leveringsdager", value: "days" },
    { text: "", value: "controls", sortable: false }
  ];
  private unapprovedHeaders = [
    {
      text: "Navn",
      align: 'start',
      sortable: true,
      value: "fullname",
    },
    { text: "Adresse", value: "address" },
    { text: "Telefon", value: "phone" },
    { text: "Epost", value: "email" },
    { text: "Boks", value: "box" },
    { text: "Antall", value: "noOfMeals" },
    { text: "Allergier", value: "allergies" },
    { text: "Leveringsdager", value: "days" },
    { text: "", value: "controls", sortable: false }
  ];
  private usersWOSubsHeaders = [
    {
      text: "Navn",
      align: 'start',
      sortable: true,
      value: "fullname",
    },
    { text: "Adresse", value: "address" },
    { text: "Telefon", value: "phone" },
    { text: "Epost", value: "email" },
    { text: "Allergier", value: "allergies" }
  ];

  deliveryDays(item: UserSubscription) {
    const days = item.schedule.map((menuItem) => {
      return menuItem.day;
    });
    return days.join(", ")
  }
  
  async approve(item: any) {
    try {
      await api.updateApproval(item.email, true);
      item.oldUser.approved = true;           // TODO: Endre denne når interface er refaktorert.
    } catch (err) {
      alert("Noe gikk galt, prøv igjen senere.");
      console.log(err);
    }
  }

  handleClickedUserSub(user: UserDto) {
    this.selected = user;
    this.editCustomer = true;
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
      let action: Action = {
        time: time.toISOString().substr(0, 10),
        action: this.selected.subscription.paused ? "unpause" : "pause",
      };
      await api.postSubscriptionAsVendor(this.selected.subscription.userId, action);
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