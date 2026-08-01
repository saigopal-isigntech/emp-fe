import { useEmployeeContext } from "../context/EmployeeContext";

import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

function EmployeeListPage() {
  const { loading, error } = useEmployeeContext();

  if (loading) {
    return <h2>Loading employees...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
      <div className="section-title">
        <div>
          <h2>Employee List</h2>
          <p>View and manage all employees.</p>
        </div>
      </div>

      <SearchBar />

      <FilterPanel />

      <EmployeeForm />

      <EmployeeList />
    </>
  );
}

export default EmployeeListPage;