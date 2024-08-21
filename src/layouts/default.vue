<script>
import LayoutVuetify from './layout'

export default {
  name: 'layout-default',
  components: {
    LayoutVuetify
  },
  created() {
    this.$parent.$emit('update:layout', LayoutVuetify);
  },
  render() {
    return this.$slots.default[0];
  }
}
</script>
