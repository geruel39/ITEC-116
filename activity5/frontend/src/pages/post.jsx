import { useState } from "react";
import { Header } from "../components/header";
import {LoginPopup} from "../components/login"
import { SignupPopup } from "../components/signup";

export function Post() {

    const [OpenLogin, setOpenLogin] = useState(false);
    const [OpenSignup, setOpenSignup] = useState(false);

    return (
        <div className="max-h-screen flex overflow-y-hidden">

            <LoginPopup Open={OpenLogin} Close={() => setOpenLogin(false)}/>
            <SignupPopup Open={OpenSignup} Close={() => setOpenSignup(false)}/>

            <div className="w-full">

                <Header LoginOpen={() => setOpenLogin(true)} SigninOpen={() => setOpenSignup(true)}/>

                <div className="h-full flex flex-col items-center px-20 overflow-y-scroll">

                    <div className="w-3/4 border-x-1 border-blue-400 pb-20">

                        <div className=" mt-5 p-2 border-y-1 border-blue-500 hover:bg-gray-200">

                            <div className="flex justify-center">
                                <button className="text-xl text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Post new blog</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2 border-y-1 border-blue-400">

                            <div className="border-b-1 border-gray-300">
                                <h1 className="font-semibold">Geruel Alcaraz</h1>
                                <p className="text-xs text-gray-500">12:16 PM 9/30/2025</p>
                            </div>

                            <div className="border-b-1 border-gray-300 p-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius optio exercitationem accusamus dolorem, neque debitis consequuntur quasi a officia vel mollitia veniam sit, illo odit quae nostrum sapiente, harum incidunt!</p>
                            </div>

                            <div className="flex justify-end">
                                <button className="text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Comments</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2 border-y-1 border-blue-400">

                            <div className="border-b-1 border-gray-300">
                                <h1 className="font-semibold">Geruel Alcaraz</h1>
                                <p className="text-xs text-gray-500">12:16 PM 9/30/2025</p>
                            </div>

                            <div className="border-b-1 border-gray-300 p-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius optio exercitationem accusamus dolorem, neque debitis consequuntur quasi a officia vel mollitia veniam sit, illo odit quae nostrum sapiente, harum incidunt!</p>
                            </div>

                            <div className="flex justify-end">
                                <button className="text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Comments</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2 border-y-1 border-blue-400">

                            <div className="border-b-1 border-gray-300">
                                <h1 className="font-semibold">Geruel Alcaraz</h1>
                                <p className="text-xs text-gray-500">12:16 PM 9/30/2025</p>
                            </div>

                            <div className="border-b-1 border-gray-300 p-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius optio exercitationem accusamus dolorem, neque debitis consequuntur quasi a officia vel mollitia veniam sit, illo odit quae nostrum sapiente, harum incidunt!</p>
                            </div>

                            <div className="flex justify-end">
                                <button className="text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Comments</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2 border-y-1 border-blue-400">

                            <div className="border-b-1 border-gray-300">
                                <h1 className="font-semibold">Geruel Alcaraz</h1>
                                <p className="text-xs text-gray-500">12:16 PM 9/30/2025</p>
                            </div>

                            <div className="border-b-1 border-gray-300 p-2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius optio exercitationem accusamus dolorem, neque debitis consequuntur quasi a officia vel mollitia veniam sit, illo odit quae nostrum sapiente, harum incidunt!</p>
                            </div>

                            <div className="flex justify-end">
                                <button className="text-blue-500 font-semibold cursor-pointer hover:text-blue-700">Comments</button>
                            </div>

                        </div>

                    </div>

                </div>
                
            </div>
        </div>
    );
}