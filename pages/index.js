import { useState } from "react"

export default function Home() {

const [email,setEmail] = useState("")
const [message,setMessage] = useState("")

async function saveEmail(){

const res = await fetch("/api/saveEmail",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email})
})

const data = await res.json()
setMessage(data.message)

}

return (

<div style={{
fontFamily:"Arial",
padding:"40px",
textAlign:"center"
}}>

<h1 style={{fontSize:"48px"}}>
Study Mind AI
</h1>

<p style={{fontSize:"20px"}}>
La plataforma que te ayuda a estudiar usando inteligencia artificial
</p>

<h2>
Tres capacidades principales
</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"40px",
marginTop:"40px"
}}>

<div>
<h3>Resúmenes AI</h3>
<p>Convierte textos largos en resúmenes claros</p>
</div>

<div>
<h3>Plan de estudio</h3>
<p>Organiza tus materias automáticamente</p>
</div>

<div>
<h3>Práctica inteligente</h3>
<p>Genera quizzes con inteligencia artificial</p>
</div>

</div>

<div style={{marginTop:"60px"}}>

<h2>Únete a la lista de espera</h2>

<input
placeholder="tu email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={{
padding:"10px",
fontSize:"18px",
width:"300px"
}}
/>

<br/><br/>

<button
onClick={saveEmail}
style={{
padding:"10px 30px",
fontSize:"18px",
backgroundColor:"black",
color:"white"
}}
>
Unirme
</button>

<p>{message}</p>

</div>

</div>

)
}