<template>
    <LoginDialog v-if="!authorized" @loggedIn="loggedIn" :showDialog="!authorized" />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from '../components/LoginDialog/LoginDialog.vue'

@Component({
	components: {
		LoginDialog
	}
})


export default class LogIn extends Vue{};
</script>
