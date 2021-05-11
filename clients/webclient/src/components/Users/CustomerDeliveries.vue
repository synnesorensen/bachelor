 <template>
         <v-row>
        <template>
            <v-dialog dialog="true" v-model="dialog" persistent max-width="290"> 
                <v-card>
                    <v-card-title class="headline">
                        Hå
                    </v-card-title> 
                    <v-card-text
                        > Hei
                    </v-card-text>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="dialog = false">
                        OK!
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="dialog = false">
                        Avbryt
                    </v-btn>
                </v-card>
                </v-dialog>
            </template>
        </v-row>

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import  api from "../../api/api";

@Component
export default class CustomerDeliveries extends Vue {
    private dialog = false;

}
</script>
