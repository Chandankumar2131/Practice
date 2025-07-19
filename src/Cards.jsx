import React from 'react'
import Card from './Card';

export default function Cards(props) {
    const myData = props.data;
   
    
  return (
    <div>
{
myData.map((daata,id)=>{
 
  return(
   <div key={id}><Card allData={daata}/></div>
  )
})

}

    </div>
  )
}
