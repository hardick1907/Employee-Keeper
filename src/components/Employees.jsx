import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './Employees.css';
import { SearchBar } from "./SearchBar";

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'Name',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(10); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3000/employees');
        if (!response.ok) {
          throw new Error('Error fetching employees');
        }
        const data = await response.json();
        setEmployees(data);
        setFilteredEmployees(data); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  const sortEmployees = (employees) => {
    const { key, direction } = sortConfig;

    const sortedEmployees = [...employees].sort((a, b) => {
      if (key === 'Name') {
        return direction === 'asc' 
          ? a.Name.localeCompare(b.Name) 
          : b.Name.localeCompare(a.Name);
      } else if (key === 'Email') {
        return direction === 'asc' 
          ? a.Email.localeCompare(b.Email) 
          : b.Email.localeCompare(a.Email);
      } else if (key === 'ID') {
        return direction === 'asc' 
          ? a._id.localeCompare(b._id) 
          : b._id.localeCompare(a._id);
      } else if (key === 'Date') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return sortedEmployees;
  };

  useEffect(() => {
    if (employees.length > 0) {
      const sortedData = sortEmployees(employees);
      setFilteredEmployees(sortedData); 
    }
  }, [sortConfig, employees]);

  const handleSortChange = (event) => {
    const [key, direction] = event.target.value.split('-');
    setSortConfig({
      key: key,
      direction: direction,
    });
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      setEmployees(employees.filter(employee => employee._id !== id));
      setFilteredEmployees(filteredEmployees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const goToAdd = () => {
    navigate('/createemployee');
  };

  const handleSearchResults = (results) => {
    setFilteredEmployees(results);
    setCurrentPage(1); 
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: Boolean(!currentStatus) }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const updatedEmployee = await response.json();
      setEmployees(employees.map(employee =>
        employee._id === id ? { ...employee, isActive: updatedEmployee.isActive } : employee
      ));
      setFilteredEmployees(filteredEmployees.map(employee =>
        employee._id === id ? { ...employee, isActive: updatedEmployee.isActive } : employee
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <div className="addbutton">
        <button className="createemployee" onClick={goToAdd}>Create Employee</button>

        <h4 className="employee-count">Total Employees - {filteredEmployees.length}</h4>

        <SearchBar setResults={handleSearchResults} employees={employees} />

        <div className="sorting-dropdown">
            <select id="sort" onChange={handleSortChange} value={`${sortConfig.key}-${sortConfig.direction}`}>
                <option value="Name-asc">Name (A-Z)</option>
                <option value="Name-desc">Name (Z-A)</option>
                <option value="Email-asc">Email (A-Z)</option>
                <option value="Email-desc">Email (Z-A)</option>
                <option value="ID-asc">ID (Ascending)</option>
                <option value="ID-desc">ID (Descending)</option>
                <option value="Date-asc">Date (Oldest to Newest)</option>
                <option value="Date-desc">Date (Newest to Oldest)</option>
            </select>
        </div>
      </div>

      <div className="employee-table">
        <table>
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Image</th>
              <th>Status</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee._id}>
                <td>{employee._id}</td>
                <td>
                  <img src={`http://localhost:3000/${employee.image}`} alt={employee.Name} width="50" height="50" />
                </td>
                <td>{employee.isActive ? 
                  (<span className="status active">Active</span>) : 
                  (<span className="status inactive">Inactive</span>)}
                </td>
                <td>{employee.Name}</td>
                <td>{employee.MobileNumber}</td>
                <td>{employee.Email}</td>
                <td>{employee.Designation}</td>
                <td>{employee.Gender}</td>
                <td>{employee.Courses.join(' / ')}</td>
                <td>
                  <time>{employee.createdAt ? format(new Date(employee.createdAt), 'MMM d, yyyy') : 'Invalid Date'}</time>
                </td>
                <td>
                  <div className="actions">
                    <button 
                      onClick={() => toggleActiveStatus(employee._id, employee.isActive)} 
                      className={employee.isActive ? "deactivate-btn" : "activate-btn"}>
                      {employee.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <Link to={`/editemployee/${employee._id}`} className="edit-empolyee">Edit</Link>
                    <button onClick={() => deleteEmployee(employee._id)} className="delete-empolyee">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};
