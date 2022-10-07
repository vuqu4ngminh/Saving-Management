import "./css/List.css";
import "./css/Nav.css";
import "./css/Client.css";
import "./css/Input.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import List from "./components/List";
import Nav from "./components/Nav";
import NotFound from "./components/NotFound";
import User from "./components/User";
import FindUser from "./components/FindUser";
import Interests from "./components/Interests";
import UpdateUser from "./components/UpdateUser";
import DeleteSaving from "./components/DeleteSaving";
import DeleteUser from "./components/DeleteUser";
import CreateSaving from "./components/CreateSaving";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/user" element={<FindUser />} />
          <Route path="/user/update/:id" element={<UpdateUser />} />
          <Route path="/user/saving/:savId" element={<DeleteSaving />} />
          <Route path="/user/delete/:id" element={<DeleteUser />} />
          <Route path="/user/saving/open/:id" element={<CreateSaving />} />
          <Route path="/terms" element={<Interests />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
