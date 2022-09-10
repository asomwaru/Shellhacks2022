//import React from "react";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="bg-slate-900  min-h-screen">
      <header className="">
      <svg width="20" height="20" mlns="http://www.w3.org/2000/svg" viewBox="0 0 12px 12px">
        <path fill="#ffffff" d="M16 6C14.36 6 13 7.36 13 9V21H15V9C15 8.43 15.43 8 16 8H17C17.57 8 18 8.43 18 9V10C18 10.57 17.57 11 17 11H16V13H17C17.57 13 18 13.43 18 14V15C18 15.57 17.57 16 17 16H16V18H17C18.65 18 20 16.65 20 15V14C20 13.18 19.59 12.46 19 12C19.59 11.54 20 10.82 20 10V9C20 7.36 18.65 6 17 6M7 9C5.36 9 4 10.36 4 12V15C4 16.65 5.36 18 7 18H7.7C8.2 18 8.65 17.81 9 17.5V18H11V9H9V9.5C8.65 9.19 8.2 9 7.7 9M7 11H8C8.57 11 9 11.43 9 12V15C9 15.57 8.57 16 8 16H7C6.43 16 6 15.57 6 15V12C6 11.43 6.43 11 7 11Z" />
      </svg>
        <h1 className='text-white font-bold text-3xl'>Gibbrish</h1>
      </header>

      

      <body>

      
       <div class="grid grid-cols-3 gap-2 place-content-center h-48 ...">
        
         <div class="pl-96"> <button class="bg-white hover:bg-sky-700 ">Translate</button>
        
           </div>
        
      
         <div class = "pl-60 text-white font-bold text-3xl"> or 
         </div>
        
        
        
         <div class = "pl-12"> <button class="bg-white hover:bg-sky-700 ">Simplify</button></div>

       </div>
       


      </body>

      
    
    </div>

    
  );
}

export default App;
