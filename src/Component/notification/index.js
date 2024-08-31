import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../redux/action/notifications";
import costicon04 from "../../Assets/images/img4.png";
import baseUrl from "../../utils/baseUrl";
import createHeaders from "../../utils/headers";
import axios from "axios";

import { useNavigate } from 'react-router-dom';

const Notification = ({ setNotificationCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const notificationList = useSelector(
    (state) => state.notifications?.notifications?.response
  );

  useEffect(() => {
    if (!notificationList) {
      dispatch(getNotifications());
    }
    else 
    {
      setNotificationCount(notificationList.unreadCount);
    }
  }, [notificationList]);

  const handleReadNotification=async (item,e)=>
  {
    e.preventDefault();
 
    if(!item.read)   
    {
      const response = await axios.put(`${baseUrl}/notifications/${item._id}`,{}, {
      
        headers:createHeaders(),
      });
    } 

    if(item.carId)
      navigate(`/car/${item.carId._id}/vehicle_log`);

    dispatch(getNotifications());
  }

  const handleDeleteNotification=async(id)=>
  {
    try 
    {
      const response = await axios.delete(`${baseUrl}/notifications/${id}`,{headers:createHeaders()});
      toast.success(response.data.message);
      
      dispatch(getNotifications());
    }
    catch(error) 
    {
      console.error(error);
    }
  }

  const count=notificationList?.result.filter(notification => notification.carId).length;
 
  return (
    <div
      class="dropdown-menu notifications notification-ui_dd"
      aria-labelledby="navbarDropdown"
    >
      <div class="notification-ui_dd-header">
        <h3 class="text-center">{count?'':'No'} Notifications </h3>
      </div>
      <div class="notification-ui_dd-content">
        {notificationList?.result?.map((item,index) => { 
          if(item.carId)
          return (
          <a href="#" onClick={(e)=>handleReadNotification(item,e)}>
          <div class="notification-list notification-list--unread" key={index}>
            
            <div class="notification-list_img">
              <img src={costicon04} alt="user" />
            </div>
            <div class="notification-list_detail">
              <div className="notification-item-close" onClick={()=>{handleDeleteNotification(item._id)}}>X</div>
              <p>
                <b>{item.title}</b> : {item.description}
              </p>
              <p><b>{item.carId.manufacturerYear}, {item.carId.manufacturer}, {item.carId?.model}</b></p>
              <p>
                <small>{item.timeAgo}</small>
              </p>
            </div>
          </div>
          </a>
        )})}
      </div>
      <div class="notification-ui_dd-footer">
        <a
          href="#!"
          style={{ width: 100 + "%" }}
          class="btn btn-success btn-block"
        >
          {" "}
        </a>
      </div>
    </div>
  );
};

export default Notification;
