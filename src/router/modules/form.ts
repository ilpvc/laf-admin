import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ProfileOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/form',
    name: 'Form',
    redirect: '/form/basic-form',
    component: Layout,
    meta: {
      title: '审核管理',
      icon: renderIcon(ProfileOutlined),
      sort: 3,
    },
    children: [
      {
        path: 'basic-form',
        name: 'form-basic-form',
        meta: {
          title: '反馈审核',
        },
        component: () => import('@/views/form/basicForm/index.vue'),
      },
      {
        path: 'step-form/:id',
        name: 'form-step-form',
        meta: {
          title: '反馈详情',
          hidden: true,
          activeMenu: 'basic-form',
        },
        component: () => import('@/views/form/stepForm/stepForm.vue'),
      },

      {
        path: 'report-form',
        name: 'form-report-form',
        meta: {
          title: '举报审核',
        },
        component: () => import('@/views/form/reportForm/index.vue'),
      },
      {
        path: 'step-report-form/:id',
        name: 'report-step-form',
        meta: {
          title: '举报详情',
          hidden: true,
          activeMenu: 'report-form',
        },
        component: () => import('@/views/form/reportForm/stepForm/stepForm.vue'),
      },

      {
        path: 'post-form',
        name: 'form-post-form',
        meta: {
          title: '帖子审核',
        },
        component: () => import('@/views/form/postForm/index.vue'),
      },
      {
        path: 'step-post-form/:id',
        name: 'post-step-form',
        meta: {
          title: '审核详情',
          hidden: true,
          activeMenu: 'post-form',
        },
        component: () => import('@/views/form/postForm/stepForm/stepForm.vue'),
      },
      // {
      //   path: 'detail',
      //   name: 'form-detail',
      //   meta: {
      //     title: '表单详情',
      //   },
      //   component: () => import('@/views/form/detail/index.vue'),
      // },
    ],
  },
];

export default routes;
