import React, { useState,useEffect } from "react";
import "./style.css";

import listicon from "../../Assets/images/garage-list-list-icon.svg";
import gridicon from "../../Assets/images/garage-list-grid-icon.svg";
import editicon from "../../Assets/images/edit.svg";
import remindericon from "../../Assets/images/reminder.svg";
import carnoteicon from "../../Assets/images/car-note.svg";
import { useSelector ,useDispatch} from "react-redux";
import VehicleLogTabs from "../VehicleLogTabs";
import {getCarRecordDetails} from "../../../src/redux/action/car";
import categoriesData from "../../Data/categories";
import { useLocation, useNavigate } from "react-router-dom";


export default function VehicleLog({carObj, open }) {

  const [listView, setListView] = useState(false);
  const navigate=useNavigate();
  const [selectedCategory,setSelectedCategory]=useState(-1);
  const [currentTab,setCurrentTab]=useState(1);


  const dispatch=useDispatch();
  
  const carRecordsDetail = useSelector((state) => state.car.carRecordsDetail);
 
  useEffect(() => {
      if(carObj)
      {
        
        dispatch(getCarRecordDetails(carObj?._id,currentTab));
      }
      
   
  }, [carObj,currentTab]);

  useEffect(()=>{
    if(carRecordsDetail)
    {
      
      console.log("car record arrived ",carRecordsDetail);
    }

  },[carRecordsDetail])

 


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




  return (
    <>
      <div style={{ marginRight: open ? "239px" : "0" }} className="vehicle-log-top">
        <div className="heading">
          <h2>Vehicle Log</h2>
          <ul>
            <li>Car: <strong>{carObj?.manufacturer} {carObj?.model}</strong></li>
            <li>Mileage: <strong>{carObj?.mileage} KM</strong></li>
          </ul>
        </div>
        <div className="links">
          <ul>
            <li><a href="#"   onClick={() => setCurrentTab(1)} className={currentTab==1?'active':''}>History</a></li>
            <li><a href="#"  onClick={() => setCurrentTab(2)} className={currentTab==2?'active':''} >Upcoming</a></li>
          </ul>
        </div>
      </div>
      <div className="vehicle-log-tabs">
      <VehicleLogTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div style={{ marginRight: open ? "239px" : "0" }} className="vehicle-log-filter-list-grid">
        <div className="garage-list-heading">
          <select name="" id="">
            <option value="">Filter</option>
            <option value="">Filter</option>
            <option value="">Filter</option>
          </select>
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
      <div style={{ marginRight: open ? "239px" : "0" }} className="vehicle-log-content-grid">
      {!listView ?
       carRecordsDetail?.result?.map((input,index) => { 
        if(selectedCategory===-1 || selectedCategory==input.categoryId)
        { 
        const formattedDate = new Date(input.logDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
          const inputClassName=(input.type=='simple')?'field50':'field25';
          return ( 
          
        
        <div className="details-box">
          <div className="top-box">
            <h4>{categoriesData.categories[input.categoryId]?.name}</h4>
            <p><a href="#"><img src={editicon} alt="" /> {input.type}</a></p>
          </div>
          <div className="grey-box">
            <ul>
              <li>Date: <strong> {formattedDate}</strong></li>
              <li>Mileage: <strong> {input.mileage}</strong></li>
              <li>Location: <strong> {input.location}</strong></li>
            </ul>
          </div>
          
          
          {input.options.map((option,optionIndex) => {
          
            return (
            <div className="input-box">
           
            <div className={inputClassName}>
              <label htmlFor="">Pick a {categoriesData.categories[input.categoryId]?.name} option</label>
              <input type="text"  value={option.name} />
            </div>

            {input.type!='simple' && (
              <>
            <div className={inputClassName}>
              <label htmlFor="">Part number</label>
              <input type="text"  value={option.partNumber} />
            </div>
            <div className={inputClassName}>
              <label htmlFor="">Source</label>
              <input type="text" name="" id="" value={option.source} />
            </div>
            </>
            )}
            <div className={inputClassName}>
              <label htmlFor="">Cost</label>
              <input type="text" name="" id="" value={option.cost} />
            </div>
          </div>

          )})}
         
        
          <div className="reminder-box">
            <h5><img src={remindericon} alt="" /> Reminder</h5>
            
            <ul>
            {input.occurance?.length > 0 && (
   <li>Remind me every {input.occurance} {input.occurance_type}</li>
   
  ) }
           
              
             
            </ul>
          </div>
          <div className="note-box">
            <div className="img"><img src={carnoteicon} alt="" /></div>
            <div className="txt">
              <p>{input.notes}</p>
            </div>
          </div>
        </div>
     
        
        
      
       )}})
      
        :
        <div></div>
      }
      </div>
    </>
  );
}
