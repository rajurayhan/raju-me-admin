import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import BlogList from "./pages/Blogs/BlogList";
import CreateBlog from "./pages/Blogs/CreateBlog";
import EditBlog from "./pages/Blogs/EditBlog";
import PortfolioList from './pages/Portfolios/PortfolioList';
import CreatePortfolio from './pages/Portfolios/CreatePortfolio';
import EditPortfolio from './pages/Portfolios/EditPortfolio';
import GenerateContent from './pages/AIContent/GenerateContent';
import { AppWrapper } from "./components/common/PageMeta";

function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <AppWrapper>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />

              {/* Blog Routes */}
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/create" element={<CreateBlog />} />
              <Route path="/blogs/edit/:id" element={<EditBlog />} />
              <Route path="/blogs/generate" element={<GenerateContent />} />

              {/* Portfolio Routes */}
              <Route path="/portfolios" element={<PortfolioList />} />
              <Route path="/portfolios/create" element={<CreatePortfolio />} />
              <Route path="/portfolios/edit/:id" element={<EditPortfolio />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppWrapper>
  );
}
