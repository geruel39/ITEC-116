import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Post } from "./pages/post";
import { Profile } from "./pages/profile";
import { PrivatePage } from "./PrivatePage";

function App() {

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="w-full">

      <Routes>
        <Route path="/" element={< Post/>}/>
        <Route path="/profile" element={<PrivatePage> <Profile/> </PrivatePage>} />
      </Routes>

    </div>
  );
}

export default App;
