import React from "react";
import Table from "./Table";
import { BrowserRouter,Routes,Route } from "react-router-dom";



function App() {
  return (
    <>
     <BrowserRouter>
     <Routes>
      {/* // http://localhost:3000 */}
      <Route path='/' element={<Table/>}></Route>
      {/* // http://localhost:3000/stock */}
      <Route path='/stock' element={<Table/>} ></Route>
    

     </Routes>
     </BrowserRouter>
    </>
   
    
  );
}

export default App;
