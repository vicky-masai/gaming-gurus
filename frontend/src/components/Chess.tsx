import React from 'react'

const Chess = () => {
  const arr = new Array(64).fill(0);

  return (
    <div className='w-100 mx-auto my-2'>
        <center><img src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png" className="flex justify-center drop-shadow-md" style={{width:"100px", height:"100px", borderRadius:"50%", alignItems:"center"}} />
        <h2>Vicky</h2>
        </center>
        <div style={{width:"60%", height:"600px", display:"grid", gridTemplateColumns:"repeat(8, 1fr)", gridTemplateRows:"repeat(8,1fr)",margin:"10px auto",gap:"10px"}}>
        {arr.map((el,i)=> <div className='drop-shadow-md odd:bg-green-600 even:bg-red-950 text-lime-50 flex justify-center items-center'></div> )}

        </div>
        <center><img src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png" className="flex justify-center drop-shadow-md" style={{width:"100px", height:"100px", borderRadius:"50%", alignItems:"center"}} />
        <h2>Abhisek</h2>
        </center>

        
    </div>
  )
}

export default Chess