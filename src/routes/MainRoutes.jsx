import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from '../layout/Dashboard';

// import DashboardLayout from 'layout/Dashboard';
import AuthGuard from '../utils/AuthGuard';
import { Navigate } from 'react-router';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/view/dashboard/default')));
const Profile = Loadable(lazy(() => import('../layout/Dashboard/Header/HeaderContent/Profile/profile')));

// render - Enquiries
const Enqiries = Loadable(lazy(() => import('../pages/view/enquries/index')));
const FollowUp = Loadable(lazy(() => import('../pages/view/follow-up/index')));
const Contact = Loadable(lazy(() => import('../pages/view/contact/index')));

// render - colleges
const InternationalCollegs = Loadable(lazy(() => import('../pages/view/colleges/international/index')));
const InternationalIntake = Loadable(lazy(() => import('../pages/view/intake/index')));
const InternationalCourse = Loadable(lazy(() => import('../pages/view/courses/index')));

const DomesticCollegs = Loadable(lazy(() => import('../pages/view/colleges/domestic/index')));
const DomesticIntake = Loadable(lazy(() => import('../pages/view/dom-intake/index')));
const DomesticCourse = Loadable(lazy(() => import('../pages/view/dom-courses/index')));

// render - Utitlite
// const Services = Loadable(lazy(() => import('../pages/view/service/index')));
const Blog = Loadable(lazy(() => import('../pages/view/blog/index')));
// const Gallery = Loadable(lazy(() => import('../pages/view/gallery/index')));

// render - Support
const State = Loadable(lazy(() => import('../pages/view/state/index')));
const Country = Loadable(lazy(() => import('../pages/view/country/index')));

// render - color
const Color = Loadable(lazy(() => import('pages/view/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/view/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/view/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/view/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace={true} />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: <DashboardDefault />
        }
      ]
    },

    // ----------Enquiries----

    {
      path: 'enquiries',
      element: <Enqiries />
    },
    {
      path: 'follow-up',
      element: <FollowUp />
    },
    {
      path: 'contact',
      element: <Contact />
    },

    // ----------Schools----

    {
      path: 'domestic-colleges',
      element: <DomesticCollegs />
    },
    {
      path: 'international-colleges',
      element: <InternationalCollegs />
    },
    {
      path: 'domestic-intake',
      element: <DomesticIntake />
    },
    {
      path: 'international-intake',
      element: <InternationalIntake />
    },
    {
      path: 'domestic-course',
      element: <DomesticCourse />
    },
    {
      path: 'international-course',
      element: <InternationalCourse />
    },

    // ----------Services----

    // {
    //   path: 'services',
    //   element: <Services />
    // },
    {
      path: 'blog',
      element: <Blog />
    },
    // {
    //   path: 'gallery',
    //   element: <Gallery />
    // },

    // ----------Support----

    {
      path: 'state',
      element: <State />
    },
    {
      path: 'country',
      element: <Country />
    },

    // -------------------------------------------------------
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'profile',
      element: <Profile />
    }
  ]
};

export default MainRoutes;
