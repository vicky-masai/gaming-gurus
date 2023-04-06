

export default function App() {
  const arr = new Array(64).fill(0);
  return (
    <div style={{width:"60%", height:"auto", backgroundColor:"blue", color:"white", display:"grid",gridTemplateColumns:"repeat(8, 1fr)", gridTemplateRows:"repeat(8,1fr)", justifyContent:"center", alignItems:"center"}}>
      {arr.map((el,i)=> <div style={{border:"1px solid red", margin:"20px"}}>{i+1}</div> )}
    </div>
  )
}