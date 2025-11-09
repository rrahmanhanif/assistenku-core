import MapMonitor from "../components/MapMonitor";
import MitraList from "../components/MitraList";
import CustomerList from "../components/CustomerList";
import Transactions from "./Transactions";

const DashboardAdmin = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard Admin — Assistenku Core</h2>
      <Transactions />
      <hr />
      <MapMonitor />
      <hr />
      <MitraList />
      <hr />
      <CustomerList />
    </div>
  );
};

export default DashboardAdmin;
