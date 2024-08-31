import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { toast } from "react-toastify";
const ConfirmAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const headers={};
        headers['Content-Type'] = 'application/json';
        const response = await axios.post(`${config.BACKEND_URL}/api/user/verifyUserAccount`,{token});
       
        console.log(response.data);
        if (response.data.success) {
            toast.success(response.data.message);
          navigate('/', { state: { successMessage: 'Your account has been verified. You can now log in.' } });
        }
        else 
        {
            toast.error(response.data.message);
            navigate('/');
        }
      } catch (error) {
        console.error('Error confirming account:', error);
       // navigate('/', { state: { errorMessage: 'Error confirming account.' } });
      }
    };

    confirmAccount();
  }, [token, navigate]);
 
  return (
   
    <div>
      {/* Additional content if needed */}
    </div>
  );
};

export default ConfirmAccount;
