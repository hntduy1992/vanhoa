<template>
  <LayoutDefault>
    <v-tabs
        fixed-tabs
        background-color="var(--primary-color)"
        dark
    >
      <v-tab>
        ĐƠN VỊ ĐẠT DANH HIỆU
      </v-tab>
      <v-tab>
        THỐNG KÊ THEO NĂM
      </v-tab>
      <v-tab-item
          class="py-2 px-1"
         :key="1"
      >
       <div class="d-flex justify-center align-center mb-2">
         <label for="selectYear" class="v-label me-2" >Chọn năm </label>
         <div style="width: 100px">
           <v-select id="selectYear"  v-model="this.namApDung"  outlined hide-details dense :items="this.listNamApDung">
           </v-select>
         </div>
       </div>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-toolbar dense elevation="0" class="py-3">
                <h4>XÃ, PHƯỜNG, THỊ TRẤN TIÊU BIỂU</h4>
              </v-toolbar>
              <v-card-text>
                <v-chart class="chart" autoresize :option="chartXepHang"/>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-toolbar dense elevation="0" class="py-3">
                <h4>KHÓM, ẤP VĂN HÓA</h4>
                <v-spacer/>
              </v-toolbar>
              <v-card-text>
                <v-chart class="chart" autoresize :option="chartXepHangDonVi"/>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item :key="2">
        <v-row>
          <v-col cols="12">
            <static-dashboard></static-dashboard>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>

  </LayoutDefault>
</template>

<script>
import {use} from 'echarts/core'
import {CanvasRenderer} from 'echarts/renderers'
import {BarChart} from 'echarts/charts'
import {GridComponent, LegendComponent, TitleComponent, TooltipComponent} from 'echarts/components'
import VChart from 'vue-echarts'
import LayoutDefault from "@/layouts/default";
import StaticDashboard from "@/pages/Auth/Dashboard/staticDashboard.vue";

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])

export default {
  name: 'dashboard-index',
  components: {
    StaticDashboard,
    LayoutDefault,
    VChart,
  },
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Dashboard',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    };
  },
  data() {
    return {
      chartXepHang: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: 'Tổng điểm',
            type: 'bar',
            itemStyle: {
              color: '#a90000'
            },
            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              formatter(param) {
                return param.data === 0 ? '' : param.data
              }
            },
            data: []
          }
        ]
      },
      chartXepHangDonVi: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: 'Tổng điểm',
            type: 'bar',
            itemStyle: {
              color: '#a90000'
            },
            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              formatter(param) {
                return param.data === 0 ? '' : param.data
              }
            },
            data: []
          }
        ]
      },
      namApDung: null,
      listNamApDung:[]
    }
  },
  created() {
    this.fnGetBangXepHang()
    this.fnGetBangXepHangCuaDonVi()
    this.fnGetNamApDung()
  },
  methods: {
    fnGetNamApDung(){
      this.$axios.get('auth/khao-sat/danh-muc/select-nam-ap-dung').then((res) => {
        this.listNamApDung = res.data.data
        this.namApDung = this.listNamApDung.length?this.listNamApDung[0]:null
      })
    },
    fnGetBangXepHang() {
      this.$axios.get('auth/khao-sat/thong-ke/bang-xep-hang', {
        params: {
          namApDung: this.namApDung,
          phanLoai: 1
        }
      }).then((res) => {
        const donVi = []
        const data = []
        for (const [key, value] of Object.entries(res.data.data)) {
          if (value >= 3) {
            donVi.push('(Đạt) ' + key)
          } else {
            donVi.push(key)
          }
          data.push(value)
        }
        this.chartXepHang.yAxis.data = donVi
        this.chartXepHang.series[0].data = data
      })
    },
    fnGetBangXepHangCuaDonVi() {
      this.$axios.get('auth/khao-sat/thong-ke/bang-xep-hang', {
        params: {
          namApDung: this.namApDung,
          phanLoai: 2
        }
      }).then((res) => {
        const donVi = []
        const data = []
        for (const [key, value] of Object.entries(res.data.data)) {
          if (value >= 3) {
            donVi.push('(Đạt) ' + key)
          } else {
            donVi.push(key)
          }
          data.push(value)
        }
        this.chartXepHangDonVi.yAxis.data = donVi
        this.chartXepHangDonVi.series[0].data = data
      })
    }
  }
}
</script>

<style scoped>
.chart {
  height: 600px;
}
</style>
