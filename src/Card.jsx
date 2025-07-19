import React from 'react'

export default function Card(props) {
    const finalData = props.allData;
    console.log(finalData);
    
  return (
    <div>
        <h1>{finalData.name}</h1>
        <h1>{finalData.info}</h1>
        <h1>{finalData.image}</h1>
        <h1>{finalData.price}</h1>
        </div>
  )
}
