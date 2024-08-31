import React, {   useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import createrecordicon1 from "../../Assets/images/create-record-card-icon-1.svg";
import createrecordicon2 from "../../Assets/images/create-record-card-icon-2.svg";
import createrecordicon3 from "../../Assets/images/create-record-card-icon-3.svg";
import createrecordicon4 from "../../Assets/images/create-record-card-icon-4.svg";
import createrecordicon5 from "../../Assets/images/create-record-card-icon-5.svg";
import createrecordicon6 from "../../Assets/images/create-record-card-icon-6.svg";
import createrecordicon7 from "../../Assets/images/create-record-card-icon-7.svg";
import createrecordicon8 from "../../Assets/images/create-record-card-icon-8.svg";
import createrecordicon9 from "../../Assets/images/create-record-card-icon-9.svg";
import createrecordicon10 from "../../Assets/images/create-record-card-icon-10.svg";
import createrecordicon11 from "../../Assets/images/create-record-card-icon-11.svg";
import createrecordicon12 from "../../Assets/images/create-record-card-icon-12.svg";
import createrecordicon13 from "../../Assets/images/create-record-card-icon-13.svg";
import createrecordicon14 from "../../Assets/images/create-record-card-icon-14.svg";
import createrecordicon15 from "../../Assets/images/create-record-card-icon-15.svg";

import remindericon from "../../Assets/images/reminder.svg";
import plusicon from "../../Assets/images/plus.svg";
import minusicon from "../../Assets/images/minus.svg";
import notecard01 from "../../Assets/images/notecard-01.svg";
import notecard02 from "../../Assets/images/notecard-02.svg";
import notecard03 from "../../Assets/images/notecard-03.svg";
import notecard04 from "../../Assets/images/notecard-04.svg";
import NavBar from "../../Pages/NavBar";
import categoriesData from "../../Data/categories";
import { handleApiCall } from "../../utils/apiUtils";
import { useDispatch, useSelector } from "react-redux";
import {
 
  getCarDetailsById,
  updateCarRecordDetails,
} from "../../redux/action/car";
export default function CreateNewRecord(params) {

  const navigate = useNavigate();
  
  const initialOptionValue={name:"",cost:"",partNumber:"",source:""};
  const initialFormValue={options:[initialOptionValue],logDate:'',mileage:'',location:'',notes:'',notecardType:'maintaintance',type:'simple',categoryId:'',occurance:'',occurance_type:'miles' };
  const [formData,setFormData]=useState(initialFormValue);
  const [show, setShow] = useState(false);
  const [anotherRecord, setAnotherRecord] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [selected, setSelected] = useState("simple");
  const singleCarData = useSelector((state) => state.car?.singleCarData?.data);

 const [errorText,setErrorText]=useState("");
  
  
  const handleClose = () => setShow(false);
  const handleShow = (idx) => {
   
    setFormData({...initialFormValue,...{categoryId:idx}});
    setSelectedCategory(idx);

    setShow(true);
  };


  const dispatch = useDispatch();
  useEffect(() => {
    
      dispatch(getCarDetailsById(params['carId']));
    
  }, [dispatch]);


  const handleOptionChange=(index,key,value)=>{
    setFormData(prevState => ({
      ...prevState,
      options: prevState.options.map((option, i) =>
      
        i === index ? { ...option, [key]: value } : option
      ),
    }));
  }
  const handleOnChange = (e) => { 
  
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]:value
    }));
    
  };

  const deleteRow=(index)=>{
 
    setFormData(prevState => ({
      ...prevState,
      options: prevState.options.filter((_, i) => i !== index)
    }));
    
  }  
  const addRow=()=>{
     
    setFormData((prevState) => ({
      ...prevState,
      options: [...prevState.options,initialOptionValue],
    }));

 
 
  }
  const categoryCard = (icon, idx) => {
     
    if(categoriesData.categories[idx]!==undefined)
    {
      
      return (
        <a href="#" className="detail-icon-card-item" onClick={() => handleShow(idx)}>
          <div className="detail-icon-card-icon">
            <img src={icon} alt="" />
          </div>
          <div className="detail-icon-card-content">
            <p>{categoriesData.categories[idx].name}</p>
          </div>
        </a>
      )
    }
  
  }
  const setToastrZIndex = (zIndex) => {
    const toastrContainer = document.getElementById('toastr-container');
    if (toastrContainer) {
      toastrContainer.style.zIndex = zIndex;
    }
  };

  const handleCarRecordDetails = async () => {
    // try {
      setErrorText('');
      if(formData.logDate.length<3)
      {
        setErrorText('Please enter the Date');
        return false ;
      }
      else if(formData.mileage.length<1)
      {
        setErrorText('Please enter the mileage');
        return false ;
      }
      else if(formData.location.length<1)
      {
        setErrorText('Please enter the location');
        return false ;
      }
      else if( formData.mileage > singleCarData.mileage  && formData.logDate < singleCarData.yearsOwned)
      {
        setErrorText('Date should be greater then car owned date ');
        return false ;
      }
      else if( formData.mileage < singleCarData.mileage  && formData.logDate > singleCarData.yearsOwned)
      {
        setErrorText('Date should be less then car owned date ');
        return false ;
      }
      
      return false ;
      setErrorText('');
      if (true) {
        const success = await handleApiCall(
          dispatch,
          updateCarRecordDetails(params['carId'], formData)
        );
        if (success) {
          const updatedData = await dispatch(
            getCarDetailsById(params['carId'])
          );
          if (updatedData) {
            !anotherRecord? navigate(`/car/${params['carId']}/vehicle_log`): setShow(false);
          }
        }
      } 
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return (
    <>
   
      <section className="detail-icon-card create-record">
        <div className="container-fluid">
          <h2>Choose Category</h2>
          <div className="detail-icon-card-list">
        
            {categoryCard(createrecordicon1, 0)}
            {categoryCard(createrecordicon2, 1)}
            {categoryCard(createrecordicon2, 2)}
            {categoryCard(createrecordicon3, 3)}
            {categoryCard(createrecordicon4, 4)}
            {categoryCard(createrecordicon5,5)}
            {categoryCard(createrecordicon6,6)}

            {categoryCard(createrecordicon7,7)}
            {categoryCard(createrecordicon8,8)}
            {categoryCard(createrecordicon9,9)}
            {categoryCard(createrecordicon10,10)}
            {categoryCard(createrecordicon11,11)}
            {categoryCard(createrecordicon12,12)}
            {categoryCard(createrecordicon13,13)}
            {categoryCard(createrecordicon14,14)}
            {categoryCard(createrecordicon15,15)}
           

 
          </div>
        </div>
      </section>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New {categoriesData?.categories[selectedCategory]?.title} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <ul style={{paddintBottom:   '20px'}} >
        <li><span  className="error-msg">{errorText}</span></li>
        </ul>
          <div className="pop-form">
            <div className="grey-section">
              <div className="row align-items-center">
                <div className="col-sm-3">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="simple"
                      id="simple"
                      
                      name="type"
                      defaultChecked
                      checked={selected === "simple"}
                      onChange={(e) => handleOnChange(e)  || setSelected(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="simple">
                      Simple
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      value="detailed"
                      id="detailed"
                      
                      checked={selected === "detailed"}
                      onChange={(e) =>handleOnChange(e)  || setSelected(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="detailed">
                      Detailed
                    </label>
                  </div>
                </div>
                <div className="col-sm-3">
                  <input type="date"  name="logDate" value={formData.logDate} onChange={handleOnChange}  placeholder="Select year" />
                </div>
                <div className="col-sm-3">
                  <input type="text"  name="mileage" value={formData.mileage} onChange={handleOnChange} placeholder="Enter Mileage" />
                </div>
                <div className="col-sm-3">
                  <input type="text"  name="location" value={formData.location}  onChange={handleOnChange}  placeholder="Enter Location" />
                </div>
              </div>
            </div>
            <div >
            
            {formData.options.map((input,index) => (
               
              <div className={selected=='simple'?'simple-row':'detailed-row'}   key={index}>
              <div className="checkbox">
                <input
                  class="form-check-input mt15"
                  type="checkbox"
                  id="checkboxNoLabel"
                  value=""
                  aria-label="..."
            
                  checked
                />
              </div>
              <div className="pick">
                 
                <div className="form-input">
                  <label>Pick a {categoriesData?.categories[selectedCategory]?.name}  option</label>
                  <select value={input.name} name ={`options[${index}][name]`}
                  onChange={(e)=>{handleOptionChange(index,'name',e.target.value)}} >
                    <option>Select...</option>
                    {categoriesData.categories[selectedCategory]?.options.map((element, index) => (
                      <option   key={index} value={element}>
                        {element}
                      </option>
                    ))}
                 
                  </select>
                </div>
              </div>
              <div className="part" aria-hidden={selected=='simple'}>
                  <div className="form-input">
                    <label>Part number</label>
                    <input onChange={(e)=>{handleOptionChange(index,'partNumber',e.target.value)}} type="text" value={input.partNumber} name ={`options[${index}][partNumber]`} placeholder="Enter part number" />
                  </div>
                </div>
                <div className="source" aria-hidden={selected=='simple'}>
                  <div className="form-input">
                    <label>Source</label>
                    <input onChange={(e)=>{handleOptionChange(index,'source',e.target.value)}}  type="text"  value={input.source} name ={`options[${index}][source]`}  placeholder="Enter Source" />
                  </div>
                </div>
              <div className="cost">
                <div className="form-input">
                  <label>Cost</label>
                  <input  onChange={(e)=>{handleOptionChange(index,'cost',e.target.value)}}   value={input.cost} type="text" name={`options[${index}][cost]`} placeholder="Enter cost" />
                </div>
              </div>
              
              <div className="delete">
                {index>0 && (

                  <button className="btn-minus" onClick={() => deleteRow(index)}  >
                  <img src={minusicon} alt="" />
                  </button>
                )}
                
                </div>
            
            </div>
        ))}
              
              
              <div className="row mb27">
                <div className="col-sm-8 col-lg-9">
                  <div className="form-input form-input-btn">
                    <button className="btn-reminder">
                      <img src={remindericon} alt="" /> Add Reminder Occurrence{" "}
                      <span>(e,g. Date, Miles, Every Miles)</span>
                    </button>
                    <div  className="simple-row">

                    <div className="cost">
                  <div className="form-input">
                  <input type="text" name="occurance" onChange={handleOnChange}  value={formData.occurance}></input>
                 
                  </div>
                  
                  </div>
                    <div className="pick">
                 
                 <div className="form-input">
                  
                    <select name="occurance_type" onChange={handleOnChange}  value={formData.occurance_type}>
                      <option value="miles">Miles</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  </div>

              
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-3">
                  <div className="form-input form-input-btn">
                    <button className="btn-add" onClick={()=>{addRow()}}>
                      <img src={plusicon} alt="" /> Add More Rows
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div aria-hidden={true}>
              <div className="detailed-row">
                <div className="checkbox">
                  <input
                    class="form-check-input mt15"
                    type="checkbox"
                    id="checkboxNoLabel11"
                    value=""
                    aria-label="..."
                  />
                </div>
                <div className="pick">
                  <div className="form-input">
                    <label>Pick a braking option</label>
                    <select>
                      <option>Select...</option>
                      <option>option 1</option>
                      <option>option 2</option>
                      <option>option 3</option>
                    </select>
                  </div>
                </div>
                <div className="part">
                  <div className="form-input">
                    <label>Part number</label>
                    <input type="text" placeholder="Enter part number" />
                  </div>
                </div>
                <div className="source">
                  <div className="form-input">
                    <label>Source</label>
                    <select>
                      <option>Select...</option>
                      <option>option 1</option>
                      <option>option 2</option>
                      <option>option 3</option>
                    </select>
                  </div>
                </div>
                <div className="cost">
                  <div className="form-input">
                    <label>Cost</label>
                    <input type="text" placeholder="Enter cost" />
                  </div>
                </div>
                <div className="delete"></div>
              </div>
              <div className="detailed-row">
                <div className="checkbox">
                  <input
                    class="form-check-input mt15"
                    type="checkbox"
                    id="checkboxNoLabel12"
                    value=""
                    aria-label="..."
                  />
                </div>
                <div className="pick">
                  <div className="form-input">
                    <label>Pick a braking option</label>
                    <select>
                      <option>Select...</option>
                      <option>option 1</option>
                      <option>option 2</option>
                      <option>option 3</option>
                    </select>
                  </div>
                </div>
                <div className="part">
                  <div className="form-input">
                    <label>Part number</label>
                    <input type="text" placeholder="Enter part number" />
                  </div>
                </div>
                <div className="source">
                  <div className="form-input">
                    <label>Source</label>
                    <select>
                      <option>Select...</option>
                      <option>option 1</option>
                      <option>option 2</option>
                      <option>option 3</option>
                    </select>
                  </div>
                </div>
                <div className="cost">
                  <div className="form-input">
                    <label>Cost</label>
                    <input type="text" placeholder="Enter cost" />
                  </div>
                </div>
                <div className="delete">
                  <button className="btn-minus">
                    <img src={minusicon} alt="" />
                  </button>
                </div>
              </div>
              <div className="row mb27">
                <div className="col-sm-7 col-lg-9">
                  <div className="form-input form-input-btn">
                    <button className="btn-reminder">
                      <img src={remindericon} alt="" /> Add Reminder Occurrence{" "}
                      <span>(e,g. Date, Miles, Every Miles)</span>
                    </button>
                  </div>
                </div>
                <div className="col-sm-5 col-lg-3">
                  <div className="form-input form-input-btn">
                    <button className="btn-add">
                      <img src={plusicon} alt="" /> Add More Rows
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 col-lg-4">
                <p>
                  Select Notecard Type: Maintenance, Modification, Restoration,
                  or Other
                </p> 
               
                <ul className="notecard-type">
                  <li>
                    <button onClick={()=>{
  setFormData(prevState => ({
    ...prevState,
    notecardType:'maintaintance'
  }))

                    }}  className={formData.notecardType=='maintaintance'?'active':''} >
                      <img src={notecard01} alt="" />
                    </button>
                  </li>
                  <li>
                    <button onClick={()=>{
  setFormData(prevState => ({
    ...prevState,
    notecardType:'modification'
  }))

                    }}  className={formData.notecardType=='modification'?'active':''}>
                      <img src={notecard02} alt="" />
                    </button>
                  </li>
                  <li>
                    <button  onClick={()=>{
  setFormData(prevState => ({
    ...prevState,
    notecardType:'restoration'
  }))

                    }}  className={formData.notecardType=='restoration'?'active':''}>
                      <img src={notecard03} alt="" />
                    </button>
                  </li>
                  <li>
                    <button  onClick={()=>{
  setFormData(prevState => ({
    ...prevState,
    notecardType:'other'
  }))

                    }}  className={formData.notecardType=='other'?'active':''}>
                      <img src={notecard04} alt="" />
                    </button>
                  </li>
                </ul>
              </div>
              <div className="col-md-7 col-lg-8">
                <div className="form-input">
                  <label>Add Notes</label>
                  <textarea  name="notes" onChange={handleOnChange}  value={formData.notes}
                    placeholder="Enter additional notes here..."
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-6">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    checked={anotherRecord}
                    onChange={(e) => setAnotherRecord(!anotherRecord)}
                    
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    Create Another
                  </label>
                </div>
              </div>
              <div className="col-6">
                <div className="form-input form-input-btn">
                  <button onClick={handleCarRecordDetails}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
