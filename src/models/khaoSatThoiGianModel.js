import moment from 'moment'

const toJson = (item) => {
  return {
    id: item.id,
    tenThoiGian: item.tenThoiGian,
    batDau: item.batDau,
    ketThuc: item.ketThuc
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    tenThoiGian: item.tenThoiGian,
    batDau: moment(item.batDau).format('YYYY-MM-DD'),
    ketThuc: moment(item.ketThuc).format('YYYY-MM-DD')
  }
}

const baseJson = () => {
  return {
    id: null,
    tenThoiGian: null,
    batDau: null,
    ketThuc: null
  }
}

export const khaoSatThoiGianModel = {
  toJson,
  fromJson,
  baseJson
}
