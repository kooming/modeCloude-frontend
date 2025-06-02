import React, { useState } from 'react'


const useInput = (initstate) => {
    const [value, setvalue] = useState(initstate);
    const setvaluehandler = (e) => {
        console.log(e.target)
        setvalue(e.target.value)
    }
    return [
        value, setvaluehandler ,setvalue
    ]
}

export default useInput