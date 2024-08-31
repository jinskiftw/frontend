import React,{useState,useEffect} from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import { useLocation, useNavigate } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";

import logo from "../../Assets/images/wheelman-logo.png";
import menubar from "../../Assets/images/menu-bar.svg";
import searchicon from "../../Assets/images/search.svg";
import notifyicon from "../../Assets/images/notify-btn-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../redux/action/auth";

import Notification from "../../Component/notification";
import { getUserProfile } from "../../redux/action/auth";
export default function Header({ home, mainPageSearchUpdate }) {
  const userData = useSelector((state) => state.auth.userData[0]);
  const [mobileSearchBar, setMobileSearchBar] = useState(false)                     
 
  console.log("userData is ",userData);
   
  const navigate = useNavigate();
  const dispatch = useDispatch();

   
 useEffect(() => {
    
  dispatch(getUserProfile());

}, [dispatch]);

  const name = userData?.fullName?.split(" ");
  const userShortName = name?.map((word) => word[0]?.toUpperCase()).join("");
  const handleGoBack = () => {
    window.history.back();
  };
  const handleLogOut = () => {
    window.localStorage.removeItem("token");
    dispatch(logoutAction());
    navigate("/");
  };
 const [search,setSearch]=useState("");
 const handleSearch=()=>
 {
   
  if(mainPageSearchUpdate)
  {
    mainPageSearchUpdate(search); 
  }
  else 
  {
    navigate(`/dashboard?search=${search}`);
  }

 }


 const [notificationCount,setNotificationCount]=useState(0);

  return (
    <>
      <header className="page-header">
        <div className="container-fluid">
          <div className="header-flex">
            <div className="MSearchInput" style={{height:mobileSearchBar? "50px":"0px"}}>
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}  placeholder="Search..." />
            <img src={searchicon} alt="" onClick={()=>handleSearch()} />
            </div>
            <div className="header-left">
              <div
                style={{ display: home ? "none" : "block" }}
                onClick={handleGoBack}
                className="header-menu hammenu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="24"
                  viewBox="0 0 14 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clip-rule="evenodd"
                    d="M13.6063 0.390524C14.1312 0.911223 14.1312 1.75544 13.6063 2.27614L3.8023 12L13.6063 21.7239C14.1312 22.2446 14.1312 23.0888 13.6063 23.6095C13.0813 24.1302 12.2301 24.1302 11.7051 23.6095L0 12L11.7051 0.390524C12.2301 -0.130175 13.0813 -0.130175 13.6063 0.390524Z"
                    fill="#55625D"
                  />
                </svg>
              </div>
              <div className="logo-header">
                <a href="/">
                  <img src={logo} alt="" />
                </a>
              </div>
            </div>
            <div className="header-right">
              <div className="header-search">
                <div className="header-search-input">
                  <div className="header-search-input-wrapper">
                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}  placeholder="Search..." />
                    <button onClick={()=>handleSearch()}>
                      <img  src={searchicon} alt="" />
                    </button>
                    <div className="header-search-close"> 
                      <i className="fa-solid fa-arrow-left" />
                    </div>
                  </div>
                </div>
                <div className="header-search-btn" onClick={()=>setMobileSearchBar(!mobileSearchBar)}>
                  <img src={searchicon} alt="" />
                </div>
              </div>
              <div className="notify-area dropdown show">
                <a href="#" className="notify-btn " data-toggle="dropdown">
                  <img src={notifyicon} alt="" />
                </a>
                {notificationCount>0 && (
         <span class="badge rounded-pill bg-danger notification-count">{notificationCount}</span>
                )}
       
            <Notification setNotificationCount={setNotificationCount} /> 
              </div>
              <div className="header-profile">
                <Dropdown>
                  <Dropdown.Toggle variant="default" id="dropdown-basic">
                    <span className="header-profile-avatar">
                      {userShortName}
                    </span>
                    <span className="header-profile-name">
                      {userData?.fullName}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu> 
                    <Dropdown.Item href="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item href="/profile?tab=2">
                      Preferences
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              
            





            </div>
          </div>
        </div>
      </header>
    </>
  );
}
  