import React, { useState } from 'react'
import data from './data'
import Cards from './Cards'
import CaseConverter from './components/CaseConverter'

export default function App() {

  const [mydata,setMydata]=useState(data)
  return (
    <div>
{/* <Cards data={mydata}/> */}
<CaseConverter/>
    </div>
  )
}
