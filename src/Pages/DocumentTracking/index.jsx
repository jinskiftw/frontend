import React, { useEffect, useState ,forwardRef, useRef, useImperativeHandle } from "react";
 

import "./style.css";
import Modal from "react-bootstrap/Modal";
import uploadicon from "../../Assets/images/upload-cloud.svg";
//import pdficon from "../../Assets/images/pdf.svg";
import pdficon from "../../Assets/images/icons/pdf-icon.png";
import jpgicon from "../../Assets/images/icons/jpg-icon.png";
import pngicon from "../../Assets/images/icons/png-icon.png";
import gificon from "../../Assets/images/icons/gif-icon.png";
import docicon from "../../Assets/images/icons/doc-icon.png";
import csvicon from "../../Assets/images/icons/csv-icon.png";
import mp3icon from "../../Assets/images/icons/mp3-icon.png";
import mp4icon from "../../Assets/images/icons/mp4-icon.png";
import zipicon from "../../Assets/images/icons/zip-icon.png";
import txticon from "../../Assets/images/icons/txt-icon.png";
import xlsicon from "../../Assets/images/icons/xls-icon.png";
import ppticon from "../../Assets/images/icons/ppt-icon.png";
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import {
  create, get,update
} from "../../redux/action/carDocuments";
import { toast } from "react-toastify";
import { handleApiCall } from "../../utils/apiUtils";
import config from "../../config";
import { confirmAlert } from 'react-confirm-alert'; // Import 
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import axios from "axios";
import createHeaders from "../../utils/headers";
import baseUrl from "../../utils/baseUrl";
import { CircleSpinnerOverlay  } from 'react-spinner-overlay'
export  const DocumentTracking= forwardRef(({ open, carObj, carDocument },ref) =>{
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(); 
  const userData = useSelector((state) => state.auth.userData[0]);
  const [listView, setListView] = useState((userData.preferences?.view)=='list');

  const [show, setShow] = useState(false);

  const documentData = useSelector((state) => state.carDocument?.carDocument?.data.data);

  
  const [loading,setLoading]=useState(false);

  const documentListingHook = useSelector((state) => state.carDocument?.carDocumentListing?.data.data);
 const [documentListing,setDocumentListing]=useState(null);
  useEffect(()=>{

    if(documentListingHook)
    {
     
      setDocumentListing(documentListingHook); 
    }

  },[documentListingHook])
  const confirmedDelete=async(index)=>
  {
    setLoading(true);
    try 
    {
     
      const response = await axios.delete(`${baseUrl}/user/document/${documentListing.result[index]._id}`,{headers:createHeaders()});
      toast.success(response.data.message);
      
       await getDocumentList(carObj._id);
       setLoading(false) ;
    }
    catch(error) 
    {
      setLoading(false);
      console.error(error);
    }
  }
  const deleteAlertOptions = {
    title: 'Confirm',
    message: 'Do you want to delete this document?',
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
  




  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];

    // Update the form values with the selected file
    setFieldValue('documentFile', file);

    // Optionally, you can perform additional actions with the selected file
  };

  const getDocumentList=async (carId,params={})=>
  {
    setLoading(true); 
    await handleApiCall(
      dispatch,
      get(carObj?._id,params)
    );
    setLoading(false); 
  }
  useEffect(() => {

    if (carObj)
     
      getDocumentList(carObj?._id);

  }, [carObj]);
  const handleSubmit = async (values, actions) => {
     
    console.log("val is ",values); 
    try 
    {
      setIsSubmitting(true);
      let response={};
      if(values._id)
      {
        const id = values._id ; 
        delete values._id;

         response = await dispatch(update(values, id));
      }
      else 
      {
         response =  await dispatch(create(values, carObj._id));
      }
  
  
      console.log("response issss ",response); 
     
      if (response.data.status == 200) {
        actions.resetForm();
        setShow(false);
        setIsSubmitting(false);
        toast.success(response?.data?.data.message);
        handleApiCall(
          dispatch,
          get(carObj?._id)
        );
      }
      else {
        toast.error(response?.data?.data.message);
        setIsSubmitting(false);
      }
    }
    catch (error)
    {
    
      console.log(error);
    }
   
  };

  useImperativeHandle(
    ref,
    () => ({
      search(keyword) {
             
            getDocumentList(carObj._id,{search:keyword});
        }
    }),
)



  const validationSchema = Yup.object().shape({
    documentName: Yup.string().required('Document Name is required'),
    notes: Yup.string().required('Notes are required'),
    documentFile: Yup.mixed().required('Please choose a document file'),
  });
  const validationSchemaUpdate = Yup.object().shape({
    documentName: Yup.string().required('Document Name is required'),
    notes: Yup.string().required('Notes are required'),
    _id:Yup.string().required('ID is required'),
    
  });

  const handleCardClick = (index) => {

    if (index != isExpanded) {
      setIsExpanded(index)
    } else {
      setIsExpanded(null)
    }
    console.log(index);
    console.log(isExpanded);
  };

  const [errorText, setErrorText] = useState("");
  const [selectedEditDocument, setSelectedEditDocument] = useState("");
  const handleDocumentEdit=(DocumentTitle, date, otherNote, docPath,index)=>{
    setSelectedEditDocument(documentListing.result[index]);
    setShow(true);
  }

  const handleDocumentDelete=(DocumentTitle, date, otherNote, docPath,index)=>{
    const modifiedDeleteAlertOptions = {
      ...deleteAlertOptions, // Use spread operator to clone the original object
      buttons: [
        {
          ...deleteAlertOptions.buttons[0], // Clone the 'Yes' button object
          onClick: () => {
            // Modified onClick logic
            confirmedDelete(index);
            // Add your custom logic here
          }
        },
        ...deleteAlertOptions.buttons.slice(1) // Keep the 'No' button unchanged
      ]
    };

    confirmAlert( modifiedDeleteAlertOptions );
  }

  const getDocIcon = (docPath) => {
    const ext = docPath.split('.').pop();
    console.log(ext)
    var icon = pdficon;
    if(ext === "csv") icon = csvicon;
    if(ext === "doc" || ext === "docx") icon = docicon;
    if(ext === "html" || ext === "htm") icon = htmlicon;
    if(ext === "jpeg" || ext === "jpg" ) icon = jpgicon;
    if( ext === "png") icon = pngicon;
    if( ext === "gif") icon = gificon;
    if(ext === "mp3") icon = mp3icon;
    if(ext === "mp4" || ext==="mpeg" || ext==="WMA") icon = mp4icon;
    if(ext === "pdf") icon = pdficon;
    if(ext === "ppt" || ext === "pptx") icon = ppticon;
    if(ext === "txt") icon = txticon;
    if(ext === "xls" || ext === "xlsx") icon = xlsicon;
    if(ext === "zip" || ext === "rar") icon = zipicon;

    return icon;
  }

  const DocumentCard = ({ DocumentTitle, date, otherNote, docPath, index }) => {
    const displayText = isExpanded ? otherNote : otherNote.slice(0, 80);

    if (listView) {
      return (
        <div className={open ? "document-lists d_l_ActiveOpen" : "document-lists d_l_Active"}>
          
          <div className="dc-list-view">
          <div className="img-box">
            <a href={`${config.BACKEND_URL}/uploads/document/${docPath}`} target="_blank">                 
            <img src={getDocIcon(docPath)} alt="" />
            </a>
              
            </div>
            <div className="txt-box">
              <h4>{DocumentTitle}</h4>
              <ul>
                <li>{date}</li>
                <li>{displayText} </li>
              </ul>
              
            </div>
            <div class="document-actions">
                <div class="dropdown">
                  <div class="dropdown-toggle  btn-link" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                    </svg>
                  </div>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" onClick={()=>handleDocumentEdit( DocumentTitle, date, otherNote, docPath,index)}>Edit</a>
                    <a class="dropdown-item" href="#" onClick={()=>handleDocumentDelete(DocumentTitle, date, otherNote, docPath,index)}>Delete</a>
                
                  </div>
                </div>

              </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="document-lists d_l_Non_Active">
          
          <div className="dc-grid-view">
        
            <div className="img-box">
         
              <a href={`${config.BACKEND_URL}/uploads/document/${docPath}`} target="_blank">
                <img src={getDocIcon(docPath)} alt="" />
              </a>
            </div>
            <div className="txt-box">
              <h4>{DocumentTitle}</h4>
              <ul>
                <li>{date}</li>
                <li>{displayText}</li>
              </ul>
            </div>
            <div class="document-actions">
                <div class="dropdown">
                  <div class="dropdown-toggle  btn-link" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                  </svg>
                  </div>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#" onClick={()=>handleDocumentEdit( DocumentTitle, date, otherNote, docPath,index)}>Edit</a>
                  <a class="dropdown-item" href="#" onClick={()=>handleDocumentDelete(DocumentTitle, date, otherNote, docPath,index)}>Delete</a>
              
                </div>
              </div>

              </div>
          </div>
        </div>
      );
    }
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

  const handleClose = () => {
    setShow(false);
    setSelectedEditDocument(null);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
    
    <CircleSpinnerOverlay
      loading={loading}  
 
      zIndex={10000}
      color="#256854"
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedEditDocument?'Edit':'Add'} Document </Modal.Title>
        </Modal.Header>
        <Modal.Body>



          <div className="container mt-2">
            <Formik
              initialValues={{_id:selectedEditDocument?._id, documentName: selectedEditDocument?.documentName, notes:  selectedEditDocument?.notes, documentFile: null }}
              validationSchema={(!selectedEditDocument)?validationSchema:validationSchemaUpdate}
              onSubmit={(values, actions) => {
                handleSubmit(values, actions);
                actions.setSubmitting(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form role="form">
                  <div className="form-group">
                  <ErrorMessage name="_id" component="div" className="sumit error" />
                    <ErrorMessage name="documentName" component="div" className="sumit error" />
                    <label className="model_label" htmlFor="documentName">Document Name:</label>
                    <Field
                      type="text"
                    
                      className="form-control"
                      name="documentName"
                    />
                     <Field
                      type="hidden"
                    
                     
                      name="id"
                    />
                  </div>
                  <div className="form-group">
                    <ErrorMessage name="notes" component="div" className="sumit error" />
                    <label className="model_label" htmlFor="notes">Notes:</label>
                    <Field
                      className="form-control"
                      as="textarea"
                      name="notes"
                      rows="3"
                    ></Field>
                  </div>
                  <div className="form-group">
                    <ErrorMessage name="documentFile" component="div" className="sumit error" />
                    <label className="model_label" htmlFor="documentFile">Choose Document:</label>
                    <input
                      type="file"
                      className="form-control-file"
                      onChange={(event) => {

                        setFieldValue('documentFile', event.currentTarget.files[0]);
                      }}
                      required={!selectedEditDocument}
                    />
                    <br/>
                    {selectedEditDocument && (

<a href={`${config.BACKEND_URL}/uploads/document/${selectedEditDocument?.documentFile}`} target="_blank">View Document
</a>
                    )}
                   
           
                  </div>
                  <br/>
                  <button type="submit" className="mb-2 btn btn-danger detail-icon-card-edit-btn">
                    Save
                  </button>
                </Form>
              )
              }
            </Formik>
          </div>





        </Modal.Body>
      </Modal>


      <section className="document-tracking-section">
        <div className="container-fluid">
          <div className="garage-list-heading">
            <h2>Document Tracking</h2>
            <div className="document-tracking-heading-right">
              <div class="file-input">
                <button
                  type="button"
                  onClick={() => { setShow(true) }}

                >
                  <label class="file-input__label" for="file-input">
                    <img src={uploadicon} alt="" />
                    <span>Upload New Document</span>
                  </label>
                </button>
              </div>

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

          <div className="documentListContainer">
            {

              documentListing?.result?.map((input, index) => {

                const date = new Date(input.createdAt);
                const day = date.getDate();
                const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
                const year = date.getFullYear();

                const formattedDate = `${month} ${day}, ${year}`;

                return DocumentCard({
                  DocumentTitle: input.documentName,
                  date: formattedDate,
                  otherNote: input.notes,
                  docPath: input.documentFile,
                  index
                })
              })  
            }

          </div>
        </div>
      </section>
    </>
  );
})
