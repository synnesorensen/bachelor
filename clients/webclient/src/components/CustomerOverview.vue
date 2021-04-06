<template>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
        ></v-calendar>
      </v-sheet>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {getCustomers} from '../api/getCustomers'

@Component
export default class Customer extends Vue {
}

</script>
