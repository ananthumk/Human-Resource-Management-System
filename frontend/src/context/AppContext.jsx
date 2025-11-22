import React from 'react'

const AppContext = React.createContext({
    url: '',
    token: '',
    setToken: () => {}
})

export default AppContext
