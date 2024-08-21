const toJson = (item) => {
  return {
    id: item.id,
    tenDanhMuc: item.tenDanhMuc,
    noiDung: item.noiDung,
    namApDung: item.namApDung,
    donViApDung: item.donViApDung,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    tenDanhMuc: item.tenDanhMuc,
    noiDung: item.noiDung,
    namApDung: item.namApDung,
    donViApDung: (item?.donvi) ? item.donvi.map(item => item.maDonVi) : [],
    trangThai: item.trangThai
  }
}

const baseJson = () => {
  return {
    id: null,
    tenDanhMuc: null,
    noiDung: null,
    namApDung: null,
    donViApDung: [],
    trangThai: 1
  }
}

export const khaoSatDanhMucModel = {
  toJson, fromJson, baseJson
}
