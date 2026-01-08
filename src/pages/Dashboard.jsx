import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
