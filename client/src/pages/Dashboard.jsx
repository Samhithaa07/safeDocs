import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [myFiles, setMyFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [useAll, setUseAll] = useState(false);
  const [busy, setBusy] = useState(false);

  const role = localStorage.getItem("role") || "user";
  const isAdmin = role === "admin";

  async function load() {
    setBusy(true);
    try {
      if (useAll && isAdmin) {
        const { data } = await api.get("/files/admin/all");
        setAllFiles(data);
      } else {
        const { data } = await api.get("/files");
        setMyFiles(data);
      }
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    setBusy(true);
    try {
      await api.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await load();
    } catch {
      alert("Upload failed (type/size?)");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  function DownloadLink({ id, name }) {
    const base = import.meta.env.VITE_API_BASE || "http://localhost:3000";
    return (
      <a href={`${base}/files/${id}/download`} target="_blank" rel="noreferrer">
        {name}
      </a>
    );
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [useAll]);

  const list = useAll && isAdmin ? allFiles : myFiles;

  return (
    <div style={{maxWidth:900,margin:"40px auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0}}>Secure File Share</h2>
        <div>
          <span style={{marginRight:12,opacity:.8}}>Role: {role}</span>
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            style={{padding:"6px 10px",border:"1px solid #ddd",background:"#fff",borderRadius:6,cursor:"pointer"}}>
            Logout
          </button>
        </div>
      </header>

      <section style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
        <input type="file" onChange={onUpload} />
        {isAdmin && (
          <label style={{display:"inline-flex",alignItems:"center",gap:6}}>
            <input type="checkbox" checked={useAll} onChange={e=>setUseAll(e.target.checked)} />
            Admin view (all files)
          </label>
        )}
        {busy && <span style={{marginLeft:8,opacity:.7}}>Loading…</span>}
      </section>

      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left",borderBottom:"1px solid #eee"}}>
            <th style={{padding:"8px 6px"}}>File</th>
            <th style={{padding:"8px 6px"}}>Type</th>
            <th style={{padding:"8px 6px"}}>Size</th>
            <th style={{padding:"8px 6px"}}>Added</th>
          </tr>
        </thead>
        <tbody>
          {list.map((f) => (
            <tr key={f.id} style={{borderBottom:"1px solid #f2f2f2"}}>
              <td style={{padding:"8px 6px"}}><DownloadLink id={f.id} name={f.originalName} /></td>
              <td style={{padding:"8px 6px"}}>{f.mimetype}</td>
              <td style={{padding:"8px 6px"}}>{Math.round((f.size || 0)/1024)} KB</td>
              <td style={{padding:"8px 6px"}}>{new Date(f.createdAt || Date.now()).toLocaleString()}</td>
            </tr>
          ))}
          {!list.length && (
            <tr><td colSpan={4} style={{padding:"12px 6px",opacity:.7}}>No files yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}