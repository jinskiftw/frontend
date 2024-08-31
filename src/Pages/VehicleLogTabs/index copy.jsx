import React, { useState,useEffect } from "react";
import "./style.css";

//Owl Carousel Libraries and Module
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import caricon01 from "../../Assets/images/icon01.svg";
import caricon02 from "../../Assets/images/icon02.svg";
import caricon03 from "../../Assets/images/icon03.svg";
import caricon04 from "../../Assets/images/icon04.svg";
import caricon05 from "../../Assets/images/icon05.svg";
import caricon06 from "../../Assets/images/icon06.svg";
import caricon07 from "../../Assets/images/icon07.svg";
import caricon08 from "../../Assets/images/icon08.svg";
import caricon09 from "../../Assets/images/icon09.svg";
import caricon10 from "../../Assets/images/icon10.svg";
import caricon11 from "../../Assets/images/icon11.svg";
import caricon12 from "../../Assets/images/icon12.svg";
import caricon13 from "../../Assets/images/icon13.svg";
import caricon14 from "../../Assets/images/icon14.svg";
import caricon15 from "../../Assets/images/icon15.svg";
import caricon16 from "../../Assets/images/icon16.svg";
import categoriesData from "../../Data/categories";


const catImages = [

  caricon02,
  caricon03,
  caricon04,
  caricon05,
  caricon06,
  caricon07,
  caricon08,
  caricon09,
  caricon10,
  caricon11,
  caricon12,
  caricon13,
  caricon14,
  caricon15,
  caricon16,
];

const VehicleLogTabs = ({ selectedCategory,setSelectedCategory }) => {
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
   // console.log('selectedCategory changed:', selectedCategory);
    const items = document.querySelectorAll('.tabs-carousel .item a');
    items.forEach((item) => {
      //console.log("yes");
      const category = parseInt(item.getAttribute('data-category'), 10);
      if (category === selectedCategory) {
         
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, [selectedCategory]);
   
   //console.log("selectedCategory selectedCategory",selectedCategory);
    return (
      <div>
        
        <OwlCarousel
          className="tabs-carousel owl-carousel"
          {...options}
        >
          <div className="item">
            <a  data-category="-1" className={selectedCategory==-1?'active':''} onClick={()=>{setSelectedCategory(-1)}}><img src={caricon01} alt="" /> All</a>
          </div>
          {categoriesData.categories.map((input,index)=>{

return (
  <div className="item"> 
  <a data-category="0" className={selectedCategory==0?'active':''} onClick={()=>{setSelectedCategory(index)}} ><img src={catImages[index]} alt="" /> {input.name}</a>
</div>

);
})}
         
       
        </OwlCarousel>
      </div>
    );
 
}
export default VehicleLogTabs;
