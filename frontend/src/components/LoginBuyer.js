import axios from "axios";
import { useState } from "react";

export default function LoginBuyer(){

    if(sessionStorage.getItem("sAyurCenReyub") !== null){
        window.location.replace("/buyerhome");
    }

    const [email, setEmail] = useState({});
    const [password, setPassword] = useState({});

    function validate(e){
        e.preventDefault();
        axios.get(`http://localhost:8070/buyer/get/email/${email}`).then((res)=>{
            if (res.data[0].password === password){
                sessionStorage.setItem("sAyurCenReyub", Math.random().toString());
                window.location.replace(`http://localhost:3000/buyerhome`);
            }
            else{
                alert("Invalid Credentials !");
            }
        }).catch((err)=>{
            alert("Please register your account !");
        })
    }

    return(
        <div>
            <a href="/"><button>Back</button></a>

            <h1>This is Buyer Login</h1>

            <form onSubmit={validate}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="abc@gmail.com" required onChange={(e)=>{
                    setEmail(e.target.value);
                }}/>

                <br></br>

                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Password" required onChange={(e)=>{
                    setPassword(e.target.value);
                }}/>

                <br></br>

                <button type="submit">Login</button>
            </form>
        </div>
    )
}