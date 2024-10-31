import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Panel from "../pages/Panel";
import NotFoundPage from "../pages/NotFoundPage";
import CreateUser from "../pages/CreateUser";
import AuthenticatedRoute from "./AuthenticatedRoute";
import SharedLayout from "../components/SharedLayout";
import ListSchedules from "../pages/ListSchedules";
import CreateSchedule from "../pages/CreateSchedule";
import EditSchedule from "../pages/EditSchedule";

const AllRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route
          path="panel"
          element={
            <AuthenticatedRoute>
              <Panel />
            </AuthenticatedRoute>
          }
        >
          <Route
            index
            element={
              <SharedLayout>
                <ListSchedules />
              </SharedLayout>
            }
          />
          <Route
            path="add-schedule"
            element={
              <SharedLayout>
                <CreateSchedule />
              </SharedLayout>
            }
          />
          <Route
            path=":scheduling_id"
            element={
              <SharedLayout>
                <EditSchedule />
              </SharedLayout>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
