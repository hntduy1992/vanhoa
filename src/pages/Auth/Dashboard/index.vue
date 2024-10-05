<template>
  <LayoutDefault>
    <v-tabs fixed-tabs background-color="var(--primary-color)" dark>
      <v-tab>
        ĐƠN VỊ ĐẠT DANH HIỆU
      </v-tab>
      <v-tab>
        THỐNG KÊ THEO NĂM
      </v-tab>
      <v-tab-item class="py-2 px-1" :key="1">
        <div class="d-flex align-center mb-2" style="width: 150px">
          <label for="selectYear" class="v-label me-2 text-no-wrap">Chọn năm </label>
          <v-select id="selectYear" v-model="namApDung" item-text="text" item-value="value" solo return-object
            hide-details :items="namApDungs" />
        </div>
        <v-row v-if="namApDung">
          <v-col cols="12" v-for="(item, i) of data" :key="item.id + '_' + i">
            <v-card>
              <v-toolbar dense elevation="4">
                <h4>{{ item.tenDanhMuc }}</h4>
              </v-toolbar>
              <v-card-text>
                <v-chart class="chart" autoresize :option="fnLoadChartInfo(item.donVis, item.diemChuan)" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <h4>Không có dữ liệu</h4>
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
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
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
      data: [],
      namApDung: {},
      namApDungs: []
    }
  },
  created() {
    this.fnGetNamApDung()
  },
  methods: {
    fnGetNamApDung() {
      this.$axios.get('auth/khao-sat/danh-muc/select-nam-ap-dung').then((res) => {
        this.namApDungs = res.data.data.map((i) => ({
          value: i,
          text: i
        }))
        this.namApDung = this.namApDungs[0]
        this.fnGetThongKeBXH()
      }).catch((err) => {
        console.log(err)
      })
    },
    fnGetThongKeBXH() {
      this.$axios.get('auth/khao-sat/thong-ke/thong-ke-bang-xep-hang', {
        params: {
          namApDung: this.namApDung.value,
        }
      }).then((res) => {
        this.data = res.data.data
      });
    },
    fnLoadChartInfo(donvi, diemChuan) {
      for (let i = 0; i < donvi.diem.length; i++) {
        if (donvi.diem[i] >= diemChuan)
          donvi.tenDonVi[i] = '(Đạt chuẩn) ' + donvi.tenDonVi[i]
      }
      return {
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
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: donvi.tenDonVi,

        },
        series: [
          {
            name: 'Tổng điểm',
            type: 'bar',
            itemStyle: {
              color: '#a90000',
            },
            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              formatter(param) {
                return param.data === 0 ? '' : param.data
              }
            },
            data: donvi.diem
          }
        ]
      }
    },
  }
}
</script>

<style scoped>
.chart {
  height: 600px;
}
</style>
