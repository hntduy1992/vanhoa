import { khaoSatBangDiemModel } from '~/models/khaoSatBangDiemModel'

const toJson = (item) => {
  return {
    id: item.id,
    parentId: item.parentId,
    tenCauHoi: item.tenCauHoi,
    diemNhoNhat: parseFloat(item.diemNhoNhat).toFixed(2),
    diemLonNhat: parseFloat(item.diemLonNhat).toFixed(2),
    dieuKien: item.dieuKien,
    loaiCauHoi: item.loaiCauHoi,
    maDanhMuc: item.maDanhMuc,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    parentId: item.parentId,
    tenCauHoi: item.tenCauHoi,
    diemNhoNhat: parseFloat(item.diemNhoNhat).toFixed(2),
    diemLonNhat: parseFloat(item.diemLonNhat).toFixed(2),
    dieuKien: item.dieuKien,
    loaiCauHoi: item.loaiCauHoi,
    maDanhMuc: item.maDanhMuc,
    bangDiem: item.bang_diem ? khaoSatBangDiemModel.fromJson(item.bang_diem) : khaoSatBangDiemModel.baseJson(),
    donViThamDinh: item.don_vi_tham_dinh,
    cauTraLoi: item?.cau_tra_loi ?? [],
    hasChild: item?.hasChild ?? false,
    level: item.level,
    trangThai: item.trangThai
  }
}

const baseJson = () => {
  return {
    id: null,
    parentId: 0,
    tenCauHoi: null,
    diemNhoNhat: '0',
    diemLonNhat: '0',
    dieuKien: 'AND',
    loaiCauHoi: 1,
    maDanhMuc: null,
    trangThai: 1
  }
}

export const khaoSatBoCauHoiModel = {
  toJson,
  fromJson,
  baseJson
}
