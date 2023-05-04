import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css';
import StoreProvider from "./store";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Main";
import Playlist from "./pages/Playlist";


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
    ],
  },
]);

function App() {
 
  return (
    <StoreProvider>
      <RouterProvider router={router} fallbackElement={<h1>Loading....</h1>} />
    </StoreProvider>
  );
}

export default App
