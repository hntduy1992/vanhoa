<template>
  <LayoutDefault>
    <v-row>
      <v-col cols="12" md="4" class="text-center">
        <v-card>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col
                  class="text-h2"
                  cols="12"
              >
                0
              </v-col>
              <v-col cols="12">
                <h4>Hạng hiện tại</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <v-card>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col
                  class="text-h2"
                  cols="12"
              >
                0
              </v-col>
              <v-col cols="12">
                <h4>Hạng lần trước</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <v-card>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col
                  class="text-h2"
                  cols="12"
              >
                0
              </v-col>
              <v-col cols="12">
                <h4>Độ lệch</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-if="$can('xacnhandiem')">
        <v-card>
          <v-toolbar dense elevation="0" class="py-3">
            <h4>BẢNG XẾP HẠNG</h4>
            <v-spacer/>
            <div style="width: 80px">
              <v-select v-model="namApDung" hide-details dense :items="[2021, 2022]"/>
            </div>
          </v-toolbar>
          <v-card-text>
            <v-chart class="chart" autoresize :option="chartXepHang"/>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" :md="$can('xacnhandiem') ? '6': '12'">
        <v-card>
          <v-toolbar dense elevation="0" class="py-3">
            <h4>BẢNG ĐIỂM ĐƠN VỊ</h4>
            <v-spacer/>
          </v-toolbar>
          <v-card-text>
            <v-chart class="chart" autoresize :option="chartXepHangDonVi"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>
import {use} from 'echarts/core'
import {CanvasRenderer} from 'echarts/renderers'
import {BarChart} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent, GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import LayoutDefault from "@/layouts/default";

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
    LayoutDefault,
    VChart
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
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Tổng điểm',
            data: [],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              formatter(param) {
                return param.data === 0 ? '' : param.data
              }
            },
            barWidth: '35px'
          }
        ]
      },
      namApDung: new Date().getFullYear()
    }
  },
  created() {
    this.fnGetBangXepHang()
    this.fnGetBangXepHangCuaDonVi()
  },
  methods: {
    fnGetBangXepHang() {
      this.$axios.get('auth/khao-sat/thong-ke/bang-xep-hang', {params: {namApDung: this.namApDung}}).then((res) => {
        const donVi = []
        const data = []
        for (const [key, value] of Object.entries(res.data.data)) {
          donVi.push(key)
          data.push(value)
        }
        this.chartXepHang.yAxis.data = donVi
        this.chartXepHang.series[0].data = data
      })
    },
    fnGetBangXepHangCuaDonVi() {
      this.$axios.get('auth/khao-sat/thong-ke/bang-xep-hang-don-vi').then((res) => {
        const soNam = []
        const data = []
        for (const [key, value] of Object.entries(res.data.data)) {
          soNam.push(key)
          data.push(value)
        }
        this.chartXepHangDonVi.xAxis.data = soNam
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
