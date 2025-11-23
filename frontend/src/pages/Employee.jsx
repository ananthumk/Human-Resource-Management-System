import React from 'react'
import Header from '../components/Header'
import { FaSearch } from "react-icons/fa";
import { MdEdit, MdOutlineDeleteOutline, MdAdd } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useEffect } from 'react';
import axios from 'axios'
import { useContext } from 'react';
import AppContext from '../context/AppContext'
import { useState } from 'react';
import EditEmployee from '../components/EditEmployee';
import AddEmployee from '../components/AddEmployee';
import DelComponent from '../components/delComponent';

const Employee = () => {

    const [employeeList, setEmployeeList] = useState([])
    const [openEditEmployee, setOpenEditEmployee] = useState(false)
    const [openAddEmployee, setOpenAddEmployee] = useState(false)
    const [openDelEmployee, setOpenDelEmployee] = useState(false)
    const [employee, setEmployee] = useState({})
    const [searchQuery, setSearchQuery] = useState({
        search: "", department: ""
    })
    const [msg, setMsg] = useState(null)
    const { url, token } = useContext(AppContext)

    useEffect(() => {
        const fetchEmployeeList = async () => {

            try {

                const response = await axios.get(`${url}employees`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    setEmployeeList(response.data.data)
                    console.log(response)
                } else {
                    console.log(response)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchEmployeeList()
    }, [url, token])

    const handleToggle = (value) => {
        if (value === 'add') {
            setOpenAddEmployee(prev => !prev)
            setOpenEditEmployee(false)
            setOpenDelEmployee(false)
        } else if (value === 'edit') {
            setOpenAddEmployee(false)
            setOpenEditEmployee(true)
            setOpenDelEmployee(false)
        } else if (value === 'del') {
            setOpenAddEmployee(false)
            setOpenEditEmployee(false)
            setOpenDelEmployee(true)
        }

    }

    const handleSearch = (e) => {
        const { name, value } = e.target
        setSearchQuery(prev => ({
            ...prev,
            [name]: value
        }))
    }



    const filterEmployeee = employeeList.filter(employee => {
        const searchText = searchQuery.search.toLowerCase();
        const searchInText =
            employee.first_name.toLowerCase().includes(searchText) ||
            employee.last_name.toLowerCase().includes(searchText) ||
            employee.email.toLowerCase().includes(searchText);

        let teamMatch = false;
        const department = searchQuery.department;

        // Handle "No in a team now" filter when employee has no teams
        if (department === "No in a team now") {
            teamMatch = !employee.teams || employee.teams.length === 0;
        } else if (department) {
            // Check if any team includes the selected department string
            teamMatch = employee.teams?.some(team => team.name === department);
        } else {
            // No department filter means include everyone
            teamMatch = true;
        }

        // Return true if both search matches and team matches
        return searchInText && teamMatch;
    });


    return (
        <>
            <div className='absolute w-full h-screen'>
                <Header />
                <div className='flex flex-col gap-10 py-5 px-10 mx-auto'>

                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-bold'>Employee</h1>
                        <button onClick={() => setOpenAddEmployee(true)} className='min-w-[140px] min-h-[35px] flex items-center justify-center gap-2 cursor-pointer rounded bg-blue-500 text-white font-medium text-md'>
                            Add Employee
                        </button>
                    </div>

                    <div className='flex items-center gap-5 rounded w-full'>
                        <div className='flex items-center w-[300px] px-3 gap-2 border-2 rounded border-gray-300'>
                            <FaSearch className='w-4 h-4' />
                            <input onChange={handleSearch} name='search' value={searchQuery.search} type="search" placeholder='search by name or email' className=' py-1 w-full text-[14px] px-2 border-0 outline-0 bg-transparent' />
                        </div>
                        <select name='department' onChange={handleSearch} value={searchQuery.department} className='min-w-[100px] py-1 outline-0 text-[14px] px-2 rounded border-2 border-gray-300'>
                            <option value='Sales'>Sales</option>
                            <option value='Engineering & DevOps'>Engineering & DevOps</option>
                            <option value='Marketing'>Marketing</option>
                            <option value='No in a team now'>No in a team now</option>
                        </select>
                    </div>

                    <table className="min-w-full bg-white rounded shadow">
                        <thead className="bg-neutral-200 h-[38px]">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-neutral-700">Employee</th>
                                <th className="px-4 py-2 text-left font-semibold text-neutral-700">Email</th>
                                <th className="px-4 py-2 text-left font-semibold text-neutral-700">Phone</th>
                                <th className="px-4 py-2 text-left font-semibold text-neutral-700">Team</th>
                                <th className="px-4 py-2 text-left font-semibold text-neutral-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {filterEmployeee.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-neutral-500">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                filterEmployeee.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-neutral-50 border-b-2 border-gray-100  transition-colors">
                                        <td className="px-4 py-2">{employee.first_name} {employee.last_name}</td>
                                        <td className="px-4 py-2">{employee.email}</td>
                                        <td className="px-4 py-2">{employee.phone}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-wrap gap-1">
                                                {(!employee.teams || employee.teams.length === 0) && (
                                                    <span key={`no-team-${employee._id}`} className="text-gray-800 px-2 py-0.5 bg-gray-200 rounded text-xs">
                                                        No in a team now
                                                    </span>
                                                )}

                                                {employee.teams?.map(team => (
                                                    <span key={team.id} className=" text-gray-800 px-2 py-0.5 bg-gray-200 rounded text-xs">
                                                        {team.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <MdEdit onClick={() => {
                                                    setEmployee(employee);
                                                    handleToggle('edit');
                                                }} className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800" />
                                                <MdOutlineDeleteOutline onClick={() => {
                                                    setEmployee(employee);
                                                    handleToggle('del');
                                                }} className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
                <div style={{ zIndex: 1000 }} onClick={() => { handleToggle('add') }} className='w-10 h-10 fixed z-1 bottom-5 right-10 cursor-pointer rounded-full bg-blue-500 text-white flex justify-center items-center'>
                    {openAddEmployee ? <RxCross2 className='w-6 h-6' /> : <MdAdd className='w-6 h-6' />}
                </div>
            </div>
            {openEditEmployee && <EditEmployee employee={employee} setOpenEditEmployee={setOpenEditEmployee} />}
            {openDelEmployee && <DelComponent employee={employee} setOpenDelEmployee={setOpenDelEmployee} />}
            {openAddEmployee && <AddEmployee setOpenAddEmployee={setOpenAddEmployee} />}
        </>
    )
}

export default Employee
