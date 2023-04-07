import React from 'react'

const Chess = () => {
  const arr = new Array(64).fill(0);

  return (
    <div className='w-100 mx-auto my-2'>
        <center><h2>User 1</h2></center>
        <div className='w-60 h-60 mx-auto my-2 grid grid-cols-8 grid-row-8 gap-2'>
        {arr.map((el,i)=> <div className='drop-shadow-md odd:bg-green-600 even:bg-red-950 text-lime-50 flex justify-center items-center'></div> )}

        </div>
        <center><h2>User 2</h2></center>

        
    </div>
  )
}

export default Chess