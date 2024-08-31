import React, { useState, useEffect,forwardRef, useImperativeHandle  } from "react";
import "./style.css";

import listicon from "../../Assets/images/garage-list-list-icon.svg";
import gridicon from "../../Assets/images/garage-list-grid-icon.svg";
import editicon from "../../Assets/images/edit.svg";
import remindericon from "../../Assets/images/reminder.svg" ;
import carnoteicon from "../../Assets/images/car-note.svg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import notecard01 from "../../Assets/images/notecard-01.svg";
import notecard02 from "../../Assets/images/notecard-02.svg";
import notecard03 from "../../Assets/images/notecard-03.svg";
import notecard04 from "../../Assets/images/notecard-04.svg";
import { useSelector, useDispatch } from "react-redux";
import VehicleLogTabs from "../VehicleLogTabs";
import {   getCategoryList } from "../../../src/redux/action/category";
import {   getCarRecordDetails } from "../../../src/redux/action/car";


import { CircleSpinnerOverlay, FerrisWheelSpinner } from 'react-spinner-overlay'
import Modal from "react-bootstrap/Modal";
import VehicleRecord from "../../Component/VehicleRecord";
import axios from "axios";
import createHeaders from "../../utils/headers";
import baseUrl from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert'; // Import
import moment from 'moment-timezone'; // Include timezone support

export const VehicleLog=forwardRef(({ carObj, open },ref)=> {

  const userData = useSelector((state) => state.auth.userData[0]);
  const [listView, setListView] = useState((userData.preferences?.view)=='list');
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [currentTab, setCurrentTab] = useState(1);
  const [expandedRecords, setExpandedRecords] = useState({});

 
  const categoryList = useSelector((state) => state.category?.categoryList?.data);

  const [carRecordsDetail, setCarRecordsDetail] = useState(
    useSelector((state) => state.car.carRecordsDetail)
  );
  const carRecordHook =  useSelector((state) => state.car.carRecordsDetail);

  const dispatch = useDispatch();

  const updateCarRecord=async (carId,tab,params={})=>
  {
    dispatch(getCarRecordDetails(carId, tab,params)).then(() => {
      dispatch(getCategoryList());
    });
  }

  useEffect(()=>{
    const isMobileOrSmallScreen = () => {
      return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 480;
    };

    // Set listView to true by default for mobile and small screens
    if (isMobileOrSmallScreen()) {
      setListView(true);
      document.querySelector('.garage-list-heading-right').style.display = 'none';
    }
      
  },[])

  useEffect(() => {
    if (carObj) {
      setLoading(true);
      updateCarRecord(carObj?._id, currentTab);
    
    
    } else {
      dispatch(getCategoryList());
    }


  }, [carObj, currentTab]);

  useEffect(() => {
    if (carRecordHook) {
      setLoading(false);
      setCarRecordsDetail(carRecordHook);
      console.log("car record arrived ", carRecordHook);

    }

  }, [carRecordHook])

  const [show,setShow]=useState(false) ; 
  const [selectedCard,setSelectedCard]=useState(null);
  const [selectedCardForUpdateMileage,setSelectedCardForUpdateMileage]=useState(null);

  
  const [vehicleLogIsNewRecord,setVehicleLogIsNewRecord]=useState(false);
  const [loading,setLoading]=useState(false);

  const handleVehicleLogClose=()=>{
    setShow(false) ; 
    setSelectedCard(null);

  }

  const handleShowNew=(e,record)=>{
    e.preventDefault();
    setVehicleLogIsNewRecord(true);
    console.log("record is ",record) ;
    const newRecord={options:record.options,notecardType:record.notecardType}; 
    setSelectedCard(record) ; 
    const foundCategory = categoryList.find(category => category._id === record.categoryId._id);
    console.log("foundCategory is ",foundCategory);
    setSelectedCardCategory(foundCategory) ;
    setShow(true); 
  }
  const handleShow=(e,record)=>{
    e.preventDefault();
    setVehicleLogIsNewRecord(false);
 
    console.log("record is ",record) ;
    const foundCategory = categoryList.find(category => category._id === record.categoryId._id);
    console.log("foundCategory",foundCategory);
    setSelectedCardCategory(foundCategory) ;
    
    setSelectedCard(record) ; 
    setShow(true); 
   }
   
   useImperativeHandle(
    ref,
     () => ({
      async search(keyword) {
        setLoading(true);
        await updateCarRecord(carObj?._id, currentTab,{search:keyword}); 
           
        }
    }),
)

   
   const deleteAlertOptions = {
    title: 'Confirm',
    message: 'Do you want to delete this record ?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => alert('Click Yes')
      },
      {
        label: 'No',
        
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
  
  const confirmedDelete=async(id)=>
  {
    setLoading(true);
    try 
    {
     
      const response = await axios.delete(`${baseUrl}/user/car/record/${id}`,{headers:createHeaders()});
      toast.success(response.data.message);
      
       await updateCarRecord(carObj?._id, currentTab); 
       setLoading(false) ;
    }
    catch(error) 
    {
      setLoading(false);
      console.error(error);
    }
  }


   const handleRecordDelete=( id)=>{
     
    const modifiedDeleteAlertOptions = {
      ...deleteAlertOptions, // Use spread operator to clone the original object
      buttons: [
        {
          ...deleteAlertOptions.buttons[0], // Clone the 'Yes' button object
          onClick: () => {
            // Modified onClick logic
            confirmedDelete(id);
            // Add your custom logic here
          }
        },
        ...deleteAlertOptions.buttons.slice(1) // Keep the 'No' button unchanged
      ]
    };

    confirmAlert( modifiedDeleteAlertOptions );
  }

  
   const handleVehicleRecordUpdate=(response)=>
   {
 
    setCarRecordsDetail((prevState) => {
      return {
        ...prevState,
        result: prevState.result.map((record) =>{
         
          return record._id === response.data?._id ? { ...record, ...response.data } : record;
        }
     
         
        ),
      };
    });
    setShow(false);
    console.log("woo response rec is ",response);  
   }
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


  const [modificationTypeFilter,SetmodificationTypeFilter]=useState("");

  const serviceTypes={maintenance:notecard01,modification:notecard02,restoration:notecard03,other:notecard04};
  
 const handUpdateMileageSubmit=async(e)=>
 {
  setLoading(true);
  e.preventDefault();
  const carRecordId=e.target.elements.carRecordId.value;
   
  const formData = {
    mileage: e.target.elements.mileage.value,
    logDate: e.target.elements.logDate.value
  };
  try 
  {
    const response = await axios.patch(`${baseUrl}/vehicle-log/${carRecordId}/complete`,  formData,{headers:createHeaders()});
    toast.success(response.data.message);
    setShowUpdateMileage(false);
    updateCarRecord(carObj?._id, currentTab);
  }
 catch (error)
 {
  setLoading(false);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
     if(error.response.data.message)
     {
      toast.error(error.response?.data?.message,{  zIndex: 15000,
      }); 
     }
     else 
     {
      toast.error("Internal server error"); 
     }

    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    toast.error('No response received from the server');
  } else {
    console.error( error);
    // Something happened in setting up the request that triggered an Error
    toast.error('Error setting up the request:', error.message);
  }
 }

 }
const [showUpdateMileage,setShowUpdateMileage]=useState(false); 
const [selectedCardCategory,setSelectedCardCategory]=useState(false); 
const handleMarkAsCompleted=(record)=>
{
  setShowUpdateMileage(true);
  setSelectedCardForUpdateMileage(record);
}


const toggleExpand = (recordId) => {
  setExpandedRecords(prevState => ({
    ...prevState,
    [recordId]: !prevState[recordId]
  }));
};
  return (
    <>
      <div style={{ marginRight: open ? "239px" : "0" }} className="vehicle-log-top">
      
      <CircleSpinnerOverlay
      loading={loading}  
 
      zIndex={10000}
      color="#256854"
      />
        <div className="heading">
          <h2>Vehicle Log</h2>
          <ul>
            <li>Car: <strong> {carObj?.manufacturerYear}  {carObj?.manufacturer} {carObj?.model}</strong></li>
           
            <li>Mileage: <strong>{carObj?.mileageWithUnit} </strong></li>
          </ul>
        </div>
        <div className="links">
          <ul>
            <li><a href="#" onClick={() => setCurrentTab(1)} className={currentTab == 1 ? 'active' : ''}>History</a></li>
            <li><a href="#" onClick={() => setCurrentTab(2)} className={currentTab == 2 ? 'active' : ''} >Upcoming</a></li>
          </ul>
        </div>
      </div>
      <div className="vehicle-log-tabs">
        <VehicleLogTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoryList={categoryList} />
      </div>
      <div style={{ marginRight: open ? "239px" : "0" }} className="vehicle-log-filter-list-grid">
        <div className="garage-list-heading">
          {  
          
          <select  value={modificationTypeFilter} onChange={(e)=>SetmodificationTypeFilter(e.target.value)}>
                <option value="">All</option>
            <option value="maintenance">Maintenance</option>
            <option value="modification">Modification</option>
            <option value="restoration">Restoration</option>
            <option value="other">Other</option>
          </select>  
          
          }
          <div></div>
          <div className="garage-list-heading-right">
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
      </div>
      <div style={{ marginRight: open ? "239px" : "0" }} className={listView ? 'vehicle-log-content-list' : 'vehicle-log-content-grid'} >
        {
          carRecordsDetail?.result?.map((carRecord, index) => {
           
            if ((selectedCategory == '-1' || selectedCategory == carRecord.categoryId._id) && (!modificationTypeFilter || modificationTypeFilter==carRecord.notecardType)) {
              const formattedDate2 =(carRecord.logDate)? new Date(carRecord.logDate).toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }):'NA';
              const utcDate = moment(carRecord.logDate);
              console.log("ddd is ",utcDate.isValid());
              const formattedDate =(utcDate.isValid())? utcDate.format('MMMM Do, YYYY'):'NA';

            
              const inputClassName = (carRecord.type == 'simple') ? 'field50' : 'field25';
              console.log("categoryList ",categoryList);
              console.log(" carRecord.categoryId", carRecord.categoryId);
              
              return (


                <div className="details-box">
               
                  <div className="top-box" style= {{backgroundColor: carRecord.categoryId?.color?carRecord.categoryId?.color:'#87cce1'}}>
                    <h4> {carRecord?.categoryId?.title}  </h4>
                    <div style={{display:'flex'}}>
                    <p style={{'padding-right':'5px'}}><a href="#" onClick={(e) => handleShowNew(e,carRecord)}><i class="fa-regular fa-clone"></i></a></p>
                    <p><a href="#" onClick={(e) => handleShow(e,carRecord)}><img src={editicon} alt="" /> {carRecord.type.toUpperCase()}</a></p>
                      </div>
                   
                 
                  </div>
                  <div className="grey-box">
                    <ul> 
                      <li>Date: <strong> {formattedDate}</strong></li>
                      <li>Mileage: <strong> {carRecord.mileageWithUnit}</strong></li>
                      <li>Location: <strong> {carRecord.location}</strong></li>
                    </ul>
                    <ExpandMoreIcon className="logexpand" onClick={() => toggleExpand(carRecord._id)} />
                  </div>

                  <div className={`detail-innerbox ${expandedRecords[carRecord._id]? 'expand':''}`}>
                    {carRecord.options.map((option, optionIndex) => {
                      return (
                        <div className="input-box">

                          <div className={inputClassName}>
                            <label htmlFor="">Pick a {carRecord?.categoryId?.title} option</label>
                            <input type="text" value={option.name} />
                          </div>

                          {carRecord.type != 'simple' && (
                            <>
                              <div className={inputClassName}>
                                <label htmlFor="">Part number</label>
                                <input type="text" value={option.partNumber} />
                              </div>
                              <div className={inputClassName}>
                                <label htmlFor="">Source</label>
                                  <input type="text" name="" id="" value={option.source} />
                              </div>
                            </>
                          )}
                          <div className={inputClassName}>
                            <label htmlFor="">Cost</label>
                            <span class="prefix-currency">{userData?.preferences?.currencySymbol}</span>
                            <input class="cost-input" type="text" name="" id="" value={new Intl.NumberFormat('en-US').format( option.cost)} />
                          </div>
                        </div>

                      )
                    })}


                    <div className="reminder-box">
                      <h5><img src={remindericon} alt="" /> Occurrence  </h5>

                      <ul>
                        {!carRecord.isHistory && carRecord.occurance_type && (
                          <li>Remind me {carRecord.remindMeText}</li>

                        )}
                      </ul>
                    </div>
                    <div className="note-box">
                      <div className="img"><img src={serviceTypes[carRecord.notecardType]} alt="" /></div> 
                      <div className="txt">
                        <p>{carRecord.notes}</p>
                      </div>
                    </div>
                    { !loading && (

                          <div className="reminder-box">
                                            

                          <div style={{float: 'right',['padding-bottom']:'20px'}}> 
                          
                          <a class="btn btn-danger btn-sm" href="#" onClick={()=>handleRecordDelete( carRecord._id)}>Delete</a>
                          {currentTab==2 && (

  <button disabled={!carRecord.isActive} onClick={(e)=>handleMarkAsCompleted(carRecord)} className={((carRecord.isActive)?'btn btn-sm btn-warning':'btn btn-sm btn-success')+' ms-2'}>{(carRecord.isActive)?'Mark as Completed':'Completed'} </button>

                          )}
                    

                        
            
                          </div>
                          </div>


                    )}    
           
                  </div>
                </div>




              )
            }
          })


        }
      </div>

      <Modal
        show={showUpdateMileage}
        onHide={()=>setShowUpdateMileage(null)}
        size="xm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
           Mark as Completed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="pop-form">
            <div className="row">
              <div class="container mt-1">
                <form onSubmit={(e)=>handUpdateMileageSubmit(e)}>

                <div class="row pb-4">
  <div class="col">

    <input type="text" class="form-control" name="mileage" placeholder="Enter Mileage" />
  </div>
 
</div>
                
                  <div class="form-input">
                    <label for="date">Enter Date:</label>
                    <input type="date" class="form-control" name="logDate"  placeholder="Enter Date"/>
                    
                    
                  </div>
                  <input type="hidden" name="carRecordId" value={selectedCardForUpdateMileage?._id} />
                  <button type="submit" class="mb-2 btn btn-danger detail-icon-card-edit-btn">Submit</button>
                </form>
              </div>
          </div>
        </div>
        </Modal.Body>

        </Modal>
        <VehicleRecord handleResponse={handleVehicleRecordUpdate} isNewRecord={vehicleLogIsNewRecord} selectedCategoryData={selectedCardCategory} card={selectedCard} setShow={setShow} show={show} onClose={handleVehicleLogClose}   /> 
        
    </>
  );
})