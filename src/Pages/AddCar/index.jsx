import React, {  useEffect, useState } from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css"; 
import Modal from "react-bootstrap/Modal";
import config from "../../config";
import {formatNumber} from "../../utils/common";
 
import carshowcaseimage1 from "../../Assets/images/car/opcar1.jpg";
import carshowcaseimage2 from "../../Assets/images/car/opcar2.jpg";
import carshowcaseimage3 from "../../Assets/images/car/opcar3.jpg";
import carshowcaseimage4 from "../../Assets/images/car/opcar4.jpg";
import carshowcaseimage5 from "../../Assets/images/car/opcar5.jpg";

import detailcardicon1 from "../../Assets/images/detail-icon-card-icon-1.svg";
import detailcardicon2 from "../../Assets/images/detail-icon-card-icon-2.svg";
import detailcardicon3 from "../../Assets/images/detail-icon-card-icon-3.svg";
import detailcardicon4 from "../../Assets/images/detail-icon-card-icon-4.svg";
import detailcardicon5 from "../../Assets/images/detail-icon-card-icon-5.svg";
import detailcardicon6 from "../../Assets/images/detail-icon-card-icon-6.svg";
import detailcardicon7 from "../../Assets/images/detail-icon-card-icon-7.svg";
import detailcardicon8 from "../../Assets/images/detail-icon-card-icon-8.svg";
import detailcardicon9 from "../../Assets/images/detail-icon-card-icon-9.svg";
import detailcardicon10 from "../../Assets/images/detail-icon-card-icon-10.svg";
import detailcardicon11 from "../../Assets/images/detail-icon-card-icon-11.svg";
import detailcardicon12 from "../../Assets/images/detail-icon-card-icon-12.svg";

import boxcardicon1 from "../../Assets/images/box-card-icon-1.svg";
import boxcardicon2 from "../../Assets/images/box-card-icon-2.svg";
  import boxcardicon3 from "../../Assets/images/box-card-icon-3.svg";
import boxcardicon4 from "../../Assets/images/box-card-icon-4.svg";
import boxcardicon5 from "../../Assets/images/box-card-transfer.svg";
import NavBar from "../../Pages/NavBar";
import { handleApiCall } from "../../utils/apiUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  carData,
  getAllCarDetails,
  getCarDetailsById,
  updateCarDetails,
  updateCarImage,
  updateCarImageDetails,
} from "../../redux/action/car";
import moment from "moment";
import axios from 'axios';
import createHeaders from "../../utils/headers";
import baseUrl from "../../utils/baseUrl";
import { CircleSpinnerOverlay, FerrisWheelSpinner } from 'react-spinner-overlay'
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert'; // Import


export default function AddCar({ setTab }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 

  const userData = useSelector((state) => state.auth.userData[0]);



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const edit = queryParams.get("edit");
  const [show, setShow] = useState(edit);
  const [transferShow, setTransferShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [images, setImages] = useState(new Array(5).fill(null));
  const singleCarData = useSelector((state) => state.car?.singleCarData?.data);
  const [imageNames, setImageNames] = useState(new Array(5).fill(""));
  const [carDetails, setCarDetails] = useState();

  const overlayCars=[carshowcaseimage1,carshowcaseimage2,carshowcaseimage3,carshowcaseimage4,carshowcaseimage5];
  const handleImageChange = async (e, index) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0];
    setImages(newImages);

    const imageName = e.target.files[0] ? e.target.files[0].name : "";
    const newImageNames = [...imageNames];
    newImageNames[index] = imageName;
    setImageNames(newImageNames);

    const imageToUpdateId = singleCarData?.carImage[index]?._id;
    await handleImageUpdate(newImages, index, imageToUpdateId);
  };

  const handleImageUpdate = async (updatedImages, index, imageId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      console.log(updatedImages, "updatedImagesupdatedImages");
      updatedImages.forEach((image, i) => {
        if (image) {
          formData.append(`carImage`, image);
        }
      });
      if (imageId) {
        const success = await handleApiCall(
          dispatch,
          updateCarImageDetails(singleCarData._id, imageId, formData)
        );
        if (success) {
          window.location.reload();
        }
      } else {
        const success = await handleApiCall(
          dispatch,
          updateCarImage(singleCarData._id, formData)
        );
        
        if (success) {
          window.location.reload();
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(getCarDetailsById(id));
    }
  }, [dispatch]);
 
  const deleteAlertOptions = {
    title: 'Confirm',
    message: 'Are  you sure you want to delete this vehicle? All records will be lost if you proceed!',
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
  const confirmedDelete=async(id)=>
  {
    setLoading(true);
    try 
    {
     
      const response = await axios.delete(`${baseUrl}/user/car/delete/${id}`,{headers:createHeaders()});
      toast.success(response.data.message);
      
      navigate(`/dashboard`, { replace: true });

       setLoading(false) ;
    }
    catch(error) 
    {
      setLoading(false);
      console.error(error);
    }
  }

  const handleDelete=( id)=>{
     
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

  const handleEditImage = (index) => {
    debugger;
    console.log("object");
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newImageNames = [...imageNames];
    newImageNames[index] = "";
    setImageNames(newImageNames);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
     
    setCarDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };
  const [isButtonDisabled, setButtonDisabled] = useState(false);
 
  const handleAddCarDetails = async () => {
    try {
      
      setButtonDisabled(true); 
      setLoading(true);
      const formData = new FormData();

      images.forEach((image, index) => {
        if (image !== null && image !== undefined) {
          formData.append("carImage", image);
        }
      });

      Object.entries(carDetails).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      for (var pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1].name);
      }

      if (singleCarData?._id) {
    
        const response =await dispatch(updateCarDetails(singleCarData?._id, carDetails));
        const success=response.data.data;
        if (response.data.status == 200) {
          toast.success(response.data.data.message); 
          const updatedData = await dispatch(
            getCarDetailsById(singleCarData?._id)
          );
          console.log("updatedData",updatedData);
          if (updatedData) {
           
            
            setShow(false);
            
          }
          
        }
        else 
        {
          toast.error(response.data.response?.data.message); 
        }
        setTimeout(  setLoading(false), 2000);
        setTimeout(  setButtonDisabled(false), 2000);
      } else {
        const response =   await dispatch(carData(formData));
        console.log("hain",response.data);
        const success=response.data.data;
        if (response.data.status == 200) 
        {
          setShow(false);
          
          toast.success(response.data.data.message); 
          
          navigate(`/add_car?id=${response.data.data?.data?._id}`);
          
          dispatch(getCarDetailsById(response.data.data?.data?._id));

          
        }
        else 
        {
          toast.error(response.data.response?.data.message); 
        }
    
        setTimeout(  setLoading(false), 2000);
        setTimeout(  setButtonDisabled(false), 2000);
      }
    } catch (error) {
      setLoading(false);
      setButtonDisabled(false); 
      console.error(error);
    }
  };

  const [transferOwnershipEmail,setTransferOwnershipEmail]=useState("");
  const handleTransferOwnershipSubmit=async (e)=>{
    e.preventDefault() ; 
     
    try {
      // Make a POST request to your server endpoint
      const response = await axios.post(`${baseUrl}/user/car/${singleCarData._id}/transfer_ownership`,  {email:transferOwnershipEmail},{headers:createHeaders()});
      
      // Handle the response if needed
      navigate('/dashboard'); 
      toast.success(response.data.message);
      console.log('Server Response:', response.data);
    } catch (error) {
      if(error)
       // alert(error.response.data.message);
      toast.error(error.response.data.message);
      // Handle errors
      console.error('Error submitting form:', error);
    }
  }
  const [loading,setLoading]=useState(false); 
  const start = 2024;
const end = 1960;
  const reverseRangeArray = Array.from({ length: start - end + 1 }, (_, index) => start - index);

  return (
    <>
      <NavBar />
      <section className="add-car-showcase add-carContainer">
      <CircleSpinnerOverlay
      loading={loading}  
 
      zIndex={10000}
       color="#256854"
      />
        <div className="add-car-showcase-wrapper">
          <div
            className={`add-car-showcase-item-main add-car-showcase-item add-car-showcase-main-car ${
              !images[0] && !singleCarData?.carImage[0] && "blank-image"
            }`}
          >
            {singleCarData?.carImage[0] ? (
              <div>
                <img
                  src={`${config.BACKEND_URL}/uploads/cars/${singleCarData.carImage[0].image}`}
                  alt=""
                  className="object-fit"
                />
                

                
                {singleCarData?.carImage[0] && (
                  <div>
                    <input
                      type="file"
                      id={`image-${0}`}
                      className="d-none"
                      onChange={(e) => handleImageChange(e, 0)}
                      accept="image/*"
                    />
                    <label
                      htmlFor={`image-${0}`}
                      className="add-car-showcase-add-btn d-flex align-items-center justify-content-center"
                    >
                      {/* <i className="fa-solid fa-pen" /> */}
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <>
                {!images[0] ? (
                  <img src={carshowcaseimage1} alt="dd" className="object-fit" />
                ) : (
                  <img
                    src={URL.createObjectURL(images[0])}
                    alt="image"
                    className="w-full h-full object-fit"
                  />
                )}
                
                {!images[0] && (
                  <div>
                    <input
                      type="file"
                      id="image-0"
                      className="d-none"
                      onChange={(e) => handleImageChange(e, 0)}
                      accept="image/*"
                    />
                    <label
                      htmlFor="image-0"
                      className="add-car-showcase-add-btn d-flex align-items-center justify-content-center"
                    >
                      <i className="fa-solid fa-plus" />
                    </label>
                  </div>
                )}
                {images[0] && (
                  <div>
                    <input
                      type="file"
                      id={`image-${0}`}
                      className="d-none"
                      onChange={(e) => handleImageChange(e, 0)}
                      accept="image/*"
                    />
                    <label
                      htmlFor={`image-${0}`}
                      className="add-car-showcase-add-btn d-flex align-items-center justify-content-center"
                    >
                      {/* <i className="fa-solid fa-pen" /> */}
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="add-car-showcase-item-list">
            {Array.from({ length: 4 }).map((_, index) => {
              const imageIndex = index + 1;
              const uploadedImage =
                singleCarData && singleCarData.carImage.length > imageIndex
                  ? singleCarData.carImage[imageIndex].image
                  : images.length > imageIndex
                  ? images[imageIndex]
                  : null;

              const imageUrl = uploadedImage
                ? typeof uploadedImage === "string"
                  ? `${config.BACKEND_URL}/uploads/cars/${uploadedImage}`
                  : uploadedImage instanceof File
                  ? URL.createObjectURL(uploadedImage)
                  : null
                : overlayCars[index+1];
              return (
                <div
                  key={index}
                  className={`add-car-showcase-item ${
                    !uploadedImage && "blank-image"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={uploadedImage ? "image" : ""}
                    className={uploadedImage ? "w-full h-full object-fit" : ""}
                  />
                  
                  {uploadedImage && (
                    <div>
                      <input
                        type="file"
                        id={`image-${imageIndex}`}
                        className="d-none"
                        onChange={(e) => handleImageChange(e, imageIndex)}
                        accept="image/*"
                      />
                      <label
                        htmlFor={`image-${imageIndex}`}
                        className="add-car-showcase-add-btn d-flex align-items-center justify-content-center"
                      ></label>
                    </div>
                  )}
                  {!uploadedImage && (
                    <div>
                      <input
                        type="file"
                        id={`image-${imageIndex}`}
                        className="d-none"
                        onChange={(e) => handleImageChange(e, imageIndex)}
                        accept="image/*"
                      />
                      <label
                        htmlFor={`image-${imageIndex}`}
                        className="add-car-showcase-add-btn d-flex align-items-center justify-content-center"
                      >
                        <i className="fa-solid fa-plus" />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="detail-icon-card">
        <div className="container-fluid">
          
          <div className="detail-icon-card-list">
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon1} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                   Year
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData.manufacturerYear
                        : carDetails
                        ? carDetails.manufacturerYear
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon2} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p> 
                  Manufacturer
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.manufacturer
                        : carDetails
                        ? carDetails.manufacturer
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon3} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Model
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.model
                        : carDetails
                        ? carDetails.model
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon4} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Mileage 
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.mileageWithUnit
                        : carDetails
                        ? carDetails.mileageWithUnit
                        : ""}
                    
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon5} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Color
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.color
                        : carDetails
                        ? carDetails.color
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon6} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Transmission
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.transmission
                        : carDetails
                        ? carDetails.transmission
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon7} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  VIN
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.vin
                        : carDetails
                        ? carDetails.vin
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon8}  alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  License Plate Number
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.licensePlateNumber
                        : carDetails
                        ? carDetails.licensePlateNumber
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon9} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Purchase Price
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.purchasePriceWithUnit 
                        : carDetails
                        ? carDetails.purchasePriceWithUnit 
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon10} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Years Owned
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData.yearsOwned
                        : carDetails
                        ? carDetails.yearsOwned
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="detail-icon-card-item">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon11} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                 Distance Per Year
                  <span>
                    <strong>
                      {singleCarData
                        ? singleCarData?.milesDrivenPerYearFormatted
                        : carDetails
                        ? carDetails.milesDrivenPerYearFormatted 
                        : ""}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
            <div className="short-desc detail-icon-card-item ">
              <div className="detail-icon-card-icon">
                <img src={detailcardicon12} alt="" />
              </div>
              <div className="detail-icon-card-content">
                <p>
                  Short Description
                  <span>
                    {singleCarData
                      ? singleCarData?.shortDescription
                      : carDetails
                      ? carDetails.shortDescription
                      : ""}
                  </span>
                </p>
              </div>
              
            </div>
            
            <div className="detail-icon-card-item btncontainer">
              {!singleCarData &&  <button
                className="detail-icon-card-edit-btn carbtn add"
                onClick={handleShow}
              >
               <i className="fa-solid fa-plus" />
              </button>}

              {singleCarData && (
                <>
                  <button
                    className="detail-icon-card-edit-btn carbtn"
                    onClick={handleShow}
                  >
                    <i className="fa-solid fa-pen" />  
                  </button>

                  <button
                    className="detail-icon-card-edit-btn carbtn"
                    onClick={()=>handleDelete(singleCarData._id)}
                    >
                    <i className="fa-solid fa-trash" />
                  </button>
                </>
              )}
            </div>
          </div>
          
        </div>
      </section>

      <section className="box-card-icon">
        <div className="container-fluid">
          <div className="box-card-icon-wrapper">
            <a
              onClick={() => {
                if(id){
                  navigate(`/car/${id}/add_record`);
                  setTab(1);
                }
              }}
              className="box-card-icon-item"
            >
              <div className="box-card-icon-item-content">
                <img src={boxcardicon1} alt="" />
                <p>Create New Record</p>
              </div>
            </a>
            <a
             onClick={() => {
              if(id){  
                navigate(`/car/${id}/vehicle_log`);
                setTab(2);
              }
            }}
              className="box-card-icon-item"
            >
              <div className="box-card-icon-item-content">
                <img src={boxcardicon2} alt="" />
                <p>Vehicle Log</p>
              </div>
            </a>
            <a
             onClick={() => {
              navigate(`/car/${id}/cost_dashboard`);

              setTab(4);
            }}
              className="box-card-icon-item"
            >
              <div className="box-card-icon-item-content">
                <img src={boxcardicon3} alt="" />
                <p>Cost Dashboard</p>
              </div>
            </a>
            <a
              onClick={() => {
                navigate(`/car/${id}/document_tracking`);
  
                setTab(4);
              }}
              className="box-card-icon-item"
            >
              <div className="box-card-icon-item-content">
                <img src={boxcardicon4} alt="" />
                <p>Document Tracking</p>
              </div>
            </a>
            <a
              onClick={()=>setTransferShow(true)}
              className="box-card-icon-item"
            >
              <div className="box-card-icon-item-content">
                <img src={boxcardicon5} alt="" />
                <p>Transfer Ownership</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Modal
        show={transferShow}
        onHide={()=>setTransferShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Transfer Ownership
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="pop-form">
            <div className="row">
  <div class="container mt-1">
    <form onSubmit={(e)=>handleTransferOwnershipSubmit(e)}>
      <div class="form-group">
        <label for="emailInput">Email address:</label>
        <input type="email" class="form-control" onChange={(e)=>setTransferOwnershipEmail(e.target.value)} value={transferOwnershipEmail} placeholder="Enter email"/>
        <small id="emailHelp"  class="form-text text-muted">Once submitted, you will no longer have access to this car.</small>
      </div>
      <button type="submit" class="mb-2 btn btn-danger detail-icon-card-edit-btn">Submit</button>
    </form>
  </div>
</div></div>
        </Modal.Body>

        </Modal>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {singleCarData ? "Edit Details" : "Add Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pop-form">
            <div className="row">
              <div className="col-sm-6 col-lg-4">
                <div className="form-input">
                  <label>Year</label>
                  <select
                  
                    defaultValue={singleCarData?.manufacturerYear}
                    name="manufacturerYear"
                    placeholder="Select year"
                    onChange={handleOnChange}
                  >
                    <option value="">---select---</option>
                    {reverseRangeArray.map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))} 
                    </select>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="form-input">
                  <label>Manufacturer</label>
                  {/* <select
                    name="manufacturer"
                    defaultValue={singleCarData ? singleCarData.manufacturer : ""}
                    onChange={handleOnChange}
                  >
                    <option>Select manufacturer</option>
                    <option>option 1</option>
                    <option>option 2</option>
                    <option>option 3</option>
                  </select> */}
                  <input
                    type="text"
                    name="manufacturer"
                    defaultValue={
                      singleCarData ? singleCarData.manufacturer : ""
                    }
                    onChange={handleOnChange}
                    placeholder="Enter manufacturer"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="form-input">
                  <label>Model</label>
                  {/* <select
                    name="model"
                    defaultValue={singleCarData ? singleCarData.model : ""}
                    onChange={handleOnChange}
                  >
                    <option>Select model</option>
                    <option>option 1</option>
                    <option>option 2</option>
                    <option>option 3</option>
                  </select> */}
                  <input
                    type="text"
                    name="model"
                    defaultValue={singleCarData ? singleCarData.model : ""}
                    onChange={handleOnChange}
                    placeholder="Enter model"
                  />  
                </div>
              </div>
              <div className="col-sm-6 col-lg-6">
                <div className="form-input">
                  <label>Mileage</label>
                  <input
                    type="number"
                    name="mileage"
                    defaultValue={singleCarData ? singleCarData.inputMileage : ""}
                    onChange={handleOnChange}
                    placeholder="Enter milage"
                  />
                </div>
              </div>
         
              <div className="col-sm-6 col-lg-3">
                <div className="form-input">
                  <label>Color</label>
                  {/* <select
                    defaultValue={singleCarData ? singleCarData.color : ""}
                    name="color"
                    defaultValue={singleCarData ? singleCarData.color : ""}
                    onChange={handleOnChange}
                  >
                    <option>Select color</option>
                    <option>option 1</option>
                    <option>option 2</option>
                    <option>option 3</option>
                  </select> */}
                  <input
                    type="text"
                    name="color"
                    defaultValue={singleCarData ? singleCarData.color : ""}
                    onChange={handleOnChange}
                    placeholder="Enter color"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="form-input">
                  <label>Transmission</label>
                  { <select
                    defaultValue={
                      singleCarData ? singleCarData.transmission : ""
                    }
                    name="transmission"
                    
                    onChange={handleOnChange}
                  >
                    <option value="">Select transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    
                  </select> }
                  
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-input">
                  <label>VIN</label>
                  <input
                    type="text"
                    name="vin"
                    defaultValue={singleCarData ? singleCarData.vin : ""}
                    onChange={handleOnChange}
                    placeholder="Enter VIN"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-lg-6">
                <div className="form-input">
                  <label>License Plate Number</label>
                  <input
                    type="text"
                    name="licensePlateNumber"
                    defaultValue={
                      singleCarData ? singleCarData.licensePlateNumber : ""
                    }
                    onChange={handleOnChange}
                    placeholder="Enter license plate number"
                  />
                </div>
              </div>
              
             
              <div className="col-sm-6 col-lg-6">
                <div className="form-input">
                  <label>Purchase Price</label>
                  <span class="prefix-currency">{userData.preferences?.currencySymbol}</span>
                  <input
                    type="number"
                    name="purchasePrice"
                    defaultValue={
                      singleCarData ? singleCarData.purchasePrice : ""
                    }
                    onChange={handleOnChange}
                    placeholder="Enter price"
                  />
                </div>
              </div>

            

              <div className="col-sm-6 col-lg-3">
                <div className="form-input">
                  <label>Years Owned</label>
                  <input
                    type="number"
                    name="yearsOwned"
                    defaultValue={
                      singleCarData
                        ? singleCarData.yearsOwned
                        : ""
                    }
                    onChange={handleOnChange}
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="form-input">
                  <label> Distance Per Year</label>
                  <input 
                    name="drivenPerYear"
                    onChange={handleOnChange}
                    defaultValue={
                      singleCarData ? singleCarData.milesDrivenPerYear : ""
                    }
                    type="number"
                    placeholder="Enter miles"
                  />
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-input">
                  <label>Short Description</label>
                  <textarea
                    placeholder="Enter short description..."
                    defaultValue={
                      singleCarData ? singleCarData.shortDescription : ""
                    }
                    name="shortDescription"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-input form-input-btn">
                  <button onClick={handleAddCarDetails} disabled={isButtonDisabled}>
                    {singleCarData ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
