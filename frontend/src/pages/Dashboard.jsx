import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import AppContext from '../context/AppContext'
import axios from 'axios'
import { 
  MdPeople, 
  MdGroups, 
  MdHistory, 
  MdPersonAdd, 
  MdGroupAdd,
  MdTrendingUp,
  MdAccessTime,
  MdCheck
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DashBoard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTeams: 0,
    totalLogs: 0,
    recentActivities: 0
  })
  const [employees, setEmployees] = useState([])
  const [teams, setTeams] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { url, token, user } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchDashboardData()
  }, [url, token])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [employeesRes, teamsRes, logsRes] = await Promise.all([
        axios.get(`${url}employees`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${url}teams`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${url}logs?limit=5`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (employeesRes.status === 200) {
        setEmployees(employeesRes.data.data)
      }
      if (teamsRes.status === 200) {
        setTeams(teamsRes.data.data)
      }
      if (logsRes.status === 200) {
        setRecentLogs(logsRes.data.data)
      }

      setStats({
        totalEmployees: employeesRes.data.data?.length || 0,
        totalTeams: teamsRes.data.data?.length || 0,
        totalLogs: logsRes.data.total || logsRes.data.data?.length || 0,
        recentActivities: logsRes.data.data?.length || 0
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const getTeamDistributionData = () => {
    return teams.map(team => ({
      name: team.name,
      members: team.employeeCount || 0
    }))
  }

  const getEmployeesByTeamData = () => {
    const assigned = employees.filter(emp => emp.teams && emp.teams.length > 0).length
    const unassigned = employees.length - assigned
    return [
      { name: 'Assigned to Teams', value: assigned },
      { name: 'Unassigned', value: unassigned }
    ]
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timestamp
    }
  }

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color} hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')}`}>
          <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  )



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-6 px-4 sm:px-8 lg:px-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Admin'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your organization today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={MdPeople}
            title="Total Employees"
            value={stats.totalEmployees}
            color="border-blue-500"
            onClick={() => navigate('/employees')}
          />
          <StatCard
            icon={MdGroups}
            title="Total Teams"
            value={stats.totalTeams}
            color="border-green-500"
            onClick={() => navigate('/teams')}
          />
          <StatCard
            icon={MdHistory}
            title="Activity Logs"
            value={stats.totalLogs}
            color="border-purple-500"
            onClick={() => navigate('/logs')}
          />
          <StatCard
            icon={MdTrendingUp}
            title="Recent Actions"
            value={stats.recentActivities}
            color="border-orange-500"
            onClick={() => navigate('/logs')}
          />
        </div>

       

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Team Distribution Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team Distribution</h3>
            {teams.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTeamDistributionData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>No teams to display</p>
              </div>
            )}
          </div>

          {/* Employee Assignment Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Assignment Status</h3>
            {employees.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getEmployeesByTeamData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getEmployeesByTeamData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>No employees to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities and Top Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
                <button
                  onClick={() => navigate('/logs')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentLogs.length > 0 ? (
                <div className="space-y-4">
                  {recentLogs.map((log, index) => (
                    <div key={log.id || index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdCheck className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {log.meta?.email || 'System'} • {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MdHistory className="w-12 h-12 mx-auto mb-2" />
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Teams */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Teams Overview</h3>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.slice(0, 5).map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          COLORS[index % COLORS.length] === '#3B82F6' ? 'bg-blue-100' :
                          COLORS[index % COLORS.length] === '#10B981' ? 'bg-green-100' :
                          COLORS[index % COLORS.length] === '#F59E0B' ? 'bg-yellow-100' :
                          COLORS[index % COLORS.length] === '#EF4444' ? 'bg-red-100' :
                          'bg-purple-100'
                        }`}>
                          <MdGroups className={`w-5 h-5 ${
                            COLORS[index % COLORS.length] === '#3B82F6' ? 'text-blue-600' :
                            COLORS[index % COLORS.length] === '#10B981' ? 'text-green-600' :
                            COLORS[index % COLORS.length] === '#F59E0B' ? 'text-yellow-600' :
                            COLORS[index % COLORS.length] === '#EF4444' ? 'text-red-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{team.name}</h4>
                          <p className="text-xs text-gray-500">{team.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{team.employeeCount || 0}</p>
                        <p className="text-xs text-gray-500">members</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MdGroups className="w-12 h-12 mx-auto mb-2" />
                  <p>No teams yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Info Footer */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Human Resource Management System</h3>
              <p className="text-sm text-blue-100 mt-1">Efficiently manage your organization's workforce</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MdAccessTime className="w-5 h-5" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard