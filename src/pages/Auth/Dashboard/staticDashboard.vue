<script>

export default {
  data() {
    return {
      data: []
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios.get('auth/khao-sat/thong-ke/danh-hieu-van-hoa', {
        params: {}
      }).then((res) => {
        this.data = res.data.data
      })
    },
  }
}
</script>

<template>
  <v-simple-table
      class="elevation-1">
    <thead>
    <tr>
      <th rowspan="2">Năm</th>
      <th colspan="3">Xã, Phường, Thị trấn tiêu biểu</th>
      <th colspan="3">Khóm, Ấp văn hóa</th>
    </tr>
    <tr>
      <th>Tổng số</th>
      <th>Đạt chuẩn</th>
      <th>Tỉ lệ</th>
      <th>Tổng số</th>
      <th>Đạt chuẩn</th>
      <th>Tỉ lệ</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) of data" :key="index">
      <td>{{ item.nam }}</td>
      <td>{{ item.xp_tong_so }}</td>
      <td>{{ item.xp_dat_chuan }}</td>
      <td>{{ item.xp_ti_le }}%</td>
      <td>{{ item.ka_tong_so }}</td>
      <td>{{ item.ka_dat_chuan }}</td>
      <td>{{ item.ka_ti_le }}%</td>
    </tr>
    </tbody>
  </v-simple-table>
</template>

<style scoped>
th{
  font-size: 16pt !important;
  font-weight: bold;
  background-color: #ddd;
}
th, td {
  text-align: center !important;
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
</style>