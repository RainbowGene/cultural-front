import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "登录",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/",
      name: "layout",
      component: () => import("@/views/Layout.vue"),
      children: [
        {
          path: "/home",
          name: "首页",
          component: () => import("@/views/home/Home.vue"),
        },
        // {
        //   path: "/app/carouselList",
        //   name: "轮播图",
        //   component: () => import("@/views/app/CarouselList.vue"),
        // },
        // {
        //   path: "/app/feedbackList",
        //   name: "问题反馈",
        //   component: () => import("@/views/app/FeedbackList.vue"),
        // },
        {
          path: "/settings/menu",
          name: "菜单管理",
          component: () => import("@/views/setting/MenuList.vue"),
        },
        {
          path: "/settings/role",
          name: "角色管理",
          component: () => import("@/views/setting/RoleList.vue"),
        },
        {
          path: "/settings/user",
          name: "系统用户",
          component: () => import("@/views/setting/UserList.vue"),
        },
        {
          path: "/content/column",
          name: "栏目管理",
          component: () => import("@/views/content/ColumnList.vue"),
        },
        {
          path: "/content/area",
          name: "园区管理",
          component: () => import("@/views/content/AreaList.vue"),
        },
        {
          path: "/content/tag",
          name: "标签管理",
          component: () => import("@/views/content/TagList.vue"),
        },
      ],
    },
  ],
});

// 路由拦截
router.beforeEach((to, from, next) => {
  const userInfo = sessionStorage.getItem("userInfo");
  if (!userInfo && to.path != "/login") {
    router.push("/login");
  }
  next();
});

export default router;
