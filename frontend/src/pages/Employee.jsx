import React, { useEffect, useContext, useState } from 'react';
import Header from '../components/Header';
import { FaSearch } from "react-icons/fa";
import { MdEdit, MdOutlineDeleteOutline, MdAdd } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import AppContext from '../context/AppContext';
import EditEmployee from '../components/EditEmployee';
import AddEmployee from '../components/AddEmployee';
import DelComponent from '../components/DelComponent';
import { TailSpin } from 'react-loader-spinner';

const Employee = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [openEditEmployee, setOpenEditEmployee] = useState(false);
    const [openAddEmployee, setOpenAddEmployee] = useState(false);
    const [openDelEmployee, setOpenDelEmployee] = useState(false);
    const [employee, setEmployee] = useState({});
    const [searchQuery, setSearchQuery] = useState({
        search: "", department: ""
    });
    const [msg, setMsg] = useState(null);
    const { url, token } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmployeeList = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}employees`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200 || response.status === 201) {
                    setEmployeeList(response.data.data);
                    console.log(response);
                } else {
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployeeList();
    }, [url, token]);

    const handleToggle = (value) => {
        if (value === 'add') {
            setOpenAddEmployee(prev => !prev);
            setOpenEditEmployee(false);
            setOpenDelEmployee(false);
        } else if (value === 'edit') {
            setOpenAddEmployee(false);
            setOpenEditEmployee(true);
            setOpenDelEmployee(false);
        } else if (value === 'del') {
            setOpenAddEmployee(false);
            setOpenEditEmployee(false);
            setOpenDelEmployee(true);
        }
    }

    const handleSearch = (e) => {
        const { name, value } = e.target;
        setSearchQuery(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const filterEmployeee = employeeList.filter(employee => {
        const searchText = searchQuery.search.toLowerCase();
        const searchInText =
            employee.first_name.toLowerCase().includes(searchText) ||
            employee.last_name.toLowerCase().includes(searchText) ||
            employee.email.toLowerCase().includes(searchText);

        let teamMatch = false;
        const department = searchQuery.department;

        if (department === "No in a team now") {
            teamMatch = !employee.teams || employee.teams.length === 0;
        } else if (department) {
            teamMatch = employee.teams?.some(team => team.name === department);
        } else {
            teamMatch = true;
        }

        return searchInText && teamMatch;
    });

    return (
        <>
            <div className='absolute w-full min-h-screen'>
                <Header />
                <div className='flex flex-col gap-6 md:gap-10 py-4 md:py-5 px-4 md:px-10 mx-auto'>

                    {/* Header Section */}
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0'>
                        <h1 className='text-xl md:text-2xl font-bold'>Employees</h1>
                        <button 
                            onClick={() => setOpenAddEmployee(true)} 
                            className='w-full sm:w-auto min-w-[140px] min-h-[35px] flex items-center justify-center gap-2 cursor-pointer rounded bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm md:text-md transition-colors duration-200'
                        >
                            <MdAdd className='w-5 h-5' />
                            Add Employee
                        </button>
                    </div>

                    {/* Search and Filter Section */}
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full'>
                        <div className='flex items-center w-full sm:w-[300px] px-3 gap-2 border-2 rounded border-gray-300 bg-white'>
                            <FaSearch className='w-4 h-4 text-gray-400' />
                            <input 
                                onChange={handleSearch} 
                                name='search' 
                                value={searchQuery.search} 
                                type="search" 
                                placeholder='Search by name or email' 
                                className='py-2 w-full text-[14px] px-2 border-0 outline-0 bg-transparent' 
                            />
                        </div>
                        <select 
                            name='department' 
                            onChange={handleSearch} 
                            value={searchQuery.department} 
                            className='w-full sm:w-auto min-w-[160px] py-2 outline-0 text-[14px] px-3 rounded border-2 border-gray-300 bg-white cursor-pointer'
                        >
                            <option value=''>All Departments</option>
                            <option value='Sales'>Sales</option>
                            <option value='Engineering & DevOps'>Engineering & DevOps</option>
                            <option value='Marketing'>Marketing</option>
                            <option value='No in a team now'>No in a team now</option>
                        </select>
                    </div>

                    {/* Table Container with Overflow */}
                    <div className='overflow-x-auto rounded-lg shadow border border-gray-200'>
                        <table className="min-w-full bg-white">
                            <thead className="bg-neutral-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-neutral-700 whitespace-nowrap">Employee</th>
                                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-neutral-700 whitespace-nowrap">Email</th>
                                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-neutral-700 whitespace-nowrap">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-neutral-700 whitespace-nowrap">Team</th>
                                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-neutral-700 whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 flex justify-center items-center" style={{ height: '150px' }}>
                                            <TailSpin
                                                height={50}
                                                width={50}
                                                color="#3b82f6"
                                                ariaLabel="loading-indicator"
                                            />
                                        </td>
                                    </tr>
                                ) : filterEmployeee.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-neutral-500 text-sm">
                                            <div className='flex flex-col items-center gap-2'>
                                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className='font-medium'>No employees found</p>
                                                <p className='text-xs text-gray-400'>Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filterEmployeee.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-neutral-50 border-b border-gray-100 transition-colors">
                                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                <span className='font-medium text-gray-900'>
                                                    {employee.first_name} {employee.last_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{employee.email || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{employee.phone || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1 min-w-[120px]">
                                                    {(!employee.teams || employee.teams.length === 0) && (
                                                        <span className="text-gray-700 px-2 py-1 bg-gray-100 rounded text-xs font-medium whitespace-nowrap">
                                                            No team
                                                        </span>
                                                    )}
                                                    {employee.teams?.map(team => (
                                                        <span key={team.id} className="text-blue-700 px-2 py-1 bg-blue-50 rounded text-xs font-medium whitespace-nowrap">
                                                            {team.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEmployee(employee);
                                                            handleToggle('edit');
                                                        }}
                                                        className="p-1 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit employee"
                                                    >
                                                        <MdEdit className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEmployee(employee);
                                                            handleToggle('del');
                                                        }}
                                                        className="p-1 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete employee"
                                                    >
                                                        <MdOutlineDeleteOutline className="w-5 h-5 text-red-600 hover:text-red-800" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Result Count */}
                    {filterEmployeee.length > 0 && (
                        <div className='text-sm text-gray-600'>
                            Showing <span className='font-semibold text-gray-900'>{filterEmployeee.length}</span> of <span className='font-semibold text-gray-900'>{employeeList.length}</span> employees
                        </div>
                    )}

                </div>

                {/* Floating Action Button */}
                <div 
                    style={{ zIndex: 1000 }} 
                    onClick={() => { handleToggle('add') }} 
                    className='w-14 h-14 md:w-16 md:h-16 fixed bottom-6 right-6 md:bottom-8 md:right-10 cursor-pointer rounded-full bg-blue-500 hover:bg-blue-600 text-white flex justify-center items-center shadow-lg hover:shadow-xl transition-all duration-200'
                >
                    {openAddEmployee ? <RxCross2 className='w-6 h-6 md:w-7 md:h-7' /> : <MdAdd className='w-6 h-6 md:w-7 md:h-7' />}
                </div>
            </div>

            {openEditEmployee && <EditEmployee employee={employee} setOpenEditEmployee={setOpenEditEmployee} />}
            {openDelEmployee && <DelComponent employee={employee} setOpenDelEmployee={setOpenDelEmployee} />}
            {openAddEmployee && <AddEmployee setOpenAddEmployee={setOpenAddEmployee} />}
        </>
    );
}

export default Employee;
