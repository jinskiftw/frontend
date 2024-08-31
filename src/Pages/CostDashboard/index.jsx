import React, { useState,useEffect } from "react";
 
import { useDispatch, useSelector } from "react-redux";
import costicon01 from "../../Assets/images/img1.png";
import costicon02 from "../../Assets/images/img2.png";
import costicon03 from "../../Assets/images/img3.png";
import costicon04 from "../../Assets/images/img4.png";
import linechart from "../../Assets/images/linegr.png";
import piechart from "../../Assets/images/pie-chart.png";
import "./style.css";

import ApexChart from "../../Component/LineChart"
import { PieChart } from "../../Component/PieChartV2"

import {costBreakdownByCategory,costOfOwnership} from "../../redux/action/costTracking"
import { Chart } from "react-google-charts";
export default function CostDashboard({carObj}) {

  const dispatch=useDispatch() ; 
  const [ownershipDefaultCategory,setOwnershipDefaultCategory]=useState(null);
  const [ownershipCategories,setOwnershipCategories]=useState(null);
  const [ownershipSet,setOwnershipSet]=useState(false);
  const [lineChartData,setLineChartData]=useState(false);
  const [pieChartData,setPieChartData]=useState(false);
  const costOwnershipData=useSelector((state) => state.costTracking?.ownershipData?.response.data);
  const costBreakingData=useSelector((state) => state.costTracking.costBreakingData?.response?.data);

  const userData = useSelector((state) => state.auth.userData[0]);
  console.log("userData is ",userData);
  const shortMonthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const currentYear = new Date().getFullYear();

  const [selectedYear,setSelectedYear]=useState(currentYear) ; 
  // Generate an array of years from 2010 to the current year
  const years = [];
  for (let year =currentYear; year >=  carObj?.manufacturerYear; year--) {
    years.push(year);
  }

  useEffect(() => {
    console.log("carObj ", carObj);
  
    if (carObj) {
      dispatch(costBreakdownByCategory(carObj._id));
    } 
  }, [carObj]);
  
useEffect(() => {
  if (carObj && selectedYear) {
    dispatch(costOfOwnership(carObj._id, selectedYear));
  } 
}, [carObj, selectedYear]);
  useEffect(()=>{
    if(costBreakingData)
    {
      console.log("costBreakingData  KK",costBreakingData);
      const organizedData = [  ["Category", "Sum"]];
    
      costBreakingData.forEach((item)=>{
        organizedData.push([item.categoryName,item.sumOfCosts]);

      });
      console.log("organizedDataorganizedData",organizedData);
    
      setPieChartData(organizedData);
    }
   

  },[costBreakingData]);


  useEffect(()=>{
    if(!costOwnershipData)
    {
      return ; 
     
    }
    console.log("yes it is there "); 
 
      setOwnershipDefaultCategory(costOwnershipData[0]?.categoryId);
    

    const categoryNames = costOwnershipData.map(result => ({ title: result.categoryName, id: result.categoryId }))
      .filter((value, index, self) =>
        self.findIndex(item => item.id === value.id) === index
      );
      const organizedData = {};
     

      costOwnershipData.forEach(item => {
        const categoryId = item.categoryId;
        
        if (!organizedData[categoryId]) {
          organizedData[categoryId] = [];
         
          organizedData[categoryId]["costs"] =Array.from({ length: 12 }, () => 0);
        }
   
        organizedData[categoryId]["costs"][item._id.month-1]=(item.sumOfCosts);
        
  
      });
   
      setLineChartData(organizedData); 



    setOwnershipCategories(categoryNames);

  },[costOwnershipData]);

 

  return (
    <>
 
      <section className="cost-tracking-section">

        <div className="container-fluid">
          <div className="cost-tracking">
            <h2>Cost Tracking</h2>
            <div className="cost-tracking-sub">
              <p>
                Car: <span>{carObj?.manufacturerYear}  {carObj?.manufacturer} {carObj?.model} </span>
              </p>
              <p>
                Mileage: <span>{carObj?.mileageWithUnit}</span>
              </p>
            </div>
          </div>
          <div className="cost-of-ownership-wrapper">
            <div className="user-info-car-right">
              <div className="user-info-car-right-left">
                <img src={costicon01} alt="" />
              </div>
              <div className="user-info-car-right-right">
                <h4>
               
                  <span>{userData?.preferences?.currencySymbol}{Math.ceil(costBreakingData?.reduce((accumulator, currentObject) => {
                    return accumulator + currentObject["sumOfCosts"];
                  }, 0)).toLocaleString()
                  }
                  </span>Cost of Ownership
                </h4>
              </div>
            </div>
            <div className="user-info-car-right">
              <div className="user-info-car-right-left">
                <img src={costicon02} alt="" />
              </div>
              <div className="user-info-car-right-right">
                <h4>
                  <span> {carObj?.yearsOwned} </span>Years Owned
                </h4>
              </div>
            </div>
            <div className="user-info-car-right">
              <div className="user-info-car-right-left">
                <img src={costicon03} alt="" />
              </div>
              <div className="user-info-car-right-right">
                <h4>
                  <span>{userData?.preferences?.currencySymbol}{Math.round(costBreakingData?.reduce((accumulator, currentObject) => {
                    return accumulator + currentObject["sumOfCosts"];
                  }, 0)/carObj?.yearsOwned).toLocaleString()
                  }
                  </span>Cost / Year
                </h4>
              </div>
            </div>
            <div className="user-info-car-right">
              <div className="user-info-car-right-left">
                <img src={costicon04} alt="" />
              </div>
              <div className="user-info-car-right-right">
                <h4>
                  <span>{userData?.preferences?.currencySymbol}{(Math.ceil(costBreakingData?.reduce((accumulator, currentObject) => {
                    return accumulator + currentObject["sumOfCosts"];
                  }, 0))+carObj?.purchasePrice).toLocaleString()}
                  </span> Total Cost
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bottom-section">
        <div className="container-fluid">
          <div className="line-graph-chart-wrapper">
            <div className="line-graph">
              <div className="line-graph-top">
                <h4>Cost of Ownership</h4>
                <div className="braking-left">
                  <div class="cost-ownership-filter form-input">
                    <select value={selectedYear} onChange={(e)=>{ setSelectedYear(e.target.value)}}>
                      {years?.map((item)=>( 

                          <option value={item}>{item}</option>

                      )
                      )}
                      
                   
                    </select>
                    <select value={ownershipDefaultCategory} onChange={(e)=>{  setOwnershipDefaultCategory(e.target.value)}}>
                      {ownershipCategories?.map((item)=>( 

                          <option value={item.id}>{item.title}</option>

                      )
                      )}
                      
                   
                    </select>
                  </div>
                </div>
              </div>
              <div className="line-graph-bottom">
              {  (

<ApexChart categories={shortMonthsArray} data={lineChartData[ownershipDefaultCategory]?.costs}/>
  )}
           
              </div>
            </div>
            <div className="pie-chart">
              <h4>Total Cost breakdown</h4>
              <div className="pie-graph-bottom GrapBox">
                {/* <PieArcLabel /> */}
          
                <Chart
    sliceVisibilityThreshold="0.000001"
      chartType="PieChart"
      data={pieChartData}
      options={{title: "Cost breakdown",sliceVisibilityThreshold:0.0001}}
      formatters={[
        {
           type: "NumberFormat",
           column: 1,
           options: {
              prefix: "$",
             
              negativeColor: "red",
              negativeParens: true,
            }
         }
     ]}
      width={"100%"}
      height={"400px"}
    />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
