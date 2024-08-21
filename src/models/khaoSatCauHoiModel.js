const toJson = (item) => {
  return {
    id: item.id,
    stt: item.stt,
    parentId: item.parentId,
    tenCauHoi: item.tenCauHoi,
    diemNhoNhat: Number(parseFloat(item.diemNhoNhat).toFixed(2)),
    buocNhay: Number(parseFloat(item.buocNhay).toFixed(3)),
    diemLonNhat: Number(parseFloat(item.diemLonNhat).toFixed(2)),
    loaiDieuKien: item.loaiDieuKien,
    loaiCauHoi: item.loaiCauHoi,
    danhDauCau: item.danhDauCau,
    kieuNhapLieu: (item.danhDauCau === 2 || item.danhDauCau === 3) ? item.kieuNhapLieu : null,
    maDanhMuc: item.maDanhMuc,
    sapXep: item.sapXep,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    stt: item.stt,
    parentId: item.parentId,
    tenCauHoi: item.tenCauHoi,
    diemNhoNhat: Number(parseFloat(item.diemNhoNhat).toFixed(2)),
    buocNhay: Number(parseFloat(item.buocNhay).toFixed(3)),
    diemLonNhat: Number(parseFloat(item.diemLonNhat).toFixed(2)),
    loaiDieuKien: item.loaiDieuKien,
    loaiCauHoi: item.loaiCauHoi,
    danhDauCau: item.danhDauCau,
    kieuNhapLieu: (item.danhDauCau === 2 || item.danhDauCau === 3) ? item.kieuNhapLieu : null,
    maDanhMuc: item.maDanhMuc,
    sapXep: item.sapXep,
    childrenCount: item?.children_count ?? 0,
    level: item?.level ?? 0,
    bangdiem: item.bangdiem,
    donViThamDinh: item.donvithamdinh ? item.donvithamdinh.maDonVi : 0,
    trangThai: item.trangThai,
    ykien: item.ykien,
  }
}

const baseJson = () => {
  return {
    id: null,
    parentId: 0,
    stt: null,
    tenCauHoi: null,
    diemNhoNhat: '0',
    buocNhay: '0',
    diemLonNhat: '0',
    maDanhMuc: null,
    loaiDieuKien: 'AND',
    loaiCauHoi: 1,
    danhDauCau: 0,
    kieuNhapLieu: null,
    sapXep: 1,
    trangThai: 1
  }
}

export const khaoSatCauHoiModel = {
  toJson,
  fromJson,
  baseJson
}
