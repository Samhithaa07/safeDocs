import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function parseJwt(token) {
  try {
    const base = token.split(".")[1];
    const json = atob(base.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const token = data.access_token || data.accessToken || data.token;
      if (!token) throw new Error("No token in response");
      localStorage.setItem("token", token);

      // read role from JWT payload
      const payload = parseJwt(token);
      if (payload?.role) localStorage.setItem("role", payload.role);

      nav("/dashboard");
    } catch (e) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh",background:"#f5f6f8"}}>
      <form onSubmit={onSubmit} style={{background:"#fff",padding:24,borderRadius:12,width:360,boxShadow:"0 8px 20px rgba(0,0,0,.08)"}}>
        <h2 style={{margin:"0 0 16px"}}>Secure File Share</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          style={{width:"100%",padding:10,marginBottom:10}} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPass(e.target.value)}
          style={{width:"100%",padding:10,marginBottom:12}} />
        {err && <div style={{color:"#c00",marginBottom:8}}>{err}</div>}
        <button style={{width:"100%",padding:10,background:"#1f6feb",color:"#fff",border:"none",borderRadius:8,cursor:"pointer"}}>
          Login
        </button>
      </form>
    </div>
  );
}