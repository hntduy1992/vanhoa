import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../pages/index.vue')
    },
    {
        path: '/Auth',
        name: 'login',
        component: () => import('../pages/Auth/index.vue')
    },
    {
        path: '/Auth/Dashboard',
        name: 'dashboard',
        component: () => import('../pages/Auth/Dashboard/index.vue')
    },
    {
        path: '/Auth/DonViHanhChinh',
        name: 'DonViHanhChinh',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/DonViHanhChinh/index.vue'),
        meta: {
            can: 'organization-list'
        }
    },
    {
        path: '/Auth/DonViHanhChinh/ThemMoi',
        name: 'DonViHanhChinhThemMoi',
        component: () => import('../pages/Auth/DonViHanhChinh/ThemMoi.vue'),
        meta: {
            can: 'organization-create'
        }
    },
    {
        path: '/Auth/DonViHanhChinh/:id',
        name: 'DonViHanhChinhSua',
        component: () => import('../pages/Auth/DonViHanhChinh/_id.vue'),
        meta: {
            can: 'organization-edit'
        }
    },
    {
        path: '/Auth/Users',
        name: 'Users',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/Users/index.vue'),
        meta: {
            can: 'user-list'
        }
    },
    {
        path: '/Auth/Users/Create',
        name: 'UsersCreate',
        component: () => import('../pages/Auth/Users/create.vue'),
        meta: {
            can: 'organization-create'
        }
    },
    {
        path: '/Auth/Users/:id',
        name: 'UsersEdit',
        component: () => import('../pages/Auth/Users/_id.vue'),
        meta: {
            can: 'user-edit'
        }
    },
    {
        path: '/Auth/Roles',
        name: 'Roles',
        component: () => import('../pages/Auth/Roles/index.vue'),
        meta: {
            can: 'role-list'
        }
    },
    {
        path: '/Auth/Roles/Create',
        name: 'RolesCreate',
        component: () => import('../pages/Auth/Roles/create.vue'),
        meta: {
            can: 'role-create'
        }
    },
    {
        path: '/Auth/Roles/:id',
        name: 'RolesEdit',
        component: () => import('../pages/Auth/Roles/_id.vue'),
        meta: {
            can: 'role-edit'
        }
    },
    {
        path: '/Auth/KhaoSat/TuDanhGia/ChamDiem',
        name: 'TuDanhGiaCHamDiem',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/TuDanhGia/ChamDiem.vue'),
        meta: {
            can: 'tudanhgia'
        }
    },
    {
        path: '/Auth/KhaoSat/TuDanhGia/GuiDiem',
        name: 'TuDanhGiaGuiDiem',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/TuDanhGia/GuiDiem.vue'),
        meta: {
            can: 'tudanhgia'
        }
    },
    {
        path: '/Auth/KhaoSat/TuDanhGia/GuiYKien',
        name: 'TuDanhGiaGuiYKien',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/TuDanhGia/GuiYKien.vue'),
        meta: {
            can: 'tudanhgia'
        }
    },
    {
        path: '/Auth/KhaoSat/ThamDinh',
        name: 'ThamDinh',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/ThamDinh/index.vue'),
        meta: {
            can: 'thamdinh'
        }
    },
    {
        path: '/Auth/KhaoSat/ThamDinh/:orgId/ChamDiem',
        name: 'ThamDinhChamDiem',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/ThamDinh/ChamDiem.vue'),
        meta: {
            can: 'thamdinh'
        }
    },
    {
        path: '/Auth/KhaoSat/ThamDinh/:orgId/GuiDiem',
        name: 'ThamDinhGuiDiem',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/ThamDinh/GuiDiem.vue')
    },
    {
        path: '/Auth/KhaoSat/XacNhan',
        name: 'XacNhan',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/XacNhan/index.vue'),
        meta: {
            can: 'xacnhandiem'
        }
    },
    {
        path: '/Auth/KhaoSat/XacNhan/:orgId/GuiDiem',
        name: 'XacNhanGuiDiem',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/XacNhan/GuiDiem.vue'),
        meta: {
            can: 'xacnhandiem'
        }
    },
    {
        path: '/Auth/KhaoSat/XacNhan/:orgId/XemYKien',
        name: 'XacNhanXemYKien',
        component: () => import('../pages/Auth/KhaoSat/XacNhan/XemYKien.vue'),
        meta: {
            can: 'xacnhandiem'
        }
    },
    {
        path: '/Auth/KhaoSat/DanhMuc',
        name: 'DanhMuc',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/DanhMuc/index.vue'),
        meta: {
            can: 'botieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/DanhMuc/ThemMoi',
        name: 'DanhMucThemMoi',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/DanhMuc/ThemMoi.vue'),
        meta: {
            can: 'botieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/DanhMuc/:id',
        name: 'DanhMucChinhSua',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/DanhMuc/_id.vue'),
        meta: {
            can: 'botieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/CauHoi',
        name: 'CauHoi',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/CauHoi/index.vue'),
        meta: {
            can: 'tieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/CauHoi/ThemMoi',
        name: 'CauHoiThemMoi',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/CauHoi/ThemMoi.vue'),
        meta: {
            can: 'tieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/CauHoi/:id',
        name: 'CauHoiChinhSua',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/CauHoi/_id.vue'),
        meta: {
            can: 'tieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/CauHinh/CauHoi',
        name: 'CauHinhCauHoi',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/CauHinh/CauHoi.vue'),
        meta: {
            can: 'tieuchi'
        }
    },
    {
        path: '/Auth/KhaoSat/CauHinh/ThoiGian',
        name: 'CauHinhThoiGian',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/KhaoSat/CauHinh/ThoiGian.vue'),
        meta: {
            can: 'thoigian'
        }
    },
    {
        path: '/Auth/Profile',
        name: 'Profile',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/profile'),
        meta: {
        }
    },
    {
        path: '/Auth/Unauthorized',
        name: 'Unauthorized',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/Auth/unauthorized.vue')
    },
    {
        path: '/AccessDenied',
        name: 'AccessDenied',
        component: () => import('../pages/Errors/AccessDenied.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
