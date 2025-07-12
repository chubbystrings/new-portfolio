import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css';
import StoreProvider from "./store";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Main";
import Playlist from "./pages/Playlist";
import Gallery from "./pages/Gallery";
import Whot from "./pages/Whot";
import { ToastContainer } from "react-toastify";
import GamesLayout from "./layouts/GamesLayout";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "playlist",
        element: <Playlist />,
      },
      {
        path: "galleries",
        element: <Gallery />,
      },
      {
        path: 'games',
        element: <GamesLayout />,
        children: [
          {
            index: true,
            element: <Games />,
          },
          {
            path: 'whot',
            element: <Whot />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
 
  return (
    <StoreProvider>
      <ToastContainer />
      <RouterProvider router={router} fallbackElement={<h1>Loading....</h1>} />
    </StoreProvider>
  );
}

export default App
