import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import AppContext from '../context/AppContext'
import { MdSearch, MdClear, MdNavigateNext, MdNavigateBefore } from 'react-icons/md'

const Logs = () => {
  const [logsDetails, setLogsDetails] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const { url, token } = useContext(AppContext)
 
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${url}logs?limit=${limit}&page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 200 || response.status === 201) {
          console.log(response)
          const data = response.data.data
          setLogsDetails(data)
          setFilteredLogs(data)
          
          // Check if there are more pages (if we got less than limit, we're on the last page)
          setHasMore(data.length === limit)
          
          // If API provides total, use it; otherwise estimate
          if (response.data.total) {
            setTotalLogs(response.data.total)
          } else {
            // Estimate total based on current page and whether there's more data
            if (data.length < limit) {
              // This is the last page
              setTotalLogs((currentPage - 1) * limit + data.length)
            } else {
              // There might be more pages, estimate conservatively
              setTotalLogs(currentPage * limit + 1)
            }
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [url, token, currentPage, limit])

  // Search/Filter function
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLogs(logsDetails)
      return
    }

    const searchLower = searchTerm.toLowerCase()
    const filtered = logsDetails.filter(log => {
      const timestamp = log.timestamp?.toLowerCase() || ''
      const email = log.meta?.email?.toLowerCase() || ''
      const action = log.action?.toLowerCase() || ''
      
      return (
        timestamp.includes(searchLower) ||
        email.includes(searchLower) ||
        action.includes(searchLower)
      )
    })

    setFilteredLogs(filtered)
  }, [searchTerm, logsDetails])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return timestamp
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(totalLogs / limit)
  const startEntry = (currentPage - 1) * limit + 1
  const endEntry = Math.min(currentPage * limit, totalLogs)
  const canGoNext = hasMore && filteredLogs.length === limit
  const canGoPrevious = currentPage > 1

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum)
  }

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing limit
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...')
      }
      
      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className='flex flex-col gap-6 py-6 px-4 overflow-auto sm:px-8 lg:px-12'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h1 className='text-3xl font-bold text-gray-800'>Activity Logs</h1>
          
          {/* Search Bar */}
          <div className='relative w-full sm:w-auto sm:min-w-[350px]'>
            <MdSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type="text"
              placeholder='Search by timestamp, user, or action...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                <MdClear className='w-5 h-5' />
              </button>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='bg-white rounded-lg shadow p-4 border border-gray-200'>
            <p className='text-sm text-gray-600 font-medium'>Total Logs</p>
            <p className='text-2xl font-bold text-gray-800 mt-1'>{totalLogs}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-4 border border-gray-200'>
            <p className='text-sm text-gray-600 font-medium'>Current Page</p>
            <p className='text-2xl font-bold text-blue-600 mt-1'>{currentPage} / {totalPages}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-4 border border-gray-200'>
            <p className='text-sm text-gray-600 font-medium'>Showing</p>
            <p className='text-2xl font-bold text-green-600 mt-1'>{filteredLogs.length} logs</p>
          </div>
        </div>

        {/* Items per page selector */}
        <div className='flex items-center gap-3 bg-white rounded-lg shadow p-4 border border-gray-200'>
          <label htmlFor="limit" className='text-sm font-medium text-gray-700'>
            Items per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className='border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Table Section */}
        <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 font-medium">Loading logs...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <MdSearch className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500 font-medium">
                          {searchTerm ? 'No logs found matching your search' : 'No logs available'}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={handleClearSearch}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <tr 
                      key={log.id || index} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {log.meta?.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {log.meta?.email || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {log.action}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {!loading && filteredLogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg">
            {/* Showing info */}
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startEntry}</span> to{' '}
              <span className="font-medium">{endEntry}</span> of{' '}
              <span className="font-medium">{totalLogs}</span> logs
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <button
                onClick={handlePreviousPage}
                disabled={!canGoPrevious}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 font-medium text-sm transition-colors ${
                  !canGoPrevious
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MdNavigateBefore className="w-5 h-5" />
                Previous
              </button>

              {/* Page numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* Mobile page indicator */}
              <div className="sm:hidden px-3 py-1.5 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </div>

              {/* Next button */}
              <button
                onClick={handleNextPage}
                disabled={!canGoNext}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 font-medium text-sm transition-colors ${
                  !canGoNext
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
                <MdNavigateNext className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div> 
    </div>
  )
}

export default Logs