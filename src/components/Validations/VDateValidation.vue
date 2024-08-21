<template>
  <v-menu
    ref="dialog"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template #activator="{ on }">
      <ValidationProvider v-slot="{ errors }" :name="$attrs.label" :rules="rules">
        <v-text-field
          v-model="innerValue"
          :error-messages="errors"
          v-bind="$attrs"
          persistent-hint
          v-on="on"
          @blur="date = parseDate(innerValue)"
        />
      </ValidationProvider>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      locale="vi-VN"
      @input="menu = false"
    />
  </v-menu>
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
    innerValue: null,
    menu: false,
    date: null
  }),
  watch: {
    date(newVal) {
      this.innerValue = this.formatDate(newVal)
      this.$emit('input', newVal)
    },
    value(val) {
      this.date = val
    }
  },
  created() {
    if (this.value) {
      this.date = this.value
    }
  },
  methods: {
    formatDate(date) {
      try {
        if (!date || date === 'Invalid date') { return null }
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      } catch (e) {
        this.date = null
        this.innerValue = null
      }
    },
    parseDate(date) {
      try {
        if (!date) { return null }
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } catch (e) {
        this.date = null
        this.innerValue = null
      }
    }
  }
}
</script>

<style scoped>

</style>
