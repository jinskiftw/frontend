
import React, { useEffect, useState } from "react";
import "./style.css";
import baseUrl,{backendUrl} from "../../utils/baseUrl";

import createHeaders from "../../utils/headers";
 
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const moment = require('moment');

import {
  getSubscriptionPlans
} from "../../redux/action/subscription";
import {
  getPayment
} from "../../redux/action/payment";
import { handleApiCall } from "../../utils/apiUtils";
import SecurePaymentLogo from "../../Assets/images/secure-stripe-payment-logo.png";
import WheelmanLogo from "../../Assets/images/Wheelman-logo2.png";


export default function SubscriptionForm({currentPlan,page, setPopup, setUserData}) {

  const subscriptionList = useSelector((state) => state.subscription.subscriptionList);
  const { paymentResponse, userData, paymentError } = useSelector((state) => state.payment);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPlan, setSelectedPlan]= useState("")
  const [selectedPlanTitle, setSelectedPlanTitle]= useState("")
  const [selectedPlanPrice, setSelectedPlanPrice]= useState("")
  const [paymentFormError, setPaymentFormError] = useState("")
  const [showPaymetForm, setShowPaymetForm] = useState(false)


  useEffect(()=>{
    dispatch(getSubscriptionPlans());
    
  },[]);
  useEffect(()=>{
    // Handle successful token creation, e.g., send it to your server
    if(paymentResponse){
      setUserData(userData);
      setPopup(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 6000);
    }
    if(paymentError){
      setPaymentFormError(paymentError);
    }
    
  },[paymentResponse, paymentError]);


  const handleSelectedPlan = (plan)=>{
   
    if(currentPlan?.planID!=plan._id)
    { 
      if(selectedPlan==plan._id){
        setSelectedPlan("");
        setSelectedPlanTitle("");
        setSelectedPlanPrice(0);
      }else{
        setSelectedPlan(plan._id);
        setSelectedPlanTitle(plan.title);
        setSelectedPlanPrice(plan.price);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
    }
    try{
      const { token, error } = await stripe.createToken(elements.getElement(CardElement),{
        disableLink: true
      });
      if (error) {
        console.error(error);
        setPaymentFormError(error.message);
      } else {
        dispatch(getPayment({planID:selectedPlan, token:token}));
      }
    }catch(error){
      console.error(error);
      setPaymentFormError(error.message);
    }
  
  };


  const triggerStripe=()=>{
    if(selectedPlan=="" && selectedPlanPrice==0){
      return
    }
    fetch(`${baseUrl}/create-checkout-session`, {
      method: "POST",
      headers:createHeaders(),
      body: JSON.stringify({
       planId: selectedPlan
      })
    })
    .then((res) => res.json())
    .then((data) => {
       
      const clientSecret=(data.clientSecret);
      const publishKey=  (data.publishKey);

      navigate("/payment",{state:{clientSecret,publishKey}})
      
    });
  }


  return (
    <>
    {!showPaymetForm && <div className={`${page}-page`}>
        <div className="plan-container">
        {subscriptionList.length>0 && subscriptionList.map((item,index)=>(
            <div className={`planbox ${currentPlan?.planId==item._id? 'active':selectedPlan==item._id? 'selected':''}`} key={index}>
               <div className="box-inner">
                <div className="plan-title">{item.title}</div>
                <img src={WheelmanLogo} alt="" className="plan-img" />
                
                <div className="plan-price">${item.price}</div>

                {currentPlan?.planId==item._id ? <div className="plan-btn" >
                    Current Plan
                </div>: selectedPlan==item._id? <div className="plan-btn pointer" onClick={()=> handleSelectedPlan(item)} >
                    Selected 
                </div>: <div className="plan-btn pointer" onClick={()=> handleSelectedPlan(item)}>
                    Select 
                </div>}

                {currentPlan?.planId==item._id && 
                <div className="plan-price">Start Date: {moment(currentPlan.startDate).format("MM-DD-YYYY")}<br />
                Expiry Date: {moment(currentPlan?.expiryDate).format("MM-DD-YYYY")}
                </div>}
                <div className="plan-desc" dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
            </div>

        ))}
        
        </div>
        <div className="plan-bottom">
          <div className={`subsbtn  ${selectedPlan? 'pointer':''}`}  onClick={()=>triggerStripe()}>Checkout</div>
        </div>
    </div>}

    {showPaymetForm && <div className="paymentform">
        {paymentFormError!=""? <div className="ErrMsg">{paymentFormError}</div>:''}
        {paymentResponse && <div className="SuccessMsg">Payment successfully and updated your subscription plan</div> }
        <form className="StripeForm" onSubmit={handleSubmit}>
            <CardElement />
            <button className="paymentbtn"  disabled={!stripe} type="submit">Pay</button>
        </form>
        <div className="SecureCheckout">
          <div className='securetext'>secure checkout</div>
          <img src={SecurePaymentLogo} alt='Secure checkout image' />
        </div>
    </div>}

    </>
  )
}