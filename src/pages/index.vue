<script>
export default {
  name: 'check-auth',
  created() {
    this.fnStart()
  },
  methods: {
    fnStart() {
      window.location.href = '/Auth'
    }
  }
}
</script>
