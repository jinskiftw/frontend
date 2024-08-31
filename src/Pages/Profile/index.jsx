import React, { useState, useEffect } from "react";
import "./style.css";

import editPenIcon from "../../Assets/images/edit_pen.svg";

import { useSelector,useDispatch } from "react-redux";
import SubscriptionForm  from "../../Component/SubscriptionForm"
import { CircleSpinnerOverlay, FerrisWheelSpinner } from 'react-spinner-overlay'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import baseUrl from "../../utils/baseUrl";
import NavBar from "../../Pages/NavBar";
import axios from 'axios';
import { logoutAction,getUserProfile } from "../../redux/action/auth";
import { useParams, useNavigate  } from 'react-router-dom';
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert'; // Import
 
import {
  updateUserData
} from "../../redux/action/auth";

import { handleApiCall } from "../../utils/apiUtils";
import createHeaders from "../../utils/headers";



export default function VehicleLog({ carObj, open }) {
  const { tab } = useParams(); // If you're using React Router
  

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const popularTimezones = [
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Standard Time' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Standard Time' },
    { value: 'Europe/London', label: '(GMT+00:00) Greenwich Mean Time' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Japan Standard Time' },
    { value: 'Australia/Sydney', label: '(GMT+11:00) Australian Eastern Standard Time' },
    { value: 'UTC', label: '(GMT+00:00) Coordinated Universal Time' },
    { value: 'Europe/Berlin', label: '(GMT+01:00) Central European Time' },
    { value: 'Asia/Kolkata', label: '(GMT+05:30) Indian Standard Time' },
    { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia Time' },
    { value: 'Africa/Johannesburg', label: '(GMT+02:00) South African Standard Time' },
    { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow Time' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Gulf Standard Time' },
    { value: 'Asia/Hong_Kong', label: '(GMT+08:00) Hong Kong Standard Time' },
    { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore Standard Time' },
    { value: 'Pacific/Auckland', label: '(GMT+13:00) New Zealand Daylight Time' },
    { value: 'America/Toronto', label: '(GMT-05:00) Eastern Standard Time' },
    { value: 'America/Mexico_City', label: '(GMT-06:00) Central Standard Time' },
    { value: 'Europe/Paris', label: '(GMT+01:00) Central European Time' },
    { value: 'Asia/Jerusalem', label: '(GMT+02:00) Israel Standard Time' },
    { value: 'Australia/Melbourne', label: '(GMT+10:00) Australian Eastern Daylight Time' },
  ];

  const hours = Array.from({ length: 30 }, (_, i) => i + 2); // Create an array of numbers

  const handleLogOut = () => {
    window.localStorage.removeItem("token");
    dispatch(logoutAction());
    navigate("/");
  };

  const handleSubscriptionCancel =async () => {
    
    try 
    {
     
      const response = await axios.post(`${baseUrl}/payment/cancel`,{},{headers:createHeaders()});
      toast.success(response.data?.message);
      dispatch(getUserProfile());
       await getDocumentList(carObj._id);
       setLoading(false) ;
    }
    catch(error) 
    {
      setLoading(false);
      console.error(error);
    }


     
  };
   
  const userData = useSelector((state) => state.auth.userData[0]);
  const [listView, setListView] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [currentTab, setCurrentTab] = useState(
    new URLSearchParams(window.location.search).get('tab') || 1
  );
  
  const [showPopup,setShowPopup]=useState(false); 
  const [loading,setLoading]=useState(false); 
  const [formType,setFormType]=useState(''); 
  const [editMode, setEditMode] = useState({}); // Track edit mode for each field
  const [mailSent, setMailSent] = useState(false);

  const defaultPreference = {
    currency: "gbp",
    distance: "miles",
    notification1PreferredDate: null,
    notification2PreferredDate: null,
    notification1PreferredMileage: null,
    notification2PreferredMileage: null,
    timezone: "America/Los_Angeles",
    view: "grid",
  }
  const [formPrefrences,setFormPrefrences]=useState(defaultPreference);


  const [planDaysRemain,setPlanDaysRemain]=useState("");
  useEffect(()=>{
    console.log("UserToken=>",window.localStorage.getItem('token'))
    const date1 = new Date(userData.planExpiryDate);
//const date2 = new Date(userData.planStartDate);
const date2 = new Date();

// Calculate the difference in milliseconds
const differenceInMs = Math.abs(date1 - date2);

// Convert milliseconds to days
const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
setPlanDaysRemain(differenceInDays);
  },[userData]);
  const cancelAlertOptions = {
    title: 'Confirm',
    message: 'Are  you sure you want to your subscription! You still have '+planDaysRemain+' days left!',
    buttons: [
      {
        label: 'Proceed',
        onClick: () => {
          // Modified onClick logic
          handleSubscriptionCancel();
          // Add your custom logic here
        }
      },
      {   label: 'Cancel',}
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name"
  };
  const deleteAlertOptions = {
    title: 'Confirm',
    message: 'Are  you sure you want to delete this Profile? All records will be lost if you proceed!',
    buttons: [
      {
        label: 'Proceed'
 
      },
      {
        label: 'Cancel',
        
      }
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name"
  };

  useEffect(()=>{
    if(userData?.preferences)
    {
console.log('userData.preferences',userData?.preferences);
      setFormPrefrences(userData?.preferences);
    }
  },[userData])

  const handleUpdateField=async (key,value)=>{
    const formData = new FormData();
    if(value instanceof File)
    {
      
      formData.append(key,value); 
    }
    if(  value instanceof Object)
    { 
       
      for (const objKey in value)
        formData.append(`${key}[${objKey}]`, value[objKey]); 
    }
   else 
   {
    formData.append(key, value); 
   }
   console.log("form data is ",formData,value);
    const headers=createHeaders();
    headers['Content-Type']='multipart/form-data';
    
    const response = await axios.post(`${baseUrl}/user/updateUser`, formData, {
     headers
    });
    console.log("response34=>",response)
    if (response.data.success) {
      toast.success('User data saved successfully');

    } else {
      toast.error('Failed to save user data');
    }
    dispatch(getUserProfile());

  }
  const handleInputChange = (event) => {
    
    const { name, value } = event.target;
     
    setFormPrefrences({
      ...formPrefrences,
      [name]: value,
    });
  };

  const handlePreferenceSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    console.log("formPrefrences is",formPrefrences);
    Object.keys(formPrefrences).forEach(key => {
      
      formDataToSend.append(`preferences[${key}]`, formPrefrences[key]);
    });
   
    try {
      const headers={... createHeaders() }; 
      console.log("he is ",headers) ; 
      const response = await fetch(`${baseUrl}/user/updateUser`, {
        method: 'POST',
        headers,
        body:JSON.stringify({preferences:formPrefrences}),
      });

      if (response.ok) {
        dispatch(getUserProfile());
        toast.success('Preference data saved successfully');

      } else {
        toast.error('Failed to save preference data');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };




  const handleUpdateProfileSubmit = () =>{
    setFormType('')
    setShowPopup(false)
  }
  

  const handleUpdateUserPlan = (user) =>{
    const newUserData =[{
      userName: user.userName, 
      email: user.email, 
      role: "user", 
      isVerified: user.isVerified, 
      planId: user.planId, 
      planExpiryDate: user.planExpiryDate
    }];

    dispatch(updateUserData(newUserData));

  }

 
    const [formData, setFormData] = useState({
      name: '',
      profileImage: null, // Store the file
      preferences: {
        timezone: '',
        preferredHour: '',
        distance: '',
        currency: 'USD',
        viewType: 'list'
      }
    });
  
 
    const EditField = ({ fieldName, initialValue, isOpen, handleClose, handleUpdate }) => {
      const [formData, setFormData] = useState(initialValue);
    
      useEffect(() => {
        setFormData(initialValue); // Reset form data on modal close
      }, [initialValue, isOpen]);
    
      const handleChange = (event) => {
        
       
        if (event.target.type === 'file') {
         
          console.log("event.target is ",event.target.name );
          setFormData(event.target.files[0]); // Handle file selection
         
        } 
        else if(fieldName=='address' || fieldName=='profileTitle' ) 
        {
           
          setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
          }));

         
        }else {
          setFormData(event.target.value); // Handle other field changes
        }


      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log("formDataformData is ",formData);
        handleUpdate(formData);
        handleClose();
      };
    

      const handleSendEmail=()=>{
        setMailSent(true);
      }

      

      

      return (
        

<Modal
show={isOpen}
onHide={()=>handleClose()}
size="xm"
aria-labelledby="contained-modal-title-vcenter"
centered
>
<Modal.Header closeButton>
  <Modal.Title>
  {fieldName=='profileTitle' && <>Profile Summary</>}
  {fieldName=='fullName' && <>Full Name</>}
  {fieldName=='profileImage' && <>Profile Image</>}

  {fieldName=='password' && <>Password</>}
  {fieldName=='address' && <>Update your address</>}
  </Modal.Title>
</Modal.Header>
<Modal.Body>
<div className="pop-form">
    <div className="row">
      <div class="container mt-1">
        <form onSubmit={(e)=>handleSubmit(e)}>

          {fieldName=='profileTitle' && <>
            <div class="form-input">
              <label for="profileTitle">Profile Title</label>
              <input type="text" value={formData?.profile_title}  class="form-control" onChange={handleChange} name="profile_title"  placeholder="Profile Title"/>
            </div>
            <div class="form-input">
              <label for="profileDesc">Description</label>
              <textarea rows="5" value={formData?.profile_description} class="form-control" onChange={handleChange} name="profile_description" ></textarea>
            </div>
          </>}

          {fieldName=='profileImage' && <>
          <div class="form-input">
            <p><strong>Image formats accepted</strong> : png, jpg, jpeg.</p>
            <p><strong>Maximum file size</strong> : 2MB</p>
            <input type="file" name="profileImage" onChange={handleChange} /> 
          </div>
          </>}

          
          
          {fieldName=='fullName' && <div class="form-input">
            <label for="firstName">Full Name:</label>
            <input type="text" class="form-control" onChange={handleChange}   value={formData} name="fullName"  placeholder="Enter name"/>
          </div>}

      
          {fieldName=='password' && <div class="form-input">
            {!mailSent && <button type="button" onClick={()=>{handleSendEmail()}} class="mb-2 btn btn-danger detail-icon-card-edit-btn">Send me an email</button>}
            {mailSent && <div>Thank you. An email has been sent to reset your password.</div>}
          </div>}

          {fieldName=='address' && <>
            <div class="form-input">
              <label for="streetNumber">Street Number</label>
              <input type="text" value={formData?.streetNumber}  class="form-control" onChange={handleChange} name="streetNumber"  placeholder="Street number  /  House name"/>
            </div>
            <div class="form-input">
              <label for="streetAddress">Street Address</label>
              <input type="text"  value={formData?.streetAddress} class="form-control" onChange={handleChange} name="streetAddress"  placeholder="Street address"/>
            </div>
            <div class="form-input">
              <label for="city">City</label>
              <input type="text" class="form-control" value={formData?.city}  onChange={handleChange} name="city"  placeholder="City"/>
            </div>
            <div class="form-input">
              <label for="zipcode">Zipcode</label>
              <input type="text" class="form-control"  value={formData?.zipcode}  onChange={handleChange} name="zipcode"  placeholder="Zipcode"/>
            </div>
            <div class="form-input">
            <label for="country">Country</label>
              <input type="text" class="form-control" value={formData?.country}  onChange={handleChange} name="country"  placeholder="Country"/>
            </div>
          </>}

          <input type="hidden" name="carRecordId" value="" />
          <div class="btn-container">

          {fieldName!='password' && <><button type="submit" class="btn btn-primary mb-2 btn btn-danger detail-icon-card-edit-btn">Save</button>
          <button type="button" class="btn btn-default" onClick={()=>handleClose()} style={{ float: 'right' }}>Cancel</button></>}

          </div>
         
        </form>
      </div>
  </div>
</div>
</Modal.Body>

</Modal>
      );
    };
  const setShowSubscription = ()=>{}
  const handleCloseModal = (fieldName) => {
    setEditMode({ ...editMode, [fieldName]: false }); // Close edit mode for clicked field
  };
  const handleEditClick = (fieldName) => {
    setEditMode({ ...editMode, [fieldName]: true }); // Toggle edit mode for clicked field
  };
 
  const handleDelete=()=>{
     
    const modifiedDeleteAlertOptions = {
      ...deleteAlertOptions, // Use spread operator to clone the original object
      buttons: [
        {
          ...deleteAlertOptions.buttons[0], // Clone the 'Yes' button object
          onClick: () => {
            // Modified onClick logic
            confirmedDeleteProfile();
            // Add your custom logic here
          }
        },
        ...deleteAlertOptions.buttons.slice(1) // Keep the 'No' button unchanged
      ]
    };

    confirmAlert( modifiedDeleteAlertOptions );
  }

  const confirmedDeleteProfile=async()=>
  {
    setLoading(true);
    try 
    {
    
      const response = await axios.delete(`${baseUrl}/user/deleteUser/${userData?._id}`,{headers:createHeaders()});
      toast.success(response.data.message);
      window.localStorage.removeItem("token");
      navigate(`/`, { replace: true });

      setLoading(false) ;
    }
    catch(error) 
    {
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <>
     <NavBar  />
     <section className="add-car-showcase add-carContainer">
      <CircleSpinnerOverlay
      loading={loading}  
 
      zIndex={10000}
       overlayColor="rgba(0,153,255,0.2)"
      />
    
      <div style={{ marginRight: open ? "239px" : "0" }} className="profile-top">
        <div className="links">
          <ul>
            <li><a href="#" onClick={() => setCurrentTab(1)} className={currentTab == 1 ? 'active' : ''}>Profile</a></li>
            <li><a href="#" onClick={() => setCurrentTab(2)} className={currentTab == 2 ? 'active' : ''} >Preferences</a></li>
            <li><a href="#" onClick={() => setCurrentTab(3)} className={currentTab == 3 ? 'active' : ''} >Subscription</a></li>
          </ul>
        </div>
      </div>
      
      <div className={`ProfileTab PTab ${currentTab == 1 ? 'active' : ''}`}  >

      <div className="profileInner">

      
      
        <div className="profileHeadInner">
          <div className="profileLeft">
            <div className="profileImgSection" >
              <div className="profileImgContainer" >
                <div className="profileImgInner">
              
                  <img src={(userData?.profile_image_url)?userData?.profile_image_url:'/profile2.png'} class="sc-gRtvSG jCyUJG" style={{height:"100%"}} />
                  <div className="profileImgOverlay"></div>
                </div>
              </div>
              <div className="profileNameSection">
                <h1 className="uname">{userData?.fullName} </h1>
              </div>
              
            </div>
            <EditField
              fieldName="profileImage"
              initialValue={userData?.profileImage}
              isOpen={editMode.profileImage} 
              handleClose={() => handleCloseModal('profileImage')}
              handleUpdate={(newValue) => handleUpdateField('profileImage', newValue)}
            />
            <button type="button" className="updateProfilebtn" onClick={() => handleEditClick('profileImage')}>Update image</button>
          </div>
        </div>
       

        <div className="profileAccountSec">
          <h2>Account Details</h2>
          <section class="accSec">
            <div data-attr="email-field-desktop" className="accRow email">
              <div className="evevep">
                <div className="row-title">email *</div>
                <div className="row-email row-profile-values">{userData?.email} </div>
              </div>
            </div>
            <div data-attr="password-field-desktop" className="accRow">
              <div className="evevep">
              <EditField
              fieldName="password"
              initialValue=""
              isOpen={editMode.password} 
              handleClose={() => handleCloseModal('password')}
              handleUpdate={(newValue) => handleUpdateField('password', newValue)}
            />
                <div className="row-title">password *</div>
                <div className="row-value">****************</div>
              </div>
              <svg   class="editpen-btn" onClick={() => handleEditClick('password')}
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
            <div data-attr="first_name-field-desktop" className="accRow">
                <div className="evevep">
                  <div className="row-title">Full Name *</div>
                  {editMode.fullName}
                  <EditField
              fieldName="fullName"
              initialValue={userData?.fullName}
              isOpen={editMode.fullName} 
              handleClose={() => handleCloseModal('fullName')}
              handleUpdate={(newValue) => handleUpdateField('fullName', newValue)}
            />
                  <div  className="row-value">{userData?.fullName} </div>
                </div>
                <svg  className="editpen-btn" onClick={() => handleEditClick('fullName')}
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
        
            <div data-attr="address-field-desktop" className="accRow addressInputBox">
              <div className="evevep">
              <EditField
              fieldName="address"
              initialValue={userData?.address}
              isOpen={editMode.address} 
              handleClose={() => handleCloseModal('address')}
              handleUpdate={(newValue) => handleUpdateField('address', newValue)}
            />
                <div className="row-title">address</div>
                <div  className="row-value row-profile-values addressInputInnerBox">
                {userData?.full_address}
                </div>
              </div>
              <svg  class="editpen-btn" onClick={() => handleEditClick('address')}
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

            <div data-attr="address-field-desktop" className="accRow">
              <div className="evevep">
              <EditField
              fieldName="profileTitle"
              initialValue={{profile_description:userData?.profile_description,profile_title:userData?.profile_title}}
              isOpen={editMode.profileTitle} 
              handleClose={() => handleCloseModal('profileTitle')}
              handleUpdate={(newValue) => handleUpdateField('profileTitle', newValue)}
            />
                <div className="row-title">Bio</div>
                <div  className="row-value">
                {userData?.profile_title}
                </div>
              </div>
              <svg onClick={() => handleEditClick('profileTitle')} class="editpen-btn"
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
  

        
          </section>


        </div>
      </div>

      <div className="profileButtonSec">
        <button type="button" onClick={handleLogOut} className="redBtn">
          <span>Logout</span>
        </button>

      {userData.subscriptionStatusRec && (
          <button type="button" onClick={()=>confirmAlert( cancelAlertOptions ) } className="redBtn">
          <span>Cancel Subscription</span>
        </button>


      )}

{!userData.subscriptionStatusRec && (userData.paymentId?.occurenceType==='subscription') && (
          <button type="button"  className="redBtn">
          <span>Cancelled</span>
        </button>


      )}
     
        <button type="button" className="redBtn" onClick={handleDelete} >
          <span>Delete account</span>
        </button>
      </div>
      
    </div>
      

      <div className={`PreferenceTab PTab ${currentTab == 2 ? 'active' : ''}`} >
        <h2>Notifications</h2>
        <div class="pref-row">
          <div class="pref-title form-input">Time-zone</div>
          <div class="pref-line form-input"></div>
          <div class="form-input">
            
            <Form.Select onChange={handleInputChange} value={formPrefrences?.timezone} name="timezone" aria-label="Default select example">
              
              {popularTimezones && popularTimezones.map((item)=>(
                <>
                <option value={item.value}>{item.label}</option>
                
                </>
              ))}
            </Form.Select>
          </div>
          
        </div>
         
        <h2>Dates/Mileage</h2>
        <div class="pref-row">
          <div class="pref-title">Notification 1 </div>
          <div class="notification-text">Remind me in </div>
          <div class="form-input" style={{width:'100px',marginBottom:'0px'}}>
        
          
           <Form.Control type="number" min="1" max="365" value={formPrefrences?.notification1PreferredDate}  onChange={handleInputChange} name="notification1PreferredDate" />
 
          </div>
          <div class="notification-text"> days before </div>
        </div>
        <div class="pref-row">
          <div class="pref-title">Notification 2 </div>
          <div class="notification-text">Remind me in </div>
          <div class="form-input" style={{width:'100px',marginBottom:'0px'}}>
        
     

           <Form.Control type="number" min="1" max="365" value={formPrefrences?.notification2PreferredDate}  onChange={handleInputChange} name="notification2PreferredDate" />
 

          </div>
          <div class="notification-text"> days before </div>
        </div>
        <div class="pref-row">
          <div class="pref-title">Notification 1 </div>
          <div class="notification-text">Remind me in </div>
          <div class="form-input" style={{width:'100px',marginBottom:'0px'}}>
        
  
        <Form.Control type="number" min="1"  value={formPrefrences?.notification1PreferredMileage}  onChange={handleInputChange} name="notification1PreferredMileage" />


          </div>
          <div class="notification-text">{userData.preferences?.distance} before </div>
        </div>
        <div class="pref-row">
          <div class="pref-title">Notification 2 </div>
          <div class="notification-text">Remind me in </div>
          <div class="form-input" style={{width:'100px',marginBottom:'0px'}}>
        
   
           <Form.Control type="number" min="1" value={formPrefrences?.notification2PreferredMileage}  onChange={handleInputChange} name="notification2PreferredMileage" />

          </div>
          <div class="notification-text"> {userData.preferences?.distance}  before </div>
        </div>
        <h2>Units</h2>
        <div class="pref-row">
          <div class="pref-title">Distance </div>
          <div class="pref-line"></div>
          <div class="radio-content ">
           
            <Form.Check
              label="Miles"
              onChange={handleInputChange} 
              name="distance"
              type="radio"
              value={`miles`}
              id={`reverse-radio-Miles`} 
              checked={formPrefrences?.distance=='miles'}
            />
            <Form.Check
              label="Kilometres"
              onChange={handleInputChange} 
              name="distance"
              type="radio"
              value={`km`}
              id={`reverse-radio-KM`}
              checked={formPrefrences?.distance=='km'}
            />

          </div>
          
        </div>
        <div class="pref-row">
          <div class="pref-title">Currency</div>
          <div class="pref-line"></div>
          <div class="radio-content ">
            <Form.Check
              label="GBP"
              onChange={handleInputChange} 
              name="currency"
              type="radio"
              value={`gbp`}
              checked={formPrefrences?.currency=='gbp'}
            />
            <Form.Check
              label="USD"
              onChange={handleInputChange} 
              name="currency"
              type="radio"
              value={`usd`}
              checked={formPrefrences?.currency=='usd'}
            />
            <Form.Check
              label="EUR"
              onChange={handleInputChange} 
              name="currency"
              type="radio"
              value={`eur`}
              checked={formPrefrences?.currency=='eur'}
            />

          </div>
          
        </div>


        <h2>Garage</h2>

        <div class="pref-row">
          <div class="pref-title">Default view</div>
          <div class="pref-line"></div>
          <div class="radio-content">
            <Form.Check
              label="Grid view"
              onChange={handleInputChange} 
              name="view"
              type="radio"
              value={`grid`}
              checked={formPrefrences?.view=='grid'}
              id={`reverse-radio-Grid`}
            />
            <Form.Check
              label="List view"
              onChange={handleInputChange} 
              name="view"
              type="radio"
              checked={formPrefrences?.view=='list'}
              value={`list`}
              id={`reverse-radio-List`}
            />

          </div>
          
        </div>
        <div class="row"><div class="col-md-6"><button class="mb-2 btn btn-danger detail-icon-card-edit-btn" onClick={handlePreferenceSubmit}>Save</button></div></div>
      </div>

      <div className={`SubscriptionTab PTab ${currentTab == 3 ? 'active' : ''}`} >
        <h2>Subscription</h2>

        <SubscriptionForm currentPlan={{planId:userData?.planId, startDate:userData?.planStartDate, expiryDate:userData?.planExpiryDate}} page="profile" setPopup={setShowSubscription} setUserData={handleUpdateUserPlan} />
      </div>
     
    </section>


               

        
        
    </>
  );
}
