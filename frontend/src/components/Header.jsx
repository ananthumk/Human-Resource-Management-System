import React, { useState, useEffect } from 'react'
import logo from '../assets/hrms-logo.jpg'
import { useNavigate, useLocation } from 'react-router-dom'
import { MdMenu, MdClose, MdHome, MdPeople, MdGroups, MdHistory, MdLogout } from 'react-icons/md'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
    setIsMenuOpen(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { icon: MdHome, label: 'Home', path: '/' },
    { icon: MdHistory, label: 'Logs', path: '/logs' },
    { icon: MdPeople, label: 'Employees', path: '/employee' },
    { icon: MdGroups, label: 'Teams', path: '/teams' },
  ]

  return (
    <div className='flex  flex-col'>
      <header 
        className={`${
          scrolled 
            ? 'bg-white shadow-lg border-b border-gray-300' 
            : 'bg-white border-b-2 border-gray-200'
        } w-full top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        <div className='py-3 px-4 sm:px-6 lg:px-10 flex items-center justify-between'>
          
          {/* Logo */}
          <img 
            onClick={() => handleNavigate('/')} 
            src={logo} 
            alt='HRMS Logo' 
            className='h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity'
          />

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-2'>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <item.icon className='w-5 h-5' />
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 ml-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md hover:shadow-lg'
            >
              <MdLogout className='w-5 h-5' />
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 bg-white text-bg-9000 rounded-md  transition-colors'
            aria-label='Toggle menu'
          >
            {isMenuOpen ? (
              <MdClose className='w-6 h-6' />
            ) : (
              <MdMenu className='w-6 h-6' />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className='fixed top-[68px] right-4 md:hidden z-50 animate-slide-down'>
          <div className='bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden'>
            <nav className='py-4 px-4 flex flex-col gap-1'>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className='w-5 h-5' />
                  {item.label}
                </button>
              ))}
              <div className='border-t border-gray-700 my-2'></div>
              <button
                onClick={handleLogout}
                className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md w-full'
              >
                <MdLogout className='w-5 h-5' />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className='md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Header