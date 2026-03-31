import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import UserRegister from '../components/UserRegister';
import UserLogin from '../components/UserLogin';
import FoodPartnerRegister from '../components/FoodPartnerRegister';
import FoodPartnerLogin from '../components/foodPartnerLogin';
import Home from '../components/general/Home';
import CreateFood from '../components/foodPartner/CreateFood';
import Dashboard from '../components/foodPartner/Dashboard';
const appRoutes = () => {
 

  return (
    <div>
      <Router>
        <Routes>

          <Route path='/user/register' element={<UserRegister/>}></Route>
          <Route path='/user/login' element={<UserLogin/>}></Route>

          <Route path='/food-partner/register' element={<FoodPartnerRegister/>}></Route>

          <Route path='/food-partner/login'  element={<FoodPartnerLogin/>}></Route>

          <Route path='/' element={<Home/>}></Route>

          <Route path='/create-food' element={<CreateFood/>}></Route>

          <Route path='/food-partner/:id' element={<Dashboard/>}></Route>

        </Routes>
      </Router>
    </div>
  )
}

export default appRoutes;
