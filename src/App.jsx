import React, { useState } from 'react'
import data from './data'
import Cards from './Cards'

export default function App() {

  const [mydata,setMydata]=useState(data)
  return (
    <div>
<Cards data={mydata}/>
    </div>
  )
}
