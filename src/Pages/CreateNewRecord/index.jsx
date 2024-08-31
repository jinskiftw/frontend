import React, {   useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import config from '../../config';
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import remindericon from "../../Assets/images/reminder.svg";
import plusicon from "../../Assets/images/plus.svg";
import minusicon from "../../Assets/images/minus.svg";
import notecard01 from "../../Assets/images/notecard-01.svg";
import notecard02 from "../../Assets/images/notecard-02.svg";
import notecard03 from "../../Assets/images/notecard-03.svg";
import notecard04 from "../../Assets/images/notecard-04.svg";
import NavBar from "../../Pages/NavBar";
import { handleApiCall } from "../../utils/apiUtils";
import { useDispatch, useSelector } from "react-redux";
import {
 
 
  getCategoryList
} from "../../redux/action/category";

import VehicleRecord from "../../Component/VehicleRecord";

export default function CreateNewRecord(params) {

  const navigate = useNavigate();
  
  const initialOptionValue={name:"",cost:"",partNumber:"",source:"",other:null,showOther:false};
  const initialFormValue={options:[initialOptionValue],logDate:'',mileage:'',location:'',notes:'',notecardType:'maintenance',type:'simple',categoryId:'',occurance:'',occurance_type:'',is_repeating:false,occurance_date_timeframe:'days' };
  const [formData,setFormData]=useState(initialFormValue);
  const [show, setShow] = useState(false);
  const [anotherRecord, setAnotherRecord] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedCategoryData, setSelectedCategoryData] = useState("");
  const [selected, setSelected] = useState("simple");
  const singleCarData = useSelector((state) => state.car?.singleCarData?.data);
  const categoryList = useSelector((state) => state.category?.categoryList?.data);
 
  const [errorText,setErrorText]=useState("");
  const dispatch = useDispatch();
  
 const handleVehicleRecordUpdate=(response)=>
 {
  console.log("woo response rec is ",response);  
 }
 
 
 useEffect(() => {
  dispatch(getCategoryList());
 

}, [dispatch]);


 
  const handleShow = (idx) => {
   
    setFormData({...initialFormValue,...{categoryId:idx}});
    setSelectedCategory(idx);
    const selectedCategoryData = categoryList.find(category => category._id === idx);
    setSelectedCategoryData(selectedCategoryData);

    setShow(true);
  };
 
 
 
  
  const categoryCard = (cat, idx) => {
     
    return (
      <a href="#" className="detail-icon-card-item" onClick={() => handleShow(cat._id)}>
        <div className="detail-icon-card-icon">
          <img src={`${config.BACKEND_URL}/uploads/category/${cat.icon}`} alt="" />
        </div>
        <div className="detail-icon-card-content">
          <p>{cat.title}</p>
        </div>
      </a>
    )
  
  }
  const setToastrZIndex = (zIndex) => {
    const toastrContainer = document.getElementById('toastr-container');
    if (toastrContainer) {
      toastrContainer.style.zIndex = zIndex;
    }
  };
  setToastrZIndex();
 
  const vehicleLogClose=()=>
  {
    setShow(false);
  }
  return (
    <>
   
      <section className="detail-icon-card create-record">
        <div className="container-fluid">
          <h2>Choose Category</h2>
          <div className="detail-icon-card-list">

            {categoryList?.map((cat, index) => categoryCard(cat, index))}
            
          </div>
        </div>
      </section>

      <VehicleRecord  selectedCategoryData={selectedCategoryData} show={show} setShow={setShow} onClose={vehicleLogClose}  /> 
    </>
  );
}
