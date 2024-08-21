
const toJson = (item) => {
  return {
    id: item.id,
    tenTaiKhoan: item.tenTaiKhoan,
    hoVaTen: item.hoVaTen,
    matKhau: item.matKhau,
    email: item.email,
    soDienThoai: item.soDienThoai,
    tenCoQuan: item.tenCoQuan,
    roles: item.roles,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    tenTaiKhoan: item.tenTaiKhoan,
    matKhau: null,
    hoVaTen: item.hoVaTen,
    email: item.email,
    soDienThoai: item.soDienThoai,
    tenCoQuan: item.tenCoQuan,
    roles: item.roles,
    trangThai: item.trangThai
  }
}

const baseJson = () => {
  return {
    id: null,
    tenTaiKhoan: null,
    matKhau: null,
    hoVaTen: null,
    email: null,
    soDienThoai: null,
    tenCoQuan: null,
    roles: null,
    trangThai: false
  }
}

export const taiKhoanModel = {
  toJson, fromJson, baseJson
}
