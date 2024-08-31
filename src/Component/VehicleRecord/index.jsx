import React, {   useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleApiCall } from "../../utils/apiUtils";
import remindericon from "../../Assets/images/reminder.svg";
import plusicon from "../../Assets/images/plus.svg";
import minusicon from "../../Assets/images/minus.svg";
import notecard01 from "../../Assets/images/notecard-01.svg";
import notecard02 from "../../Assets/images/notecard-02.svg";
import notecard03 from "../../Assets/images/notecard-03.svg";
import notecard04 from "../../Assets/images/notecard-04.svg";
import {
 
    getCarDetailsById,
    updateCarRecordDetails,
  
  } from "../../redux/action/car";
  import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";
import moment from 'moment-timezone'; // Include timezone support

export default function  VehicleRecord ({selectedCategoryData,show,setShow,onClose ,isNewRecord=true,card,handleResponse})   {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorText,setErrorText]=useState("");
    const [selected, setSelected] = useState("simple");
    const car = useSelector((state) => state.car?.singleCarData?.data);
    const [anotherRecord, setAnotherRecord] = useState(false);
    const userData = useSelector((state) => state.auth.userData[0]);
    const initialOptionValue={name:"",cost:"",costUnit:"gbp", partNumber:"",source:"",other:"",showOther:false};
    const initialFormValue={options:[initialOptionValue],logDate:'',mileage:'',mileageUnit:userData.preferences?.distance,location:'',notes:'',notecardType:'maintenance',type:'simple',categoryId:'',occurance:'',occurance_type:'',is_repeating:false,occurance_date_timeframe:'days' };
    const [formData,setFormData]=useState(initialFormValue);

    useEffect(()=>{
        //console.log("form data changed :",formData);

    },[formData])
  
    useEffect(()=>{ 
    
        if(show && selectedCategoryData)
        {
          const optionsArray = selectedCategoryData.options.split(',');
          optionsArray.sort((a, b) => a.localeCompare(b));
          const sortedOptionsString = optionsArray.join(',');
          selectedCategoryData.options = sortedOptionsString;


          setFormData({...initialFormValue,...{categoryId:selectedCategoryData._id}});
        }

    },[show,selectedCategoryData]); 


    useEffect(()=>{
        if(card && !isNewRecord)
        {
            setSelected(card.type);
            console.log("card=>",card);
            const logDate=new Date(card.logDate);
         
            //myArray.includes(valueToCheck);
             const categoryOptions=selectedCategoryData?.options?.split(",");
             categoryOptions.sort((a, b) => a.localeCompare(b));
             console.log("categoryOptions=>",categoryOptions);

              setFormData(prevState => ({
                ...prevState,
                options: card.options.map(option =>{
                  
                  const showOther=  !categoryOptions.includes(option.name);
                  const other=  !categoryOptions.includes(option.name)?option.name:null;
                  
                return {
                  name: option.name,
                  cost: option.cost,
                  costUnit: option.costUnit,
                  partNumber: option.partNumber,
                  source: option.source,
                  other,
                  showOther
                }


                }),
                location:card.location,
                occurance_type:card.occurance_type,
                is_repeating:card.is_repeating,
                occurance:card.occurance,
                notecardType:card.notecardType,
                notes:card.notes,
                logDate:moment(card.logDate).format('YYYY-MM-DD'),
                mileage:card.mileage,
                mileageUnit:card.mileageUnit,
                type:card.type
              }));
            card.options.forEach(option=>{
                console.log("option is ",option) ; 
                
            })
             
        }
        else 
        if(card)
          {
            setSelected(card.type);
            const categoryOptions=selectedCategoryData?.options?.split(",");
            categoryOptions.sort((a, b) => a.localeCompare(b));
            setFormData(prevState => ({
              ...prevState,
              options: card.options.map(option =>{
                
                const showOther=  !categoryOptions.includes(option.name);
                const other=  !categoryOptions.includes(option.name)?option.name:null;
                
              return {
                name: option.name,
                cost: option.cost,
                costUnit: option.costUnit,
                partNumber: option.partNumber,
                source: option.source,
                other,
                showOther
              }


              }),
              location:card.location,
              occurance_type:card.occurance_type,
              is_repeating:card.is_repeating,
              occurance:card.occurance,
              notecardType:card.notecardType,
              notes:card.notes,
              logDate:'',
              mileage:'',
              mileageUnit:card.mileageUnit,
              type:card.type
            }));

          }

    }
    ,[card]);

    const [ showReminderOccurance,setShowReminderOccurance]=useState(true);
       const handleDateChange=(e)=>
       {
        const logDate=new Date(e.target.value); 
        const cDate=new Date(); 
         
        setShowReminderOccurance(logDate>cDate);
       }
    const handleOnChange = (e) => {
    
        //console.log(formData);
         const { name, value } = e.target;
         setFormData(prevState => ({
           ...prevState,
           [name]:value
         }));
         
       };
       const handleOptionChange=(index,key,value)=>{  
   
        setFormData(prevState => ({
          ...prevState,
          options: prevState.options.map((option, i) =>
          
            i === index ? { ...option, [key]: value } : option
          ),
        }));
       
      }
  const handleOtherOption=(e,index)=>{
     
    const selectedOptionElement = e.target.options[e.target.selectedIndex];
  
    if (selectedOptionElement.classList.contains('custom_option')) {
       
      setFormData(prevState => ({
        ...prevState,
        options: prevState.options.map((option, i) =>
        
          i === index ? { ...option, showOther:true} : option
        ),
      }));
      
    }
    else 
    {

      setFormData(prevState => ({
        ...prevState,
        options: prevState.options.map((option, i) =>
        
          i === index ? { ...option, showOther:false} : option
        ),
      }));


    }
    return true; 

  }

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
  const handleCardRecordUpdate=async()=>{
  
try {
    let headers = createHeaders();
    const response=await axios.patch(`${baseUrl}/user/updateCarRecords/${card._id}`, formData, {
      headers,
    });
    if(handleResponse)
    {
        handleResponse(response.data);
    }
    
    // The request was successful, handle success here if needed
    console.log('Car record updated successfully');
   
  } catch (error) {
    // The request encountered an error, handle the error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
}



  }
  const handleCarRecordDetails = async () => { 
    // try {
        if(!isNewRecord)
        {
            handleCardRecordUpdate();
            return ;
        }
      setErrorText('');
      
      if(formData.mileage.length<1 && formData.logDate.length<3)
      {
        setErrorText('Please enter the mileage or Date');
        return false ;
      }

 
    

      setErrorText('');
    
        const success = await handleApiCall(
          dispatch,
          updateCarRecordDetails(car._id, formData)
        );
        if (success) {
          
          const updatedData = await dispatch(
            getCarDetailsById(car._id)
          );
          console.log(updatedData) ;
          if (updatedData) {
            if(!anotherRecord)
            {
              setShow(false);
            }
            !anotherRecord? navigate(`/car/${car._id}/vehicle_log`): setShow(true);
          }
        }
     
    // } catch (error) {
    //   console.error(error);
    // }
  };
  
  return (
    <>
     
    <Modal
    show={show}
    onHide={()=>onClose()}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Create New {selectedCategoryData?.title} Record </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <ul style={{paddintBottom: '20px'}} >
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
            
              <input type="date"  disabled={!isNewRecord}  name="logDate" value={formData.logDate} onChange={(e)=>{handleDateChange(e) || handleOnChange(e)}}   placeholder="Select year" />
            </div>
            <div className="col-sm-3">
              <input type="text" disabled={!isNewRecord}  name="mileage" value={(!isNewRecord)?card?.mileageWithUnit:formData.mileage} onChange={(e)=>{handleOnChange(e)}} placeholder="Enter Mileage" />
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
                <label>Pick a {selectedCategoryData?.title}  option</label>
                <select value={input.showOther?input.other:input.name} name ={`options[${index}][name]`}
                onChange={(e)=>{handleOtherOption(e,index) && handleOptionChange(index,'name',e.target.value)}} >
                  <option selected={true} value="">Select...</option>
                  {selectedCategoryData?.options?.split(",").map((element, index) => (
                    <option   key={index} value={element}>
                      {element}
                    </option>
                    
                  ))}
                    <option  key={selectedCategoryData?.options?.split(",").size} value={input.other} class="custom_option"  >
                      Other
                    </option>
              
                </select>
                {input.showOther  && (

                  <input class="mt-2" onChange={(e)=>setFormData(prevState => ({
                    ...prevState,
                    options: prevState.options.map((option, i) =>
                    
                      i === index ? { ...option, ['other']: e.target.value,name:e.target.value } : option
                    ),
                  }))  } value={input.other} type="text"/>

                )}
              
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
                <span   class="prefix-currency">{car?.userId?.preferences?.currencySymbol}</span>
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
            {showReminderOccurance && (

                 
                  <div className="form-input form-input-btn">
                    <div className="float-start pt-4">
                      <img src={remindericon} alt="" />Occurrence
                     
                      <span>(e,g. Date, { formData.mileageUnit?.charAt(0).toUpperCase() +formData.mileageUnit?.slice(1)}, Every { formData.mileageUnit?.charAt(0).toUpperCase() +formData.mileageUnit?.slice(1)})</span>
                    </div>

             
                  </div>
            )}
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

      {showReminderOccurance && (


 
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6">

              <div className="form-input">
                <label>Select an option:</label>
                
                <select  name="occurance_type" onChange={handleOnChange} disabled={!isNewRecord} value={formData.occurance_type}  className="form-control" >
                  <option value="" >Choose...</option>
                
               

                  {(formData.mileage?.length || !isNewRecord) && (

                      <option value="mileage">Mileage Based</option>
                  )}


                  {(formData.logDate?.length || !isNewRecord) && (

                      <option value="date">Date Based</option>
                  )}
                  
                </select>
              </div>

              
              <div className="form-group repeat-check">
                <div className="form-check form-check-inline">
                  
                  <input
                    type="checkbox"
                    disabled={!isNewRecord}
                    className="form-check-input"
                    name="is_repeating"
                    checked={formData.is_repeating}
                    onChange={(e)=>  setFormData(prevState => ({
                      ...prevState,
                      ['is_repeating']:!formData.is_repeating
                    }))}
                  
                  />
                  <label className="form-check-label" htmlFor="repeatingCheckbox">
                    Repeating?
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
            
              <div className="form-input">
                <label>{( formData.is_repeating )?'Once every':'In'} </label>
                  <div className="input-group">
                  <input
                    type="number"
                    disabled={!isNewRecord}
                    className="form-control"
                    value={formData.occurance}
                    name="occurance"
                    onChange={handleOnChange}
                  
                  />
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-input">
                {formData.occurance_type === 'mileage' && ( 
                <div className="input-group-append">
                  <input type="text" className="input-group-text" value={formData.mileageUnit} disabled />
                </div>
                )}

                {formData.occurance_type !== 'mileage' && ( 
                  <div className="input-group-append">
                    <select  disabled={!isNewRecord} name="occurance_date_timeframe" onChange={handleOnChange} value={formData.occurance_date_timeframe} className="form-control" >

                    <option value="days"> Days </option>
                    <option value="months"> Months </option>
                    <option value="years"> Years </option>
                    </select>
                  </div>
              
                )}
              </div>
            </div>


            </div>
        </div>
              )} 

      </div>
       
      <br/>
        
      
      

        <div className="row">
          <div className="col-md-5 col-lg-4">
            <p>
            { formData.notecardType.charAt(0).toUpperCase() + formData.notecardType.slice(1)}
            </p> 
           
            <ul className="notecard-type">
              <li>
                <button   onClick={()=>{
                  setFormData(prevState => ({
                    ...prevState,
                    notecardType:'maintenance'
                  }))

                }}  className={formData.notecardType=='maintenance'?'active':''} >
                  <img src={notecard01} alt="" data-toggle="tooltip" data-placement="bottom" title="Maintainance" />
                </button>
              </li>
              <li>
              
                <button  onClick={()=>{
                    setFormData(prevState => ({
                      ...prevState,
                      notecardType:'modification'
                    }))

                }}  className={formData.notecardType=='modification'?'active':''}>
                  <img src={notecard02} alt="" data-toggle="tooltip" data-placement="bottom"  title="Modification"/>
                </button>
              </li>
              <li>
                <button  onClick={()=>{
                  setFormData(prevState => ({
                     ...prevState,
                     notecardType:'restoration'
                      }))

                }}  className={formData.notecardType=='restoration'?'active':''}>
                  <img src={notecard03} alt="" data-toggle="tooltip" data-placement="bottom"  title="Restoration" />
                </button>
              </li>
              <li>
                <button   onClick={()=>{
                  setFormData(prevState => ({
                    ...prevState,
                    notecardType:'other'
                  }))

                }}  className={formData.notecardType=='other'?'active':''}>
                  <img src={notecard04} alt=""  data-toggle="tooltip" data-placement="bottom"  title="Other"/>
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
     
    </Modal.Body>
  </Modal>
  </>
  );
};
