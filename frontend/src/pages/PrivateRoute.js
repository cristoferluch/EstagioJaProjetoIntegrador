import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    console.log('Token:', token);
  
    return token 
      ? children 
      : <Navigate to="/login" />;
  };
export default PrivateRoute;
