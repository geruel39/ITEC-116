import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export function Header({LoginOpen, SigninOpen}) {

    const [user, setUser] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded.username);
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
    }, []);

    const Logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };


    return (
        <div className="w-full h-16 flex items-center justify-between border-b-1 border-blue-400 px-5">

            <Link to={"/"}>
                <div className="">
                    <h1 className="text-2xl text-center">Bulog.<span className="text-blue-500">web</span></h1>
                </div>
            </Link>

            <div className={!token ? `flex items-center space-x-3` : `hidden`}>
                
                <button className="w-16 p-1 border-1 rounded cursor-pointer transition duration-300 hover:bg-blue-500 hover:border-blue-500"
                    onClick={LoginOpen}>Login</button>

                <button className="w-16 p-1 border-1 rounded cursor-pointer transition duration-300 hover:bg-blue-500 hover:border-blue-500"
                    onClick={SigninOpen}>Signup</button>

            </div>

            <div className={token ? `flex items-center space-x-3` : `hidden`}>
                
                <Link to={"/profile"}><p className="font-bold cursor-pointer hover:text-blue-500 text-lg" >{user}</p></Link>
                <p onClick={Logout} className="font-semibold cursor-pointer hover:text-red-500">Logout</p>

            </div>

        </div>
    )
}