import React, { useEffect, useState } from "react";
import "./style.css";
import baseUrl,{backendUrl} from "../../utils/baseUrl";
import config from "../../config";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

//images
import caravatar from "../../Assets/images/user-info-car-avatar.png";
import caricon01 from "../../Assets/images/user-info-car-icon-1.svg";
import caricon02 from "../../Assets/images/user-info-car-icon-2.svg";
import caricon03 from "../../Assets/images/user-info-car-icon-3.svg";
import caricon04 from "../../Assets/images/user-info-car-right-left-image.svg";
import caravatar2 from "../../Assets/images/profile2.png";

import sorticon from "../../Assets/images/garage-list-sort-icon.svg";
import addicon from "../../Assets/images/garage-list-add-icon.svg";
import listicon from "../../Assets/images/garage-list-list-icon.svg";
import gridicon from "../../Assets/images/garage-list-grid-icon.svg";

import addnewicon from "../../Assets/images/garage-list-col-icon-add.svg";
import editicon from "../../Assets/images/garage-list-col-icon-edit.svg";
import detailicon from "../../Assets/images/garage-list-col-icon-detail.svg";

import slideimage1 from "../../Assets/images/garage-list-col-slide-for-image-1.jpg";
import slideimage2 from "../../Assets/images/garage-list-col-slide-for-image-2.jpg";
import slideimage3 from "../../Assets/images/garage-list-col-slide-for-image-3.jpg";
import slideimage4 from "../../Assets/images/garage-list-col-slide-for-image-4.jpg";
import slideimage5 from "../../Assets/images/garage-list-col-slide-for-image-5.jpg";

import SecurePaymentLogo from "../../Assets/images/secure-stripe-payment-logo.png";
import logo from "../../Assets/images/logo-header.png";

//Components
import NavBar from "../../Pages/NavBar";
import ImageSlider from "../../Component/imageSlider";
import SubscriptionForm  from "../../Component/SubscriptionForm"
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCarDetails,
  getAllArchivedCarDetails,
  getCarDetailsById,
  resetSingleCarData,
} from "../../redux/action/car";
import {
  updateUserData
} from "../../redux/action/auth";

import { handleApiCall } from "../../utils/apiUtils";
import SelectInput from "@mui/material/Select/SelectInput";
import { Chart } from "react-google-charts";
import scrollRestoration from "../../Component/scrollRestoration";
export default function MyGarageDashboard() {
   

  const userData = useSelector((state) => state.auth.userData[0]);
  const carData = useSelector((state) => state.car.carData.cars);
  const archivedCarData = useSelector((state) => state.car.archivedCarData.cars);
 
  const dispatch = useDispatch();
  const home = true;
  const navigate = useNavigate(); 
  const [imgThumIndex, setImgThmIndex] = useState({}); 
  const [listView, setListView] = useState((userData?.preferences?.view)=='list');
  const currentDateTime = new Date();
  const [showSubscription, setShowSubscription]= useState(false);

  const [searchKeyword,setSearchKeyword]=useState(
    new URLSearchParams(window.location.search).get('search') || ''
  );
  
  
  useEffect(() => {
    setImgThmIndex(Array(carData?.length).fill(0));
  }, [carData]);



  const handleImageClick = (carIndex, newImageIndex) => {
    const carImagesLength = carData[carIndex]?.carImage?.length || 0;

    if (carImagesLength > 0) {
      // Ensure the newImageIndex is within bounds
      newImageIndex = (newImageIndex + carImagesLength) % carImagesLength;

      setImgThmIndex((prevIndices) => {
        const newIndices = [...prevIndices];
        newIndices[carIndex] = newImageIndex;
        return newIndices;
      });
    }
    // setImgThmIndex((prevImgThumIndex) => ({
    //   ...prevImgThumIndex,
    //   [carIndex]: imageIndex,
    // }));
  };

 
  const handleAddCarClick = () => {
    dispatch(resetSingleCarData());
    navigate("/add_car");
  };
  const handleThumbnailClick=(event,id)=>
  {
    if (!event.target.classList.contains('object-fit')) {
      navigate(`/add_car?id=${id}`)
    }
  }
  const CarCard =(carDataInput,previewOnly=false)=>   {
    const Items="Items Due";
    return (
      <>
        {carDataInput?.map((car, carIndex) => (
          <div
            style={{ display: listView ? "none" : "block" }}
            className="garage-list-col CarCard"
            key={car._id}
          >
            <div className="garage-list-col-item">
              <div  onClick={(e)=>{!previewOnly && handleThumbnailClick(e,car._id)}}  className="garage-list-col-item-image">
                <div className="garage-list-col-slider">
                  <div className="garage-list-col-slider-for garage-list-col-slider-for-1">
                    <div className="garage-list-col-slide-for-image">
                      {car.carImage.map((imageIndex) => (
                        <div
                          key={imageIndex}
                          className="garage-list-col-slide-for-image"
                          onClick={() => handleImageClick(carIndex, imageIndex)}
                        >
                          <img
                            src={`${config.BACKEND_URL}/uploads/cars/${
                              car.carImage[imgThumIndex[carIndex] || 0].image ||
                              ""
                            }`}
                            alt=""
                            className="object-fit"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="garage-list-col-slider-nav garage-list-col-slider-nav-1 carCardThCol">
                    {/*<KeyboardArrowUpIcon
                      onClick={() =>
                        handleImageClick(
                          carIndex,
                          (imgThumIndex[carIndex] || 0) - 1
                        )
                      }
                      sx={{ color: "#fff", cursor: "pointer" }}
                    />*/}
                
                    {car.carImage.map((item, imageIndex) => (
                      <div
                        key={imageIndex}
                        onClick={() => handleImageClick(carIndex, imageIndex)}
                        className={
                          imgThumIndex[carIndex] === imageIndex
                            ? "garage-list-col-slide-nav-image C_thum_Active"
                            : "garage-list-col-slide-nav-image"
                        }
                      >
                        <img
                          src={`${config.BACKEND_URL}/uploads/cars/${item.image}`}
                          alt=""
                          className="object-fit"
                        />
                      </div>
                    ))}
                    {/*<KeyboardArrowDownIcon
                      onClick={() =>
                        handleImageClick(
                          carIndex,
                          (imgThumIndex[carIndex] || 0) + 1
                        )
                      }
                      sx={{ color: "#fff", cursor: "pointer" }}
                    />*/}
                  </div>
                </div>
                <div className="garage-list-col-item-overlay">
                  <div className="garage-list-col-item-overlay-wrapper">
                    <h3
                      className={ !previewOnly? 'pointer':'' }
                      onClick={() => !previewOnly && navigate(`/add_car?id=${car._id}`)}
                    >
                   {car.manufacturerYear}  {car.manufacturer}  {car.model} 
                    </h3>
                   
                    <p>Mileage : {car.mileageWithUnit} </p>
                    <p>{Items} : {car.carRecordsCount} </p>
                  </div>
                </div>
              </div>
              {!previewOnly && (
                    <div className="garage-list-col-item-content">
                    <button
                      onClick={() => navigate(`/car/${car._id}/add_record`)}
                      className="garage-list-col-icon-add"
                    >
                      <img src={addnewicon} alt="" /> <span>Add New Record</span>
                    </button>
                     
                  </div>

              )}
            
            </div>
          </div>
        ))}
      </>
    );
  };

  const GviewIcActive = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <g clip-path="url(#clip0_2405_296)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0.9C0 0.402944 0.402944 0 0.9 0H7.2C7.69706 0 8.1 0.402944 8.1 0.9V7.2C8.1 7.69706 7.69706 8.1 7.2 8.1H0.9C0.402944 8.1 0 7.69706 0 7.2V0.9ZM1.8 1.8V6.3H6.3V1.8H1.8ZM9.9 0.9C9.9 0.402944 10.3029 0 10.8 0H17.1C17.5971 0 18 0.402944 18 0.9V7.2C18 7.69706 17.5971 8.1 17.1 8.1H10.8C10.3029 8.1 9.9 7.69706 9.9 7.2V0.9ZM11.7 1.8V6.3H16.2V1.8H11.7ZM0 10.8C0 10.3029 0.402944 9.9 0.9 9.9H7.2C7.69706 9.9 8.1 10.3029 8.1 10.8V17.1C8.1 17.5971 7.69706 18 7.2 18H0.9C0.402944 18 0 17.5971 0 17.1V10.8ZM1.8 11.7V16.2H6.3V11.7H1.8ZM9.9 10.8C9.9 10.3029 10.3029 9.9 10.8 9.9H17.1C17.5971 9.9 18 10.3029 18 10.8V17.1C18 17.5971 17.5971 18 17.1 18H10.8C10.3029 18 9.9 17.5971 9.9 17.1V10.8ZM11.7 11.7V16.2H16.2V11.7H11.7Z"
          fill="#165840"
        />
      </g>
      <defs>
        <clipPath id="clip0_2405_296">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const GviewIc = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 0.9C0 0.402944 0.402944 0 0.9 0H7.2C7.69706 0 8.1 0.402944 8.1 0.9V7.2C8.1 7.69706 7.69706 8.1 7.2 8.1H0.9C0.402944 8.1 0 7.69706 0 7.2V0.9ZM1.8 1.8V6.3H6.3V1.8H1.8ZM9.9 0.9C9.9 0.402944 10.3029 0 10.8 0H17.1C17.5971 0 18 0.402944 18 0.9V7.2C18 7.69706 17.5971 8.1 17.1 8.1H10.8C10.3029 8.1 9.9 7.69706 9.9 7.2V0.9ZM11.7 1.8V6.3H16.2V1.8H11.7ZM0 10.8C0 10.3029 0.402944 9.9 0.9 9.9H7.2C7.69706 9.9 8.1 10.3029 8.1 10.8V17.1C8.1 17.5971 7.69706 18 7.2 18H0.9C0.402944 18 0 17.5971 0 17.1V10.8ZM1.8 11.7V16.2H6.3V11.7H1.8ZM9.9 10.8C9.9 10.3029 10.3029 9.9 10.8 9.9H17.1C17.5971 9.9 18 10.3029 18 10.8V17.1C18 17.5971 17.5971 18 17.1 18H10.8C10.3029 18 9.9 17.5971 9.9 17.1V10.8ZM11.7 11.7V16.2H16.2V11.7H11.7Z"
        fill="#55625D"
      />
    </svg>
  );

  const LviewLcActive = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 3C0 2.44772 0.447715 2 1 2H17C17.5523 2 18 2.44772 18 3C18 3.55228 17.5523 4 17 4H1C0.447716 4 0 3.55228 0 3ZM0 9C0 8.44772 0.447715 8 1 8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H1C0.447716 10 0 9.55228 0 9ZM1 14C0.447715 14 0 14.4477 0 15C0 15.5523 0.447716 16 1 16H17C17.5523 16 18 15.5523 18 15C18 14.4477 17.5523 14 17 14H1Z"
        fill="#165840"
      />
    </svg>
  );

  const LviewLc = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 3C0 2.44772 0.447715 2 1 2H17C17.5523 2 18 2.44772 18 3C18 3.55228 17.5523 4 17 4H1C0.447716 4 0 3.55228 0 3ZM0 9C0 8.44772 0.447715 8 1 8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H1C0.447716 10 0 9.55228 0 9ZM1 14C0.447715 14 0 14.4477 0 15C0 15.5523 0.447716 16 1 16H17C17.5523 16 18 15.5523 18 15C18 14.4477 17.5523 14 17 14H1Z"
        fill="#55625D"
      />
    </svg>
  );

  const listCare = ({ id, brand, name, Lyear, milage, Items, imgArr,item,previewOnly=false }) => {
    return (
      <div className="listCare">
        <div className="listCImageBox">
          <ImageSlider images={imgArr} />
        </div>
        
        <div className="listCTextBox">
          <div className="inner pointer"  onClick={() => navigate(`/add_car?id=${item._id}`)} >
            <Typography className="LcarCardHeader">
           
            </Typography>
            <div className="list-top">
              <div className="LCardInfo-B">
              <Typography ml={2}>
             
                 {item.manufacturerYear}
                </Typography>
                <Typography>
                  
                  {item.manufacturer}
                </Typography>
        

                <Typography ml={2}>
              
                  {item.model}
                </Typography>

             
              </div>
              <div className="LCardInfo-B">
                <Typography>
                  <span style={{ fontWeight: "700" }}>Mileage:</span> {milage}
                </Typography>
              </div>
              <div className="LCardInfo-B">
              <Typography>
                  <span style={{ fontWeight: "700" }}>Items Due:</span>{item.carRecordsCount}
                </Typography>
              </div>
            </div>
          </div>
          {!previewOnly && (
          <div className="list-bot">
            <div onClick={() => navigate(`/car/${id}/add_record`)} className="LCardLInfo">
            <svg
              className="pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clip-path="url(#clip0_2647_582)">
                <rect
                  x="7.20032"
                  width="1.6"
                  height="16"
                  rx="0.8"
                  fill="#165840"
                />
                <rect
                  x="16"
                  y="7.20007"
                  width="1.6"
                  height="16"
                  rx="0.8"
                  transform="rotate(90 16 7.20007)"
                  fill="#165840"
                />
              </g>
              <defs>
                <clipPath id="clip0_2647_582">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <Typography className="pointer">Add New Record</Typography>
          </div>
        </div>

          )}
     
        </div>
      </div>
    );
  };

  console.log(userData);
  useEffect(()=>{dispatch(getAllArchivedCarDetails());},[]);
  useEffect(()=>{
   
      const params = new URLSearchParams(window.location.search);
      params.set('search', searchKeyword);
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`);


      dispatch(getAllCarDetails({search:searchKeyword}));
       

      const currentDateTime = new Date();
      const planExpiryDate = new Date(userData?.planExpiryDate);
      //console.log("Expiry check",currentDateTime,planExpiryDate )
      if (!userData?.planExpiryDate || currentDateTime > planExpiryDate) {
        setShowSubscription(true);
        document.body.classList.add('popup-open');
      }else{
        setShowSubscription(false);
        document.body.classList.remove('popup-open');
      } 
    
  },[searchKeyword]);

  const handleUpdateUserPlan = (user) =>{
    const newUserData =[{
      userName: user.userName, 
      email: user.email, 
      role: "user", 
      isVerified: user.isVerified, 
      planId: user.planId, 
      planExpiryDate: user.planExpiryDate
    }];

   // dispatch(updateUserData(newUserData));

  }

  const closeSubscriptionPopup = () =>{
    setShowSubscription(false);
    document.body.classList.remove('popup-open');
  }

  const handleBackHome = () => {  
    console.log("Frontend Site=>",config.FRONTEND_SITE);
    window.location.href = config.FRONTEND_SITE || 'https://wheelmanllc.com';
  }

  const handleReturnLogin = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <NavBar home={home} mainPageSearchUpdate={setSearchKeyword} />
      <section className="user-info-car">
   
        <div className="container-fluid">
          <div className="user-info-car-flex">
            <div className="user-info-car-left">
              <div className="userEditBtn pointer" onClick={(e)=>navigate('/profile')} >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M10.92 0.873001C11.4801 0.32581 12.2334 0.0214917 13.0164 0.0260515C13.7994 0.0306113 14.549 0.343681 15.1027 0.897358C15.6564 1.45104 15.9694 2.20067 15.974 2.98368C15.9785 3.76668 15.6742 4.51991 15.127 5.08L14.458 5.749L10.251 1.542L10.92 0.873001ZM9.54403 2.25L1.54503 10.249C1.21771 10.5767 0.990516 10.9909 0.890033 11.443L0.012033 15.393C-0.00633093 15.4752 -0.0036392 15.5607 0.0198586 15.6415C0.0433565 15.7224 0.086899 15.796 0.146447 15.8556C0.205994 15.9151 0.279617 15.9587 0.360485 15.9822C0.441354 16.0057 0.526847 16.0084 0.609033 15.99L4.53503 15.117C5.00247 15.0129 5.43054 14.7777 5.76903 14.439L13.751 6.457L9.54403 2.25Z"
                    fill="#ADBC92"
                  />
                </svg>
              </div>
              <div className="user-info-car-avatar">
                <img src={userData?.profile_image_url  || caravatar2} alt="" className="object-fit" />
              </div>
              <div className="user-info-car-detail">
                <ul>
                  <li>
                    <img src={caricon01} alt="" />{" "}
                    <span>
                      <strong>{userData?.userName}</strong>
                    </span>
                  </li>
                  <li>
                    <img src={caricon02} alt="" />{" "}
                    <span>{userData?.email}</span>
                  </li>
                  <li>
                    <img src={caricon03} alt="" />{" "}
                    <span>{userData?.full_address}</span>
                  </li>
                </ul>
              </div>
              <div className="user-info-car-desc">
                <p>
                {userData?.profile_description}
                </p>
              </div>
            </div>
            <div className="user-info-car-right">
              <div className="user-info-car-right-left">
                <img src={caricon04} alt="" />
              </div>
              <div className="user-info-car-right-right">
                <h4>
                  <span>{carData?.length}</span>Total Cars
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="garage-list">
        <div className="container-fluid">
          <div className="garage-list-heading">
            <h2>My Garage</h2>
            <div className="garage-list-heading-right">
              {/*<button className="garage-list-sort">
                <img src={sorticon} alt="" />
              </button>
              <button className="garage-list-add">
                <img src={addicon} alt="" />
              </button>*/}
              <button
                onClick={() => setListView(true)}
                className="garage-list-list"
              >
                {listView ? LviewLcActive : LviewLc}
              </button>
              <button
                onClick={() => setListView(false)}
                className="garage-list-grid"
              >
                {listView ? GviewIc : GviewIcActive}
              </button>
            </div>
          </div>
          <div className="garage-list-wrapper">
            {/* Map those cards */}
            {listView ? (
              <>
                {
                 carData && carData.map((item) => {
                    
                    return (
                      <>
                        {listCare({
                          id: item._id,
                          brand: item?.model,
                          name: item?.manufacturer,
                          Lyear: item?.manufacturerYear,
                          milage: item?.mileageWithUnit,
                          Items: item?.color,
                          imgArr: item?.carImage,
                          item
                        })}
                      </>
                    );
                  })}

                
              </>
            ) : (
              CarCard(carData)
            )}
           
            <div
              className="garage-list-col"
              style={{
                width: listView ? "calc(50% - 50px)" : "calc(33.333% - 50px)",
              }}
            >
              <button
                style={{ height: listView ? "110px" : "260px" }}
                className="garage-list-add-item"
                onClick={handleAddCarClick}
              >
                <i className="fa-solid fa-plus" />
              </button>
            </div>
          </div>
        </div>
      </section>


      <section className="garage-list">
        <div className="container-fluid">
          <div className="garage-list-heading">
            <h2>Archived</h2>
            <div className="garage-list-heading-right">
              {/*<button className="garage-list-sort">
                <img src={sorticon} alt="" />
              </button>
              <button className="garage-list-add">
                <img src={addicon} alt="" />
              </button>*/}
            
            </div>
          </div>
          <div className="garage-list-wrapper">
     
            {/* Map those cards */}
            {listView ? (
              <>
                {archivedCarData  &&
                  archivedCarData.map((item) => {
                     
                    return (
                      <>
                        {listCare({
                          id: item._id,
                          brand: item?.model,
                          name: item?.manufacturer,
                          Lyear: item?.manufacturerYear,
                          milage: item?.mileageWithUnit,
                          Items: item?.color,
                          imgArr: item?.carImage,
                          item,
                          previewOnly:true
                        })}
                      </>
                    );
                  })}

                
              </>
            ) : (
              CarCard(archivedCarData,true)
            )}
           
         
          </div>
        </div>
      </section>
      
      {showSubscription &&  <div className="subscription-popup" >
        <div className="inner"></div>
        <div className="popup-body">
          <div className="row head subPageHeader">
              <div className="subscriptionPageLogo" onClick={handleBackHome}><img src={logo} alt="logo" /></div>
              <div className="returnLoginBtn pointer" onClick={handleReturnLogin}>
                    Return to Login 
                </div>
              <div className="closebtn" onClick={closeSubscriptionPopup}></div>
          </div>
          
          <SubscriptionForm page="dashboard" setPopup={setShowSubscription} setUserData={handleUpdateUserPlan} />
        </div>
        
       
      </div>}

    
    </>
  );
}
