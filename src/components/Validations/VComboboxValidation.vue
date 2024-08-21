<template>
  <ValidationProvider v-slot="{ errors }" :name="$attrs.label" :rules="rules">
    <v-combobox
      v-model="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="(slot, name) in $scopedSlots" #[name]="item">
        <slot :name="name" v-bind="item" />
      </template>
    </v-combobox>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: null
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      this.innerValue = newVal
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  }
}
</script>
