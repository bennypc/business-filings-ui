import Dashboard from '@/views/Dashboard.vue'
import AnnualReport from '@/views/AnnualReport.vue'
import StandaloneDirectorsFiling from '@/views/StandaloneDirectorsFiling.vue'
import StandaloneOfficeAddressFiling from '@/views/StandaloneOfficeAddressFiling.vue'
import ConsentContinuationOut from '@/views/ConsentContinuationOut.vue'
import ContinuationOut from '@/views/ContinuationOut.vue'
import Correction from '@/views/Correction.vue'
import Signin from '@/views/auth/Signin.vue'
import Signout from '@/views/auth/Signout.vue'
import { DigitalCredentialRoutes } from '@/resources/DigitalCredentialRoutes'
import { FilingNames, Routes } from '@/enums'

export default [
  {
    path: '/',
    name: Routes.DASHBOARD,
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/annual-report',
    name: Routes.ANNUAL_REPORT,
    component: AnnualReport,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          text: `File ${FilingNames.ANNUAL_REPORT}`,
          disabled: false,
          exact: true,
          to: { name: Routes.ANNUAL_REPORT }
        }
      ]
    }
  },
  {
    path: '/standalone-directors',
    name: Routes.STANDALONE_DIRECTORS,
    component: StandaloneDirectorsFiling,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          text: FilingNames.CHANGE_OF_DIRECTORS,
          disabled: false,
          exact: true,
          to: { name: Routes.STANDALONE_DIRECTORS }
        }
      ]
    }
  },
  {
    path: '/standalone-addresses',
    name: Routes.STANDALONE_ADDRESSES,
    component: StandaloneOfficeAddressFiling,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          text: FilingNames.CHANGE_OF_ADDRESS,
          disabled: false,
          exact: true,
          to: { name: Routes.STANDALONE_ADDRESSES }
        }
      ]
    }
  },
  {
    path: '/consent-continuation-out',
    name: Routes.CONSENT_CONTINUATION_OUT,
    component: ConsentContinuationOut,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          text: FilingNames.CONSENT_CONTINUATION_OUT,
          disabled: false,
          exact: true,
          to: { name: Routes.CONSENT_CONTINUATION_OUT }
        }
      ]
    }
  },
  {
    path: '/continuation-out',
    name: Routes.CONTINUATION_OUT,
    component: ContinuationOut,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          text: FilingNames.CONTINUATION_OUT,
          disabled: false,
          exact: true,
          to: { name: Routes.CONTINUATION_OUT }
        }
      ]
    }
  },
  {
    path: '/correction',
    name: Routes.CORRECTION,
    component: Correction,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          text: FilingNames.CORRECTION,
          disabled: false,
          exact: true,
          to: { name: Routes.CORRECTION }
        }
      ]
    }
  },
  {
    // this route is selected by router.beforeEach()
    path: '/signin',
    name: Routes.SIGNIN,
    component: Signin,
    meta: {
      requiresAuth: false
    }
  },
  {
    // this route is selected by SbcHeader -> Logout
    path: '/signout',
    name: Routes.SIGNOUT,
    component: Signout,
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  DigitalCredentialRoutes,
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   // ref: https://cli.vuejs.org/guide/html-and-static-assets.html#prefetch
  //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  // },
  {
    // default/fallback route
    path: '*',
    redirect: '/'
  }
]
