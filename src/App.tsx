import React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { I18nProvider } from './i18n/I18n';
import { About } from './Pages/About';
import { Archive } from './Pages/Archive';
import { Day, LegacyApodRedirect } from './Pages/Day';
import { Home } from './Pages/Home';
import { NotFound } from './Pages/NotFound';

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/apod', element: <LegacyApodRedirect /> },
      { path: '/apod/:date', element: <Day /> },
      { path: '/archive', element: <Archive /> },
      { path: '/archive/:month', element: <Archive /> },
      { path: '/gallery', element: <Navigate to="/archive" replace /> },
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
