const toJson = (item) => {
  return {
    id: item.id,
    diem: parseFloat(item.diem).toFixed(2),
    diemThamDinh: parseFloat(item.diemThamDinh).toFixed(2),
    maCauHoi: item.maCauHoi,
    maDanhMuc: item.maDanhMuc,
    noiDungTraLoi: item.noiDungTraLoi,
    maDonViDanhGia: item.maDonViDanhGia,
    maNguoiDanhGia: item.maNguoiDanhGia,
    fileDanhGia: item.fileDanhGia,
    ghiChuDanhGia: item.ghiChuDanhGia,
    maDonViThamDinh: item.maDonViThamDinh,
    maNguoiThamDinh: item.maNguoiThamDinh,
    noiDungThamDinh: item.noiDungThamDinh,
    ghiChuThamDinh: item.ghiChuThamDinh,
    parentId: item.parentId,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    diem: item.diem,
    diemThamDinh: item.diemThamDinh,
    parentId: item.parentId,
    maCauHoi: item.maCauHoi,
    maDanhMuc: item.maDanhMuc,
    noiDungTraLoi: item.noiDungTraLoi ?? [],
    maDonViDanhGia: item.maDonViDanhGia,
    maNguoiDanhGia: item.maNguoiDanhGia,
    fileDanhGia: item.fileDanhGia,
    ghiChuDanhGia: item.ghiChuDanhGia,
    maDonViThamDinh: item.maDonViThamDinh,
    maNguoiThamDinh: item.maNguoiThamDinh,
    noiDungThamDinh: item.noiDungThamDinh ?? [],
    ghiChuThamDinh: item.ghiChuThamDinh,
    trangThai: item.trangThai
  }
}

const baseJson = () => {
  return {
    id: null,
    diem: 0,
    diemThamDinh: 0,
    maCauHoi: null,
    maDanhMuc: null,
    noiDungTraLoi: [],
    maDonViDanhGia: null,
    maNguoiDanhGia: null,
    fileDanhGia: null,
    ghiChuDanhGia: null,
    maDonViThamDinh: null,
    maNguoiThamDinh: null,
    noiDungThamDinh: null,
    ghiChuThamDinh: null,
    parentId: 0,
    trangThai: 1
  }
}

export const khaoSatBangDiemModel = {
  toJson,
  fromJson,
  baseJson
}
