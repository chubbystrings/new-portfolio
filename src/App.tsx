import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Main";

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
      // {
      //   path: "projects",
      //   element: <Projects />,
      // },
    ],
  },
]);

function App() {
 
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
