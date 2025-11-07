import { Header } from "../components/header";

export function Profile() {
    return (
        <div className="max-h-screen flex overflow-y-hidden">

            <div className="w-full">
                
                <Header/>

                <div className="h-screen flex flex-col items-center px-20 overflow-y-scroll">
                    
                    <div className="w-3/4 border-x-1 border-blue-400 pb-20">

                        <div className=" mt-5 p-2 border-y-1 border-gray-300">

                            <div className="flex justify-around items-center">
                                <p className="font-semibold">Username: <span className="font-bold">Geruel</span></p>
                                <button className="bg-blue-500 text-white font-semibold cursor-pointer p-2 rounded hover:bg-blue-600">Change Password</button>
                            </div>

                        </div>

                        <div className=" mt-5 p-2">

                            <div className="flex justify-center">
                                <button className="text-lg font-bold cursor-pointer">Your blog posts</button>
                            </div>

                        </div>

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

                        
                        
                    </div>

                </div>
            </div>
        </div>
    )
}