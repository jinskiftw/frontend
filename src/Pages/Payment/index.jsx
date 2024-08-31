
import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements,EmbeddedCheckoutProvider,EmbeddedCheckout } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import baseUrl,{backendUrl} from "../../utils/baseUrl";
import { useNavigate } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import config from  '../../config';
import createHeaders from "../../utils/headers";
import { getUserProfile } from "../../redux/action/auth";
import {   useDispatch } from "react-redux";
export default function Payment() {
    const navigate=useNavigate() ; 
    const location = useLocation();

    const dispatch=useDispatch(); 

    console.log("props ",location.state); 
    const clientSecret=location.state?.clientSecret;
 
    const publishKey=loadStripe(config.STRIPE_PUBLISHABLE_KEY);
 
    console.log("clientScecret is ",clientSecret);
    
   
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const [paymentStatus, setPaymentStatus]= useState(null)
    if(sessionId)
    {
        fetch(`${baseUrl}/session-status?session_id=${sessionId}`,{
            headers:createHeaders(),
        } )
        .then((res) => res.json())
        .then((data) => {
          dispatch(getUserProfile());
          console.log("dat is ",data);
          setPaymentStatus(data.status === 'complete') 
           
        });
    }
  
    const [redirectIn, setRedirectIn]= useState(5);
    useEffect( ()=>{
      // to remove overflow scroll
        let loc2 =  window.location.href;
        console.log("URL Value=>", window.location.href);
        if(/payment/.test(loc2)) { 
          document.body.classList.remove('popup-open');
        }
        // to remove overflow scroll
        
            if(redirectIn<=0)
            {
             
                navigate("/");
            }
           
        
      
    },[redirectIn]);

    if(paymentStatus!==null)
    {
        setTimeout(() => {
            setRedirectIn(redirectIn-1);
           }, 1000)
       
        return (
            <>
               {paymentStatus && (
                   <section id="success">
                   <p>
                     Payment Successful  . Redirect in {redirectIn}
                   </p>
                 </section>
               )} 

                {!paymentStatus && (
                   <section id="error">
                   <p>
                    Payment Failed 
           
                     If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                   </p>
                 </section>
               )} 
            </>
        )
    }
    else 
    return !sessionId && (
        <EmbeddedCheckoutProvider
          stripe={publishKey}
          options={{clientSecret}}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    )


}