import { useState } from "react";

export function LoginPopup({Open, Close}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const Login = async () => {

    if(!username) {alert("Enter your username.")};
    if(!password) {alert("Enter your password")};

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("token", data.access_token);
        console.log(data.success);
        window.location.href = "/";
      } else {
        alert(data.message);
      }
      
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }

  }

  return (
    <div className="h-screen flex items-center justify-center bg-[rgba(10,10,10,.5)]">

      {Open && 
      (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(10,10,10,0.5)] bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={Close}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Login
            </h2>

            <div className="space-y-4">

              <div>
                
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your username" className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              
              </div>

              <div>
                
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              
              </div>

              <button onClick={Login} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Login</button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
