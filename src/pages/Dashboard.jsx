import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      
      <div className="bg-neutral-900 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">

        {/* top 2 boxes in a row */}
        <div className="flex w-full gap-4 h-2/3">
          <div className="bg-neutral-800 p-4 border-t border-neutral-700 rounded-xl w-1/5 h-full overflow-auto shadow-md">
          
          <ul className=" my-7 p-2 space-y-2">
              
              <li className="list-none text-white text-base font-regular py-2 px-5 cursor-pointer hover:bg-neutral-850 hover:rounded-md flex items-center gap-3">
                <img src="/icons/dashboard.svg" alt="Dashboard" className="w-5 invert h-5" />
                Dashboard
              </li>
              
              <li className="list-none text-lg py-2 px-5 font-regular cursor-pointer hover:bg-neutral-850 hover:rounded-md flex items-center gap-3">
                <img src="/icons/tasks.svg" alt="Tasks" className="w-5 invert  h-5" />
                Tasks
              </li>
              
              <li className="list-none text-lg py-2 px-5 font-regular cursor-pointer hover:bg-neutral-850 hover:rounded-md flex items-center gap-3">
                <img src="/icons/profile.svg" alt="Profile" className="w-5 invert  h-5" />
                Profile
              </li>
              
              <li className="list-none text-lg py-2 px-5 font-regular cursor-pointer hover:bg-neutral-850 hover:rounded-md flex items-center gap-3">
                <img src="/icons/logout.svg" alt="Logout" className="w-5 invert  h-5" />
                Logout
              </li>
            
            </ul>
          
          </div>
          
          {/* <div className="bg-neutral-900 p-4 rounded-xl w-3/5 h-full overflow-auto shadow-md"></div> */}
          
          <div className="bg-neutral-800 p-4 border-t border-neutral-700 rounded-xl w-4/5 h-full overflow-auto shadow-md"></div>
        
        </div>

        {/* bottom div */}
        
        <div className="bg-neutral-800 p-4 border-t border-neutral-700 rounded-xl w-full h-1/2 overflow-auto shadow-md"></div>

      </div>
    </Layout>
  );
}