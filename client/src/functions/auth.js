import axios from 'axios';

export const createOrUpdateUser= async (authToken) =>{
    //sending post request to our api
    return await axios.post(`${process.env.REACT_APP_API}/create-or-update-user`,{},{
      headers:{
        authToken,
      },
    });
  };
 
  export const currentUser= async (authToken) =>{
    //sending post request to our api
    return await axios.post(`${process.env.REACT_APP_API}/current-user`,{},{
      headers:{
        authToken,
      },
    });
  };

  //for checking admin role

  export const currentAdmin= async (authToken) =>{
    //sending post request to our api
    return await axios.post(`${process.env.REACT_APP_API}/current-admin`,{},{
      headers:{
        authToken,
      },
    });
  };
