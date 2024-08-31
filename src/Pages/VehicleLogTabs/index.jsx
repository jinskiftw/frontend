import React, { useState,useEffect } from "react";
import "./style.css";
import config from '../../config';

//Owl Carousel Libraries and Module
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import caricon01 from "../../Assets/images/icon01.svg";


const VehicleLogTabs = ({ selectedCategory, setSelectedCategory, categoryList }) => {
  //Owl Carousel Settings
const options = {
  margin: 0,
  responsiveClass: true,
  nav: true,
  autoplay: false,
  loop: false,
  navText: ["", ""],
  smartSpeed: 1000,
  active:3,
  responsive: {
    0: {
      items: 2,
    },
    400: {
      items: 3,
    },
    600: {
      items: 5,
    },
    700: {
      items: 6,
    },
    1000: {
      items: 9,
    },
    1170: {
      items: 10,
    },
  },
};
 
  useEffect(() => {

    const items = document.querySelectorAll('.tabs-carousel .item a');
    items.forEach((item) => {
 
      const category = item.getAttribute('data-category');

      if (category === selectedCategory) {
         
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, [selectedCategory]);
   
   
    return (
      <div>
        
        <OwlCarousel
          className="tabs-carousel owl-carousel"
          {...options}
        >
          <div className="item">
            <a  data-category="-1" className={selectedCategory=="-1"?'active':''} onClick={()=>{setSelectedCategory("-1")}}><img src={caricon01} alt="" /> All</a>
          </div>
          {categoryList?.map((cat,index)=>{

            return (
              <div className="item"> 
              <a data-category={cat._id} className={selectedCategory==cat._id?'active':''} onClick={()=>{setSelectedCategory(cat._id)}} ><img src={`${config.BACKEND_URL}/uploads/category/${cat.icon2}`} alt="" /> {cat.title}</a>
            </div>

            );
          })}
         
       
        </OwlCarousel>
      </div>
    );
 
}
export default VehicleLogTabs;
