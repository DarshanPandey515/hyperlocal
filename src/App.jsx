import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicProfile from "./pages/PublicProfile";
import SearchResults from "./pages/SearchResults";



import DashboardLayout from "./components/dashboard/DashboardLayout";
import Overview from "./pages/Overview";
import Discover from "./pages/Discover";
import Messages from "./pages/Messages";
import ConnectionRequests from "./pages/ConnectionRequests";
import ProfileSetup from "./components/ProfileSetup";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="discover" element={<Discover />} />
          <Route path="messages" element={<Messages />} />
          <Route path="requests" element={<ConnectionRequests />} />
          <Route path="profile" element={<ProfileSetup />} />
        </Route>

        <Route path="/profile/:userId" element={<PublicProfile />} />
        <Route path="/search" element={<SearchResults />} />

      </Routes>
    </>
  );
}
