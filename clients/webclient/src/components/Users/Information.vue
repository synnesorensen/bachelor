<template>
    <v-container>
        <v-card v-if="!$store.getters.subscription.approved">
            <v-card-title class="headline">
                Velkommen til Lunsj på Hjul
            </v-card-title>
            <v-card-text>
                Så snart det er blitt verifisert at du bor innenfor leveringsområdet til Lunsj på hjul, vil du motta faktura for kommende periode.
                Når denne er betalt vil du kunne se dine leveranser i kalenderen. Ta kontakt med Lunsj på Hjul dersom det er noe du lurer på.   
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title class="headline">
                Spørsmål og svar
            </v-card-title>
            <v-card-text>
                  
            </v-card-text>
        </v-card>
    </v-container>
</template>

