import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { I18nProvider } from './i18n/I18n';
import { About } from './Pages/About';
import { Day, LegacyApodRedirect } from './Pages/Day';
import { Gallery, LegacyArchiveRedirect } from './Pages/Gallery';
import { Home } from './Pages/Home';
import { NotFound } from './Pages/NotFound';

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/apod', element: <LegacyApodRedirect /> },
      { path: '/apod/:date', element: <Day /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/gallery/:month', element: <Gallery /> },
      { path: '/archive', element: <LegacyArchiveRedirect /> },
      { path: '/archive/:month', element: <LegacyArchiveRedirect /> },
      { path: '/about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => (
  <I18nProvider>
    <RouterProvider router={router} />
  </I18nProvider>
);

export default App;
