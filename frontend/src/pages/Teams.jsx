import React, { useContext, useState, useEffect } from 'react'
import Header from '../components/Header'
import AppContext from '../context/AppContext'
import { MdEdit, MdOutlineDeleteOutline, MdAdd, MdPeople, MdCheck, MdClose } from "react-icons/md";
import { IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import axios from 'axios'
import CreateTeam from '../components/CreateTeam';

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [employees, setEmployee] = useState([])
  const [editTeamId, setEditTeamId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [addMemberTeamId, setAddMemberTeamId] = useState(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [addForm, setAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { url, token } = useContext(AppContext)

  const fetchTeams = async () => {
    if (!token) return
    try {
      const response = await axios.get(`${url}teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        setTeams(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchEmployee = async () => {
    if (!token) return
    try {
      const response = await axios.get(`${url}employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200 || response.status === 201) {
        setEmployee(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTeams()
    fetchEmployee()
  }, [url, token])

  const startEditing = (team) => {
    setEditTeamId(team.id)
    setEditForm({ name: team.name, description: team.description })
    setAddMemberTeamId(null) // Close add member form when editing
  }

  const cancelEditing = () => {
    setEditTeamId(null)
    setEditForm({ name: '', description: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${url}teams/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setTeams(prev => prev.map(t => (t.id === id ? { ...t, ...editForm } : t)))
        cancelEditing()
        showMessage('success', 'Team updated successfully!')
      }
    } catch (error) {
      console.log(error)
      showMessage('error', 'Failed to update team')
    }
  }

  const deleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return
    
    try {
      const response = await axios.delete(`${url}teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setTeams(prev => prev.filter(t => t.id !== id))
        showMessage('success', 'Team deleted successfully!')
      }
    } catch (error) {
      console.log(error)
      showMessage('error', 'Failed to delete team')
    }
  }

  const toggleAddMember = (teamId) => {
    if (addMemberTeamId === teamId) {
      setAddMemberTeamId(null)
      setSelectedEmployeeId('')
    } else {
      setAddMemberTeamId(teamId)
      setSelectedEmployeeId('')
      setEditTeamId(null) // Close edit form when adding member
    }
  }

  const handleAddMember = async (teamId) => {
    if (!selectedEmployeeId) {
      showMessage('error', 'Please select an employee')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${url}teams/${teamId}/assign`,
        { employeeId: selectedEmployeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200 || response.status === 201) {
        showMessage('success', 'Member added successfully!')
        await fetchTeams() // Refresh teams to show updated member list
        setAddMemberTeamId(null)
        setSelectedEmployeeId('')
      }
    } catch (error) {
      console.log(error)
      showMessage('error', error.response?.data?.error || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (teamId, employeeId) => {
    if (!window.confirm('Are you sure you want to remove this member from the team?')) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${url}teams/${teamId}/unassign`,
        { employeeId: employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200 || response.status === 201) {
        showMessage('success', 'Member removed successfully!')
        await fetchTeams() // Refresh teams to show updated member list
      }
    } catch (error) {
      console.log(error)
      showMessage('error', error.response?.data?.error || 'Failed to remove member')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => {
      setMessage({ type: '', text: '' })
    }, 3000)
  }

  // Filter out employees who are already in the team
  const getAvailableEmployees = (team) => {
    const teamEmployeeIds = team.employees?.map(emp => emp.id) || []
    return employees.filter(emp => !teamEmployeeIds.includes(emp.id))
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-4 px-2 sm:px-8 lg:px-20 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <h1 className="text-2xl font-extrabold text-gray-800">Teams</h1>
            <button
              onClick={() => setAddForm(true)}
              className="max-w-[200px] cursor-pointer py-2 px-4 bg-green-600 text-md font-semibold rounded-md text-white flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <MdAdd className="w-5 h-5" />
              Create Team
            </button>
          </div>

          {/* Message Toast */}
          {message.text && (
            <div
              className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slide-in ${
                message.type === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {message.text}
            </div>
          )}

          {teams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No teams yet. Create your first team!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <div
                  key={team.id}
                  className="bg-white border border-gray-200 shadow-md rounded-xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-xl"
                >
                  {editTeamId === team.id ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Team Name"
                      />
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Team Description"
                      />
                      <div className="flex gap-3 items-center justify-end">
                        <button
                          onClick={() => saveEdit(team.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          aria-label="Save"
                        >
                          <MdCheck size={28} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Cancel"
                        >
                          <MdClose size={28} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-blue-700">{team.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(team.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <MdEdit
                            onClick={() => startEditing(team)}
                            className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                            title="Edit Team"
                          />
                          <MdOutlineDeleteOutline
                            onClick={() => deleteTeam(team.id)}
                            className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                            title="Delete Team"
                          />
                        </div>
                      </div>
                      <div className='flex w-full items-center justify-between'>
                        <div className="flex items-center gap-2">
                          <MdPeople className="w-4 h-4 text-gray-700" />
                          <span className="text-sm font-medium text-gray-900">
                            {team.employeeCount || 0} {team.employeeCount === 1 ? 'Member' : 'Members'}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleAddMember(team.id)}
                          className="flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <IoPersonAdd className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {addMemberTeamId === team.id ? 'Cancel' : 'Add Member'}
                          </span>
                        </button>
                      </div>

                      {/* Add Member Form */}
                      {addMemberTeamId === team.id && (
                        <div className='w-full flex flex-col gap-2 bg-blue-50 p-3 rounded-md'>
                          <label className='text-xs font-semibold text-gray-700'>Select Employee</label>
                          <select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className='w-full text-sm py-2 px-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            <option value="">-- Select an employee --</option>
                            {getAvailableEmployees(team).map((employee) => (
                              <option
                                key={employee.id}
                                value={employee.id}
                                className="text-sm"
                              >
                                {employee.first_name} {employee.last_name} ({employee.email})
                              </option>
                            ))}
                          </select>
                          <div className='grid grid-cols-2 gap-2'>
                            <button
                              onClick={() => handleAddMember(team.id)}
                              disabled={loading || !selectedEmployeeId}
                              className='text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 border-0 rounded-md text-white py-2 font-medium transition-colors'
                            >
                              {loading ? 'Adding...' : 'Add'}
                            </button>
                            <button
                              onClick={() => toggleAddMember(team.id)}
                              disabled={loading}
                              className='text-sm bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 border-0 rounded-md text-gray-700 py-2 font-medium transition-colors'
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Employees List */}
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-800 mb-2">Team Members:</p>
                        <ul className="space-y-2">
                          {team.employees && team.employees.length > 0 ? (
                            team.employees.map(emp => (
                              <li
                                key={emp.id}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {emp.first_name} {emp.last_name}
                                  </p>
                                  <p className="text-xs text-gray-500">{emp.email}</p>
                                </div>
                                <button
                                  onClick={() => handleRemoveMember(team.id, emp.id)}
                                  disabled={loading}
                                  className="text-red-600 hover:text-red-800 disabled:text-red-300 transition-colors"
                                  title="Remove member"
                                >
                                  <IoPersonRemove className="w-5 h-5" />
                                </button>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 text-sm italic">No employees assigned</li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {addForm && <CreateTeam setAddForm={setAddForm} onTeamCreated={fetchTeams} />}
    </>
  )
}

export default Teams