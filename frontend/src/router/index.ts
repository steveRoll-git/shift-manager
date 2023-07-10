import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/schedule/:scheduleId",
      name: "schedule",
      component: () => import("../views/ScheduleView.vue")
    },
    {
      path: "/schedule/:scheduleId/settings",
      name: "scheduleSettings",
      component: () => import("../views/SettingsView.vue")
    },
    {
      path: "/schedule/:scheduleId/members",
      name: "scheduleMembers",
      component: () => import("../views/MembersView.vue")
    }
  ]
})

export default router
