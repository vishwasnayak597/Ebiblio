//copy from ant design
import React, {useState} from 'react';
import { Menu ,Badge} from 'antd';
import {HomeOutlined,UserOutlined,UserAddOutlined, SettingOutlined,LogoutOutlined,ShoppingOutlined,ShoppingCartOutlined
 } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
//useselector is used to get data from state
import {useDispatch,useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import Search from "../form/search";
import "./header.css";

const { SubMenu } = Menu;

const Header=()=>{
    const [current,setCurrent] = useState('home')
    let dispatch= useDispatch()
    //user from reducr-index.jss
    let { user,cart } = useSelector((state) => ({ ...state }));
    let history=useHistory();

    const handleClick = (event) => {
      setCurrent({ current: event.key });
    };
    //log out
    const logout=()=>{
        firebase.auth().signOut();
        //update redux state
        dispatch({
          type:'LOGOUT',
          payload:null,
        });
        history.push('/login')
    }
     //key is used for currnet selected item in menu
    
      return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="hea">
          <Menu.Item key="home" icon={<HomeOutlined />}>
           <Link to="/"><strong>Home</strong></Link>
          </Menu.Item>

          <Menu.Item key="shop" icon={<ShoppingOutlined />}>
           <Link to="/shop"><strong>Shop</strong></Link>
          </Menu.Item>

          <Menu.Item key="cart" icon={<ShoppingCartOutlined/>}>
           <Link to="/cart">      
             <Badge count={cart.length} offset={[9,0]}>
               <strong>Cart</strong>
             </Badge>
           </Link>
          </Menu.Item>
          
          {!user && (
        <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">
        <Link to="/register"><strong>Register</strong></Link>
        </Menu.Item>
      )}

      {!user && (
       <Menu.Item key="login" icon={<UserOutlined /> }className="float-right">
       <Link to="/login"><strong>Login</strong></Link>
       </Menu.Item>
      )}
     {user && (
      <SubMenu key="SubMenu" icon={<SettingOutlined/>} 
      title={user.email && user.email.split('@')[0]}className="float-right"> 
           
      {user && user.role ==='subscriber' && <Menu.Item><Link to="/user/history"><strong>Dashboard</strong></Link> </Menu.Item>}
             
              {user && user.role ==='admin' && <Menu.Item><Link to="/admin/dashboard"><strong>Dashboard</strong></Link> </Menu.Item>}
              <Menu.Item icon={<LogoutOutlined/>} onClick={logout}><strong>Logout</strong></Menu.Item>
          </SubMenu>
          )}

         <span className="float-right p-1">
          <Search />
          </span>

          </Menu>
      );
      }
  
  export default Header;