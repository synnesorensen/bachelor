<template>
  <v-container>
    <CustomerList 
      :users="users" 
      :headers="headers" 
      :title="title" 
      @update="updateUserData"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../../api/api";
import Component from "vue-class-component";
import CustomerList from "./CustomerList.vue";
import { Prop, Watch } from "vue-property-decorator";
import { MenuItems } from "../../../../../common/interfaces";
import { UserDto } from "../../../../../common/dto";

@Component({
  components: {
    CustomerList,
  },
})
export default class CustomerLists extends Vue {
  @Prop() typeOfUsersToShow!: string;
  private users: any[] = [];
  private allUsers: UserDto[] = [];
  private headers: any[] = [];
  private title = "";

  async updateUserData() {
    this.allUsers = await api.getUsersAndSubscriptions();
    this.$store.dispatch("refreshNewUserRequests");

    if (this.typeOfUsersToShow === "unapproved") {
      this.users = this.unapprovedUsers();
      this.headers = this.unapprovedHeaders;
      this.title = "Kunder til godkjenning";
    } else if (this.typeOfUsersToShow === "withoutSubscription") {
      this.users = this.usersWOSubscriptions();
      this.headers = this.usersWOSubsHeaders;
      this.title = "Kunder uten abonnement";
    } else if (this.typeOfUsersToShow === "withSubscription") {
      this.users = this.userSubscriptions();
      this.headers = this.usersubHeaders;
      this.title = "Kunder med abonnement";
    } else if (this.typeOfUsersToShow === "declined") {
      this.users = this.declinedUsers();
      this.headers = this.unapprovedHeaders;
      this.title = "Avviste kunder";
    }
  }

  @Watch("typeOfUsersToShow")
  async usersChanged() {
    this.updateUserData();
  }

  async created() {
    this.updateUserData();
  }

  userSubscriptions() {
    let users: any[] = [];
    try {
      users = this.allUsers.filter( user => {
        return (user.approved === "approved") && !!user.subscription;
      });
    } catch (err) {
      console.error(err);
    }
    return users.map((user) => {
      if (user.subscription) {
        return {
          ...user,
          oldUser: user,
          days: user.subscription.schedule
            .map((schedule: MenuItems) => schedule.day)
            .join(", "),
          allergiesInTable: user.allergies.join(", "),
          boxInTable: user.subscription.box.startsWith("E") ? "Engangs" : "Gjenbruk",
          pausedString: user.subscription.paused ? "Pauset" : "Aktiv",
        };
      }
    });
  }

  usersWOSubscriptions() {
    const usersWOSubs = this.allUsers.filter((user) => {
      return (user.approved === "approved") && !user.subscription;
    });
    return usersWOSubs.map((user) => {
      return {
        ...user,
        oldUser: user,
        allergiesInTable: user.allergies.join(", "),
      };
    });
  }

  unapprovedUsers() {
    const unapprovedUsers = this.allUsers.filter((user) => {
      return (user.approved === "new");
    });
    return unapprovedUsers.map((user) => {
      return {
        ...user,
        oldUser: user,
        allergiesInTable: user.allergies.join(", "),
        days: user.subscription?.schedule
          .map((schedule: MenuItems) => schedule.day)
          .join(", ")
      };
    });
  }

  declinedUsers() {
    const declinedUsers = this.allUsers.filter((user) => {
      return (user.approved === "denied");
    });
    return declinedUsers.map((user) => {
      return {
        ...user,
        oldUser: user,
        allergiesInTable: user.allergies.join(", "),
        days: user.subscription?.schedule
          .map((schedule: MenuItems) => schedule.day)
          .join(", ")};
    });
  }

  private usersubHeaders = [
    {
      text: "Navn",
      align: "start",
      sortable: true,
      value: "fullname",
    },
    { text: "Status", value: "pausedString", sortable: true },
    { text: "Leveringsadresse", value: "deliveryAddress" },
    { text: "Antall", value: "subscription.noOfMeals" },
    { text: "Allergier", value: "allergiesInTable" },
    { text: "Boks", value: "boxInTable"},
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
    { text: "Leveringsadresse", value: "deliveryAddress" },
    { text: "Allergier", value: "allergiesInTable" },
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
    { text: "Leveringsadresse", value: "deliveryAddress" },
    { text: "Allergier", value: "allergiesInTable" },
  ];

}
</script>