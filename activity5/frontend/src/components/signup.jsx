import { useState } from "react";

export function SignupPopup({Open, Close}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const sendRegistration = async () => {

    if (password != repassword) {
      alert("Password do not match.")
      return;
    };

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        window.location.href = "/";
      } else {
        alert(data.message);
      }
      
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }

  };

  return (
    <div className="h-screen flex items-center justify-center bg-[rgba(10,10,10,.5)]">

      {Open && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(10,10,10,0.5)] bg-opacity-50">
          
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">

            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={Close}> ✕ </button>

            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Signup</h2>

            <div className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your username" className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              
              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              
              </div>

              <div>
                
                <label className="block text-sm font-medium text-gray-700">Re-Enter Password</label>
                <input onChange={(e) => setRepassword(e.target.value)} type="password" placeholder="Re-Enter your password" className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              
              </div>

              <button onClick={sendRegistration} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Signup</button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
