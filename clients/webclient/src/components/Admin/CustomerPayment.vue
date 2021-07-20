<template>
    <v-card>
        <v-app-bar
            dark
            color="#79b321"
        >
            <v-card-title>Valgt kunde</v-card-title>
        </v-app-bar>
        <br />
        <v-card-text v-if="!selectedUser">
            <v-row>
                <v-col>
                    <p class="font-weight-medium"> Velg en kunde </p>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="selectedUser">
            <v-row dense>
                <v-col :xl="4" :lg="5">
                    <p class="font-weight-medium"> Navn </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.fullname }} </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col :xl="4" :lg="5">
                    <p class="font-weight-medium"> Adresse </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.address }} </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col :xl="4" :lg="5">
                    <p class="font-weight-medium"> Telefon </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.phone }} </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col :xl="4" :lg="5">
                    <p class="font-weight-medium"> Epost </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.email }} </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col :xl="4" :lg="5">
                    <p class="font-weight-medium"> Siste betalte levering </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{toLocalPresentation(selectedUser.lastDeliveryDate)}} </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col :xl="4" :lg="5" :sm="8" :xs="10">
                    <p class="font-weight-medium"> Ubetalte måltid i {{selectedMonth}} </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{unpaidDeliveries}} </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-btn class="ma-1" small @click="prev()">Forrige</v-btn>
                <v-btn class="ma-1" small @click="next()">Neste</v-btn>
            </v-row>
        </v-card-text>
        <v-card-actions v-if="selectedUser">
            <v-btn  
                @click="showPaymentDialog" 
                color="success"
            >
                Registrer betaling
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
                @click="showDatePickDialog"
                color="grey lighten-3"
            >
                Leveranser
            </v-btn>
            <v-dialog 
                v-model="datePickDialog" 
                max-width="800" 
                max-height="800"
            >
                <v-card>
                    <v-card-title class="headline">
                        Leveranser
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <p class="font-weight-medium"> Fra dato:</p>
                                <date-picker 
                                    :date.sync="startDate" 
                                    @blur="dateCheck"
                                />
                            </v-col>
                            <v-col>
                                <p class="font-weight-medium">Til dato:</p>
                                <date-picker 
                                    :date.sync="endDate"
                                    @blur="dateCheck" 
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <p style="color:red;">{{errorMsg}}</p>
                        </v-row>
                        <v-list dense v-if="deliveries && deliveries.length > 0">
                            <v-list-item v-for="del in deliveries" :key="del.deliverytime">
                                <v-list-item-content>
                                    <v-checkbox 
                                        v-model="selectedDeliveries"
                                        :value="del.deliverytime" 
                                        :key="del.deliverytime"
                                        :label="toLocalPresentation(del.deliverytime)"
                                        class="ml-3"
                                    >
                                    </v-checkbox>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions v-if="deliveries && deliveries.length">
                        <v-btn text color="error">Slett</v-btn>
                        <v-btn text color="primary">Kanseller</v-btn>
                        <v-btn text color="success">Sett aktiv</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog 
                v-model="paymentDialog" 
                max-width="400" 
                max-height="800"
            >
                <v-card>
                    <v-card-title class="headline">
                        Registrer betaling
                    </v-card-title>
                    <v-card-text>
                        <p class="font-weight-medium">Navn</p>
                        <p class="font-weight-regular">{{selectedUser.fullname}}</p> 
                        <v-text-field v-model="paidDeliveries" label="Betalte leveringer"></v-text-field>
                        <p class="font-weight-medium">Sett første leveringsdato: </p>
                        <v-date-picker
                            v-model="paymentPicker"
                            no-title
                            >
                        </v-date-picker>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="paymentDialog = false">
                        Avbryt
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="registerPayment()">
                        Registrer
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import api from '../../api/api'
import * as interfaces from "../../../../../server/src/interfaces";
import DatePicker from "./DatePicker.vue";

@Component({
	components: {
		DatePicker
	},
})

export default class CustomerPayment extends Vue {
    @Prop() selectedUser!:interfaces.UserSubscription | null; 
    private paymentDialog = false;
    private datePickDialog = false;
    private paymentPicker = new Date().toISOString().substr(0, 10);
    private startDate = "";
    private endDate = "";
    private selectedDeliveries: interfaces.Delivery[] = []
    private paidDeliveries = 0;
    private unpaidDeliveries = 0;
    private deliveries: interfaces.Delivery[] | null = null;
    private monthOffset = 1;
    private errorMsg = "";
    get selectedMonth() {
        return this.toYearMonth(this.nextMonth());
    }
    nextMonth() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth()+this.monthOffset, 1);
    }
    async prev() {
        this.monthOffset --;
        this.updateUnpaidDeliveries();
    }
    async next() {
        this.monthOffset ++;
        this.updateUnpaidDeliveries();
    }
    toYearMonth(date:Date) {
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

    async updateUnpaidDeliveries() {
        if (this.selectedUser?.lastDeliveryDate) {
            let date = this.selectedUser.lastDeliveryDate;
            let lastDelivery = new Date(date);
            let selectedDate = new Date(this.nextMonth());
            if (selectedDate.getTime() < lastDelivery.getTime()) {
                if (selectedDate.getMonth() == lastDelivery.getUTCMonth()
                    && selectedDate.getFullYear() == lastDelivery.getUTCFullYear()) {
                    this.unpaidDeliveries = await api.getUnpaidDeliveries(this.selectedUser.userId, this.selectedMonth, this.selectedUser.lastDeliveryDate);
                } else {
                    this.unpaidDeliveries = 0; 
                }
            } else {
                this.unpaidDeliveries = await api.getUnpaidDeliveries(this.selectedUser.userId, this.selectedMonth);
            }
            this.paidDeliveries = this.unpaidDeliveries;
        } else if (this.selectedUser) {
            this.unpaidDeliveries = await api.getUnpaidDeliveries(this.selectedUser.userId, this.selectedMonth);
            this.paidDeliveries = this.unpaidDeliveries;
        }
    }
    
    async registerPayment() {
        let time = new Date(this.paymentPicker).toISOString();
        if (this.selectedUser?.userId) {
            let newDels = await api.postNewDeliveries(time, this.paidDeliveries, this.selectedUser.userId);
            this.selectedUser.lastDeliveryDate = newDels[newDels.length-1].deliverytime;
            this.unpaidDeliveries = this.unpaidDeliveries - this.paidDeliveries;
            this.paymentDialog = false;
        }
    }

    showPaymentDialog() {
        this.paymentPicker = this.selectedMonth + "-01";
        this.paymentDialog = true;
    }

    async showDatePickDialog() {
        this.datePickDialog = true;
    }

    async dateCheck() {
        if (this.startDate && this.endDate) {
            if (new Date(this.endDate) < new Date(this.startDate)) {
                this.errorMsg = "Fra dato kan ikke være etter til dato."
            }
            if (this.selectedUser) {
                this.deliveries = await api.getOneUsersDeliveries(this.selectedUser.userId, this.startDate, this.endDate);
            }
        }
    }

    toLocalPresentation(lastDeliveryDate: string) {
        const delDate = new Date(lastDeliveryDate);
        return delDate.toLocaleDateString();
    }
}
</script>