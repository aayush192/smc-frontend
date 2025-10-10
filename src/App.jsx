import { useState,useContext ,useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import LoginPage from './components/login.jsx'
import api from './api/axios.js'
import RegisterForm from './components/register.jsx'
import Attendance from './components/addAttendence.jsx'
import AddDepartment from './components/addDepartment.jsx'
import Context from './context/context.js'
import './App.css'
import AddCourse from './components/addCourse.jsx'
import Header from './components/header.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ResultForm from './components/addResult.jsx'
import AddTeacher from './components/addTeacher.jsx'
import Dashboard from './components/dashboard.jsx'
import StudentsByDepartment from './components/students.jsx'
import ProfileMenu from './components/profile.jsx'
import StudentProfile from './components/profile.jsx'
import Departments from './components/department.jsx'
import CoursesPage from './components/course.jsx'
import TeachersPage from './components/teacher.jsx'
import { ToastContainer } from 'react-toastify'
import ChangePassword from './components/changePassword.jsx'
import UpdateResult from './components/updateResult.jsx'

function App() {
  const {department,setDepartment,course,setCourse}=useContext(Context);
  useEffect(() => {
    const getDepartments= async () => {
      try {
        const response = await api.get('/department');
        if (response) {
          console.log(response);
          setDepartment(response.data.result); // set array from backend
        } else {
          console.warn("No data returned from /department");
        }
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    const getCourses= async () => {
      try {
        const response = await api.get('/course');
        if (response) {
          console.log(response);
          setCourse(response.data.result||[]); // set array from backend
          console.log('course fetched successfully');
        } else {
          console.warn("No data returned from /department");
        }
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    getDepartments();
    getCourses();

  },[]);
  

  const MainLayout=()=>{
    return(
    <>
    <Header/>
    <ToastContainer/>
    <Outlet/>
    </>
    )
  }
  const AuthLayout=()=>{
    return(
    <>
    <Outlet/>
    </>
    )
  }
  

  return (
    <Router>
    <Routes>
    <Route element={<MainLayout/>}>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/profile' element={<StudentProfile/>}/>
    <Route path='/department' element={<Departments/>}/>
    <Route path='/teacher' element={<TeachersPage/>}/>
    <Route path='/course' element={<CoursesPage/>}/>
    <Route path='/addCourse' element={<AddCourse/>}/>
    <Route path='/addDepartment' element={<AddDepartment/>}/>
    <Route path='/changePassword' element={<ChangePassword/>}/>
    <Route path='/getstudentbydepartment' element={<StudentsByDepartment/>}/>
    <Route path='/register' element={<RegisterForm/>}/>
    <Route path='/addTeacher' element={<AddTeacher/>}/>
    <Route path='/addAttendance' element={<Attendance/>}/>
    <Route path='/addResult' element={<ResultForm/>}/>
    <Route path='/updateResult' element={<UpdateResult/>}/>
    </Route>
     <Route element={<AuthLayout/>}>
    <Route path='/login' element={<LoginPage/>}/>
    </Route>
    </Routes>
    </Router>
  )
}

export default App;
