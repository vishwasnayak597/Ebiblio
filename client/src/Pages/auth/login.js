import React,{useState,useEffect} from 'react';
import { auth,googleAuthProvider } from "../../firebase/firebase";
//for toast notifications with css
import { toast} from "react-toastify";
import {MailOutlined,GoogleOutlined } from '@ant-design/icons';
import {Button} from 'antd';
import { useDispatch } from "react-redux";
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import {createOrUpdateUser} from '../../functions/auth';



const Login = ({history}) => {
   
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    //to show loading symbol while loading
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
      let intended = history.location.state;
      if (intended) {
        return;  //continue next process
      } else {
        if (user && user.token) history.push("/"); //push to homepage if logged in
      }
    }, [user, history]);

     let dispatch = useDispatch();
      
     //routing based on user role
     const roleBasedRedirect = (res) => {
       //check if intended and trying to login push back to orginal page
       let intended=history.location.state; //from starmodal
       if(intended){
         history.push(intended.from)
       }
       else{
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/shop");
      }
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        //get email and pswd from firebase and wait till it loads
      const result = await auth.signInWithEmailAndPassword(email, password);
      
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      //once we get token send user token we send it to backend as authtoken as given above
       createOrUpdateUser(idTokenResult.token)
       .then((res) => {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            name: res.data.name,
            email: res.data.email,
            token: idTokenResult.token,
            role: res.data.role,
            _id: res.data._id,
          },
        });
        roleBasedRedirect(res);
      })
      .catch();

    history.push("/");
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    setLoading(false);
  }
};


   //google login
    const googleLogin = async () => {
        auth
          .signInWithPopup(googleAuthProvider) //popup window will appear
          .then(async (result) => {  //also can use try like before
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            createOrUpdateUser(idTokenResult.token)
       .then((res) => {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            name: res.data.name,
            email: res.data.email,
            token: idTokenResult.token,
            role: res.data.role,
            _id: res.data._id,
          },
        });
        roleBasedRedirect(res);
      })
      .catch();
            history.push("/");
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.message);
          });
      };

    const loginForm=()=> (<form onSubmit={handleSubmit}>
        <div className="form-group">
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} 
        placeholder="Your Email" autoFocus></input>  <br/>
        </div>
        <div className="form-group">
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} 
        placeholder="Your Password"></input>  <br/>
        </div>
        <Button type="primary" onClick={handleSubmit} block shape='round' className="mb-3" 
        icon={<MailOutlined/>} size="large"  disabled={!email || password.length < 6}>Login with Email</Button>
    </form>
    );
    return (
        <div className="container p-5">
         <div className="row">
             <div className="col-md-6 offset-md-3">
                 {loading?(<h3 className="text-danger">Loading...</h3> ) : ( <h3>Login</h3>)}
                 {loginForm()}
            <Button
            onClick={googleLogin} type="danger" className="mb-3" block shape="round" icon={<GoogleOutlined />}
            size="large">Login with Google</Button>
            <Link to="/forgotpassword" className="float-right text-danger">Forgot Password</Link>
             </div>
         </div>
        </div>
    );
};

export default Login;