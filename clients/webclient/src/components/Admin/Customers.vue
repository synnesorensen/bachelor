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
                :headers="headers"
                :items="activeUsers"
                :search="search"
                @click:row="handleClickedUser"
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
                    <CustomerInfo :selectedUser="selectedUser" />
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
                :headers="headersExtra"
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
import { Action, Userprofile, UserSubscription } from '../../../../../server/src/interfaces';
import CustomerInfo from './CustomerInfo.vue';
import { Watch } from 'vue-property-decorator';

@Component({
	components: {
        CustomerInfo
	}
})

export default class Customers extends Vue {
    private usersubs: UserSubscription[] = [];
    private users: Userprofile[] = [];
    private editCustomer = false;
    private selectedUser: UserSubscription | null = null;
    
    async created() {
        let usersubs = await api.getVendorSubscriptions();
        this.usersubs = usersubs.map((user) => {
            return {
                ...user, 
                days: this.deliveryDays(user)
            }
        });
    }

    @Watch("usersubs")
    async onChange() {
        this.activeUsers;
    }

    get activeUsers() {
        const approvedUsers = this.usersubs.filter((user) => {
            return user.approved;
        });
        return approvedUsers.map((user) => {
            return {
                ...user,
                allergies: user.allergies.join(", "),
                pausedString: user.paused? "Pauset" : "Aktiv"
            }
        });
    }

    get unapprovedUsers() {
        const unapprovedUsers = this.usersubs.filter((user) => {
            return !user.approved;
        });
        return unapprovedUsers.map((user) => {
            return {
                ...user,
                allergies: user.allergies.join(", ")
            }
        });
    }

    private search = "";
    private headers = [
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
        { text: "Boks", value: "box" },
        { text: "Antall", value: "noOfMeals" },
        { text: "Allergier", value: "allergies" },
        { text: "Leveringsdager", value: "days" },
        { text: "", value: "controls", sortable: false }
    ];
    private headersExtra = [
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

    deliveryDays(item: UserSubscription) {
        const days = item.schedule.map((menuItem) => {
            return menuItem.day;
        });
        return days.join(", ")
    }
    
    async approve(item: UserSubscription) {
        try {
            await api.updateApproval(item.userId, true);
            item.approved = true;
        } catch (err) {
            alert("Noe gikk galt, prøv igjen senere.");
            console.log(err);
        }
    }

    handleClickedUser(user: UserSubscription) {
        this.selectedUser = user;
        this.editCustomer = true;
    }

    get buttonText() {
        if (this.selectedUser?.paused) {
            return "Aktiver abonnement";
        }
        return "Pause abonnement";
    }

    async toggleSubscriptionPause() {
        if (this.selectedUser) {
            let time = new Date(Date.now());
            if (time.getHours() < 10) {
                time.setDate(time.getDate() + 1);
            } else {
                time.setDate(time.getDate() + 2);
            }
            let action: Action = {
                time: time.toISOString().substr(0, 10),
                action: this.selectedUser.paused ? "unpause" : "pause",
            };
            await api.postSubscriptionAsVendor(this.selectedUser.userId, action);
            this.editCustomer = false;
            this.usersubs = await api.getVendorSubscriptions();
        }
    }
}
</script>

<style lang="css" scoped>
    .row-pointer >>> tbody tr :hover {
        cursor: pointer;
    }
</style>