import React, { useContext, useState, useEffect } from 'react'
import Header from '../components/Header'
import AppContext from '../context/AppContext'
import { MdEdit, MdOutlineDeleteOutline, MdAdd, MdPeople, MdCheck, MdClose } from "react-icons/md";
import axios from 'axios'
import CreateTeam from '../components/CreateTeam';

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [editTeamId, setEditTeamId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [addForm, setAddForm] = useState(true)
  const { url, token } = useContext(AppContext)

  useEffect(() => {
    const fetchTeam = async () => {
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
    fetchTeam()
  }, [url, token])

  const startEditing = (team) => {
    setEditTeamId(team.id)
    setEditForm({ name: team.name, description: team.description })
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
        // Update locally without refetching
        setTeams(prev => prev.map(t => (t.id === id ? { ...t, ...editForm } : t)))
        cancelEditing()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTeam = async (id) => {
    try {
      const response = await axios.delete(`${url}teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setTeams(prev => prev.filter(t => t.id !== id))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-4 px-2 sm:px-8 lg:px-20 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold text-gray-800">Teams</h1>
          <button onClick={() => {setAddForm(true)}} className="max-w-[200px] cursor-pointer py-2 px-4 bg-green-600 text-md font-semibold rounded-md text-white flex items-center gap-2">
            <MdAdd className="w-5 h-5" />
            Create Team
          </button>
        </div>

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
                    className="w-full border border-gray-300 rounded px-3 py-2 text-md font-semibold"
                    placeholder="Team Name"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                    rows={3}
                    placeholder="Team Description"
                  />
                  <div className="flex gap-3 items-center justify-end">
                    <button
                      onClick={() => saveEdit(team.id)}
                      className="text-green-600 hover:text-green-800"
                      aria-label="Save"
                    >
                      <MdCheck size={28} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Cancel"
                    >
                      <MdClose size={28} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700">{team.name}</h3>
                      <p className="text-sm text-gray-600">{team.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(team.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MdEdit
                        onClick={() => startEditing(team)}
                        className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800"
                        title="Edit Team"
                      />
                      <MdOutlineDeleteOutline
                        onClick={() => deleteTeam(team.id)}
                        className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-800"
                        title="Delete Team"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdPeople className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">{team.employeeCount} {team.employeeCount === 1 ? 'Member' : 'Members'}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-800 mb-1">Employees:</p>
                    <ul className="list-disc list-inside text-sm pl-2">
                      {team.employees?.map(emp => (
                        <li key={emp.id} className="mb-1">
                          {emp.first_name} {emp.last_name} — <span className="text-gray-500">{emp.email}</span>
                        </li>
                      ))}
                      {!team.employees?.length && <li className="text-gray-400">No employees</li>}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    {addForm && <CreateTeam setAddForm={setAddForm} />}
    </>
  )
}

export default Teams
