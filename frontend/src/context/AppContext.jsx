import React from 'react'

const AppContext = React.createContext({
    url: '',
    token: '',
    updateToken: () => {}
})

export default AppContext
