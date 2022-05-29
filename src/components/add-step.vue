<template>
  <v-btn variant="outlined" color="secondary" prepend-icon="mdi-plus" @click="open = true">Add step</v-btn>
  <v-dialog v-model="open" persistent>
    <v-card>
      <v-container>
        <v-col class="min-w-[30vw]">
          <div class="text-h5 mb-12">New step</div>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="title" :rules="requiredRules" label="Title" autofocus required />
            <v-text-field
              v-model="delay" type="number" :step="1" :min="0" :max="100" :suffix="delayType" :rules="requiredRules" label="Delay"
              required
            />
            <v-slider v-model="delay" :step="1" :min="0" :max="100" color="orange" />
            <div class="h-2"></div>
            <v-radio-group v-model="delayType" inline>
              <v-radio label="Days" value="days" />
              <v-radio label="Hours" value="hours" />
            </v-radio-group>
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="open = false">Cancel</v-btn>
          <v-btn :disabled="!valid" variant="contained" color="primary" @click="submit()">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { Step } from '@/types'
import { requiredRules } from '@/utils/form-rules'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: 0,
    },
    at: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    open: false,
    valid: false,
    title: '',
    delay: 0,
    delayType: 'days',
    requiredRules,
  }),
  computed: {
    tailwindColors () {
      return Object.keys(colors).filter(color => !['transparent', 'inherit', 'current'].includes(color))
    },
  },
  methods: {
    submit () {
      console.log('submit step')
      const store = useStore()
      const step = new Step({
        title: this.title,
      })
      store.addStep(this.id, step, this.at)
      this.title = ''
      this.delay = 0
      this.delayType = 'days'
      this.open = false
    },
  },
})
</script>


<style>
.v-form>.v-input+.v-input .v-input__details {
  @apply mb-0;
}

.v-radio-group .v-input__details,
.v-slider .v-input__details {
  @apply hidden;
}
</style>
