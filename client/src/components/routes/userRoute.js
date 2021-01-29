//protecting user route by creating our own user and then senfding to app.js so that if user goes to /user/history link should not be able to 
//get that page and not showing content
import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from './LoadingToRedirect';

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));

  return user && user.token ? (
    <Route {...rest} />
  ) : (
    <LoadingToRedirect/>
  );
};

export default UserRoute;
