const toJson = (item) => {
  return {
    id: item.id,
    tenCauTraLoi: item.tenCauTraLoi,
    diemNhoNhat: parseFloat(item.diemNhoNhat).toFixed(2),
    diemLonNhat: parseFloat(item.diemLonNhat).toFixed(2),
    buocNhay: parseFloat(item.buocNhay).toFixed(2),
    kieuNhapLieu: item.kieuNhapLieu,
    maCauHoi: item.maCauHoi,
    maDanhMuc: item.maDanhMuc,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    tenCauTraLoi: item.tenCauTraLoi,
    diemNhoNhat: item.diemNhoNhat,
    diemLonNhat: item.diemLonNhat,
    buocNhay: item.buocNhay,
    kieuNhapLieu: item.kieuNhapLieu,
    maCauHoi: item.maCauHoi,
    cauHoi: item.cau_hoi,
    maDanhMuc: item.maDanhMuc,
    danhMuc: item.danh_muc,
    trangThai: item.trangThai
  }
}

const baseJson = () => {
  return {
    id: null,
    tenCauTraLoi: null,
    diemNhoNhat: '0',
    diemLonNhat: '0',
    buocNhay: '0',
    kieuNhapLieu: 'Radio',
    maCauHoi: null,
    maDanhMuc: null,
    trangThai: 1
  }
}

export const khaoSatCauTraLoiModel = {
  toJson,
  fromJson,
  baseJson
}
