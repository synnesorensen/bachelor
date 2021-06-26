<template>
    <TabRegister></TabRegister>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TabRegister from '../components/LoginDialog/TabRegister.vue'

@Component({
	components: {
		TabRegister
	}
})


export default class LogIn extends Vue{};
</script>