import React, { useState ,useEffect} from "react";
const { forwardRef, useRef, useImperativeHandle } = React;

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {getCarDetailsById} from "../../../src/redux/action/car"
import "./style.css";

import Dropdown from "react-bootstrap/Dropdown";
//images

import logo from "../../Assets/images/wheelman-logo.png";
import hamburgermenu from "../../Assets/images/menu-bar.svg";
import searchicon from "../../Assets/images/search.svg";
import notifyicon from "../../Assets/images/notify-btn-icon.svg";

//Components
import CreateNewRecord from "../../Pages/CreateNewRecord";
import {VehicleLog} from "../../Pages/VehicleLog";
import CostDashboard from "../../Pages/CostDashboard";
import {DocumentTracking} from "../../Pages/DocumentTracking";
import { useSelector ,useDispatch} from "react-redux";
import { logoutAction } from "../../redux/action/auth";
import { useParams, useNavigate  } from 'react-router-dom';
 
import {Navbar} from "../../Pages/NavBar" ;

import Notification from  "../../Component/notification";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "#fff",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({ tab, setTab }) {
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData[0]);
  const [mobileSearchBar, setMobileSearchBar] = useState(false)
  //const userDataUpdated = useSelector((state) => state.user.userData);
  const name = userData?.fullName?.split(" ");
  const userShortName = name?.map((word) => word[0]?.toUpperCase()).join("");
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [globalSearch,setGlobalSearch]=useState("");
  const { car_id } = useParams();
  const singleCarData = useSelector((state) => state.car?.singleCarData?.data);
console.log("userData",userData);
 
  useEffect(() => {
   
    
    if (car_id) { 
       
      dispatch(getCarDetailsById(car_id));
    }
  }, [dispatch]);

 
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const GarageIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
    >
      <path
        d="M20 10.8314C20 13.0253 19.3018 15.1078 17.9808 16.8542C17.7202 17.1989 17.2301 17.2657 16.8864 17.0058C16.5424 16.7455 16.4745 16.2556 16.7346 15.9115C17.8487 14.4388 18.4375 12.6821 18.4375 10.8314C18.4375 6.16797 14.6608 2.39844 10 2.39844C5.336 2.39844 1.5625 6.17087 1.5625 10.8314C1.5625 12.6821 2.15134 14.4388 3.26523 15.9115C3.52554 16.2556 3.45764 16.7455 3.11356 17.0058C2.76932 17.2661 2.27951 17.1982 2.01904 16.8542C0.698242 15.1078 0 13.0253 0 10.8314C0 5.30402 4.47571 0.835938 10 0.835938C15.5273 0.835938 20 5.30707 20 10.8314ZM14.9501 6.12631C15.2551 6.43133 15.2551 6.92602 14.9501 7.23105L12.4036 9.77759C12.6132 10.1641 12.7325 10.6066 12.7325 11.0763C12.7325 12.5831 11.5067 13.8088 10 13.8088C8.49319 13.8088 7.26746 12.5831 7.26746 11.0763C7.26746 9.56961 8.49319 8.34372 10 8.34372C10.4698 8.34372 10.9122 8.46304 11.2987 8.6727L13.8452 6.12616C14.1504 5.82114 14.6449 5.82114 14.9501 6.12631ZM11.17 11.0764C11.17 10.4313 10.6451 9.90637 10 9.90637C9.35486 9.90637 8.82996 10.4313 8.82996 11.0764C8.82996 11.7216 9.35486 12.2465 10 12.2465C10.6451 12.2465 11.17 11.7216 11.17 11.0764Z"
        fill="#55625D"
      />
    </svg>
  );

  const carDetailsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M15.5543 11.6432L17.6265 12.2702C18.448 12.5189 19 13.2626 19 14.121V16.3008C19 16.5921 18.7639 16.8282 18.4727 16.8282H16.9036C16.9157 18.0271 15.9438 18.9998 14.7542 18.9998C13.5647 18.9998 12.5927 18.0272 12.6048 16.8282H7.42762C7.43971 18.0271 6.46785 18.9998 5.27823 18.9998C4.08872 18.9998 3.11676 18.0272 3.12885 16.8282H2.93359C1.86741 16.8282 1 15.9608 1 14.8946V12.8096C1 12.1312 1.55199 11.5792 2.23047 11.5792H2.82095L4.28068 8.7062C4.37061 8.52919 4.55229 8.41771 4.75082 8.41771H6.70407C5.82512 7.29911 4.93866 5.50473 4.93866 2.81672C4.93866 2.51786 5.18648 2.28185 5.47732 2.28948C6.80331 2.31831 8.12227 1.89689 9.19056 1.1037C9.37724 0.965109 9.63262 0.965109 9.8193 1.1037C10.8851 1.89503 12.2032 2.31507 13.5301 2.2866C13.8256 2.28027 14.0688 2.51824 14.0688 2.81384C14.0688 5.51348 13.1649 7.3164 12.2779 8.4355C12.3029 8.44206 12.3238 8.44737 12.344 8.45457C12.531 8.52134 12.66 8.75052 15.5543 11.6432ZM9.50496 2.17076C8.46353 2.8587 7.24811 3.26197 6.00558 3.33394C6.20471 7.48702 8.77948 9.04528 9.50166 9.40194C9.81982 9.24173 10.5006 8.84542 11.1718 8.10942C12.2958 6.87691 12.9104 5.27129 13.002 3.33109C11.7591 3.25951 10.5447 2.85718 9.50496 2.17076ZM7.72043 9.47243H6.34375V11.5792H14.0077L11.9244 9.47243H11.2751C10.4384 10.1826 9.72926 10.4593 9.69245 10.4733C9.5725 10.5191 9.44035 10.5196 9.32018 10.4748C9.28309 10.461 8.56475 10.1873 7.72043 9.47243ZM4.18298 16.8498C4.18298 17.4537 4.67432 17.9451 5.27823 17.9451C5.88218 17.9451 6.37349 17.4537 6.37349 16.8498C6.37349 16.2459 5.88215 15.7546 5.27823 15.7546C4.67432 15.7546 4.18298 16.2459 4.18298 16.8498ZM13.659 16.8498C13.659 17.4537 14.1503 17.9451 14.7542 17.9451C15.3581 17.9451 15.8495 17.4537 15.8495 16.8498C15.8495 16.2459 15.3581 15.7546 14.7542 15.7546C14.1503 15.7546 13.659 16.2459 13.659 16.8498ZM12.8943 15.7735C13.7279 14.3387 15.7855 14.3472 16.6141 15.7735L17.9453 15.7735V14.7316H17.2773C16.9861 14.7316 16.75 14.4954 16.75 14.2042C16.75 13.913 16.9861 13.6769 17.2773 13.6769H17.8255C17.7167 13.4904 17.5402 13.3461 17.321 13.2797L15.1867 12.6339H5.81641C5.52517 12.6339 5.28906 12.3978 5.28906 12.1065V9.47243H5.0744L3.61468 12.3454C3.52475 12.5224 3.34306 12.6339 3.14453 12.6339H2.23047C2.13354 12.6339 2.05469 12.7127 2.05469 12.8097V13.7263H2.61719C2.90842 13.7263 3.14453 13.9624 3.14453 14.2537C3.14453 14.5449 2.90842 14.781 2.61719 14.781H2.05469V14.8946C2.05469 15.3792 2.44896 15.7735 2.93359 15.7735H3.41836C4.25195 14.3387 6.30954 14.3472 7.13818 15.7735H12.8943ZM9.61296 6.59349C9.40701 6.79947 9.0731 6.79944 8.86719 6.59349L8.14645 5.87279C7.94051 5.66684 7.94051 5.33296 8.14645 5.12702C8.3524 4.92107 8.68631 4.92107 8.89222 5.12702L9.24006 5.47482L10.3965 4.31842C10.6024 4.11248 10.9363 4.11248 11.1423 4.31842C11.3482 4.52437 11.3482 4.85825 11.1423 5.06419L9.61296 6.59349Z"
        fill="#55625D"
      />
    </svg>
  );

  const vehicleLogIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M16.0461 0.852844C16.2351 0.732923 16.4704 0.717933 16.6724 0.813087C17.9218 1.40031 18.73 2.41442 18.949 3.66903C19.1979 5.09309 18.6022 6.49955 17.6989 7.24971V16.393C17.6989 17.8308 16.5297 19 15.0919 19C13.6542 19 12.485 17.8308 12.485 16.393V14.4378H7.26841V16.393C7.26841 17.1119 6.6838 17.6965 5.96493 17.6965H3.35795C2.63908 17.6965 2.05446 17.1119 2.05446 16.393V14.0754C1.27889 13.6231 0.750977 12.7915 0.750977 11.8308V10.5273C0.750977 9.53146 1.31865 8.67442 2.1418 8.2358L3.55478 4.93797C3.96603 3.97861 4.90649 3.35815 5.95059 3.35815H11.3131C11.6077 2.25735 12.3898 1.34035 13.5115 0.813087C13.7122 0.717933 13.9494 0.732923 14.1378 0.852844C14.3261 0.972113 14.4402 1.18002 14.4402 1.40292V4.25886L15.0919 4.58473L15.7437 4.25886V1.40292C15.7437 1.18002 15.8577 0.972113 16.0461 0.852844ZM5.95059 4.66163C5.42854 4.66163 4.95863 4.97186 4.75268 5.45155L3.6949 7.92035H12.4843V7.24971C11.8326 6.7042 11.2805 5.70899 11.1939 4.66163H5.95059ZM3.35795 16.393H5.96558L5.96493 14.4378H3.35795V16.393ZM2.05446 11.8308C2.05446 12.5497 2.63908 13.1343 3.35795 13.1343H12.485V9.22384H3.35795C2.63908 9.22384 2.05446 9.80845 2.05446 10.5273V11.8308ZM16.3954 6.9297C16.3954 6.72505 16.4919 6.53279 16.6548 6.40961C17.5093 5.7696 17.8169 4.76331 17.665 3.89323C17.5829 3.42593 17.3711 3.00621 17.0472 2.65752V4.66163C17.0472 4.90865 16.9077 5.13415 16.6874 5.24495L15.3839 5.89669C15.2001 5.98858 14.9838 5.98858 14.8006 5.89669L13.4971 5.24495C13.2762 5.13415 13.1367 4.90865 13.1367 4.66163V2.66013C12.7802 3.04726 12.5599 3.5087 12.5006 4.07637C12.4133 4.92364 12.7594 5.83151 13.4769 6.37051C13.6301 6.44676 13.7885 6.67552 13.7885 6.9297V16.393C13.7885 17.1119 14.3731 17.6965 15.0919 17.6965C15.8108 17.6965 16.3954 17.1119 16.3954 16.393V6.9297ZM5.89146 11.0316C5.89146 11.5996 5.43138 12.0597 4.86336 12.0597C4.29534 12.0597 3.83527 11.5996 3.83527 11.0316C3.83527 10.4636 4.29534 10.0035 4.86336 10.0035C5.43138 10.0035 5.89146 10.4636 5.89146 11.0316ZM11.1784 11.1791C11.1784 11.5395 10.8864 11.8308 10.5267 11.8308H7.91969C7.55992 11.8308 7.26794 11.5395 7.26794 11.1791C7.26794 10.8187 7.55992 10.5273 7.91969 10.5273H10.5267C10.8864 10.5273 11.1784 10.8187 11.1784 11.1791Z"
        fill="#55625D"
      />
    </svg>
  );

  const costDashboardIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_2543_662)">
        <path
          fillRule="evenodd"
          clip-rule="evenodd"
          d="M17.5311 4.93828C16.1675 4.93828 15.062 3.8328 15.062 2.46914C15.062 1.10547 16.1675 0 17.5311 0C18.8948 0 20.0003 1.10547 20.0003 2.46914C20.0003 3.8328 18.8948 4.93828 17.5311 4.93828ZM17.5311 3.45679C16.9857 3.45679 16.5435 3.0146 16.5435 2.46914C16.5435 1.92368 16.9857 1.48148 17.5311 1.48148C18.0766 1.48148 18.5188 1.92368 18.5188 2.46914C18.5188 3.0146 18.0766 3.45679 17.5311 3.45679ZM12.5926 2.22226C13.0017 2.22226 13.3333 1.89062 13.3333 1.48152C13.3333 1.07242 13.0017 0.740779 12.5926 0.740779H9.58499C7.77107 0.74077 6.34925 0.740769 5.22122 0.862982C4.07007 0.987703 3.13735 1.24677 2.34098 1.82537C1.85886 2.17565 1.43488 2.59964 1.08459 3.08175C0.505996 3.87813 0.246924 4.81085 0.122203 5.962C-9.58691e-06 7.09003 -9.53073e-06 8.51185 1.706e-07 10.3258V10.4151C-9.53073e-06 12.229 -9.58691e-06 13.6508 0.122203 14.7788C0.246924 15.93 0.505996 16.8627 1.08459 17.6591C1.43488 18.1412 1.85886 18.5652 2.34097 18.9154C3.13735 19.4941 4.07007 19.7531 5.22122 19.8779C6.34923 20.0001 7.77107 20.0001 9.5849 20.0001H9.67438C11.4882 20.0001 12.91 20.0001 14.038 19.8779C15.1892 19.7531 16.1219 19.4941 16.9183 18.9154C17.4004 18.5652 17.8244 18.1412 18.1746 17.6591C18.7533 16.8627 19.0124 15.93 19.1371 14.7788C19.2593 13.6508 19.2593 12.229 19.2593 10.4152V7.40745C19.2593 6.99835 18.9276 6.66671 18.5185 6.66671C18.1094 6.66671 17.7778 6.99835 17.7778 7.40745V10.3704C17.7778 12.2387 17.7768 13.5803 17.6642 14.6193C17.5531 15.6444 17.3407 16.2866 16.9761 16.7883C16.7172 17.1446 16.4039 17.458 16.0475 17.7169C15.5458 18.0814 14.9036 18.2939 13.8785 18.405C12.8395 18.5176 11.4979 18.5186 9.62964 18.5186C7.76139 18.5186 6.41975 18.5176 5.38078 18.405C4.35569 18.2939 3.7135 18.0814 3.21177 17.7169C2.85542 17.458 2.54205 17.1446 2.28314 16.7883C1.91861 16.2866 1.70612 15.6444 1.59506 14.6193C1.4825 13.5803 1.48148 12.2387 1.48148 10.3704C1.48148 8.50217 1.4825 7.16053 1.59506 6.12157C1.70612 5.09647 1.91861 4.45428 2.28314 3.95254C2.54205 3.5962 2.85542 3.28283 3.21177 3.02392C3.7135 2.65939 4.35569 2.4469 5.38079 2.33584C6.41975 2.22328 7.76139 2.22226 9.62964 2.22226H12.5926ZM4.02618 12.866C3.84601 13.2333 3.99771 13.6772 4.36499 13.8573C4.73228 14.0375 5.17609 13.8858 5.35625 13.5185L6.79857 10.5782C7.24561 9.66681 8.55957 9.71135 8.94386 10.6509C9.81221 12.7734 12.7805 12.8739 13.7905 10.8151L15.2329 7.87477C15.413 7.50747 15.2613 7.06367 14.894 6.88351C14.5267 6.70334 14.0829 6.85503 13.9027 7.22232L12.4604 10.1626C12.0134 11.074 10.6994 11.0295 10.3151 10.0899C9.44678 7.96743 6.47843 7.86688 5.46848 9.92577L4.02618 12.866Z"
          fill="#55625D"
        />
      </g>
      <defs>
        <clipPath id="clip0_2543_662">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const documentTrakingIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_2543_672)">
        <path
          fillRule="evenodd"
          clip-rule="evenodd"
          d="M0.666667 5.33333H2.66667V0.666667C2.66667 0.298333 2.965 0 3.33333 0H16.6667C17.035 0 17.3333 0.298333 17.3333 0.666667V8H19.3333C19.7017 8 20 8.29833 20 8.66667V19.3333C20 19.7017 19.7017 20 19.3333 20H0.666667C0.298333 20 0 19.7017 0 19.3333V6C0 5.63167 0.298333 5.33333 0.666667 5.33333ZM18.6667 18.6667V9.33333H10C9.82333 9.33333 9.65367 9.263 9.52867 9.138L7.05733 6.66667H1.33333V18.6667H18.6667ZM16 1.33333V8H10.276L7.80467 5.52867C7.67967 5.40367 7.51 5.33333 7.33333 5.33333H4V1.33333H16ZM5.99453 4.00005H13.9938C14.3616 4.00005 14.6598 3.70138 14.6598 3.33338C14.6609 2.96538 14.3616 2.66671 13.9938 2.66671H5.99453C5.62668 2.66671 5.32738 2.96538 5.32738 3.33338C5.32847 3.70138 5.62668 4.00005 5.99453 4.00005ZM11.3266 6.66664H13.9922C14.3599 6.66664 14.6584 6.36798 14.6587 5.99998C14.6587 5.63198 14.3599 5.33331 13.9922 5.33331H11.3266C10.9588 5.33331 10.66 5.63198 10.6603 5.99998C10.6603 6.36798 10.9588 6.66664 11.3266 6.66664Z"
          fill="#165840"
        />
      </g>
      <defs>
        <clipPath id="clip0_2543_672">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const carIcon = (
    <svg xmlns="http://www.w3.org/2000/svg"   version="1.1" width="20" height="20" viewBox="0 0 256 256" >

<defs>
</defs>
<g   transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<circle cx="70.735" cy="56.775" r="1.955"  transform="  matrix(1 0 0 1 0 0) "/>
	<circle cx="19.765" cy="56.775" r="1.955"  transform="  matrix(1 0 0 1 0 0) "/>
	<path d="M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 c -1.357 0 -2.696 0.107 -4.016 0.296 c -0.022 0.004 -0.044 0.006 -0.066 0.01 c -7.799 1.133 -14.802 5.468 -19.285 12.106 C 5.706 37.913 0 45.358 0 52.952 c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 c 0.969 4.866 5.269 8.545 10.416 8.545 s 9.447 -3.679 10.416 -8.545 h 30.139 c 0.969 4.866 5.27 8.545 10.416 8.545 s 9.446 -3.679 10.415 -8.545 H 84.1 c 3.254 0 5.9 -2.646 5.9 -5.9 C 90 44.441 83.894 37.331 75.479 36.045 z M 43.269 26.602 c 7.065 0 13.848 2.949 18.676 8.094 H 39.464 l -3.267 -8.068 c 0.275 -0.009 0.55 -0.026 0.826 -0.026 H 43.269 z M 32.08 27.118 l 3.068 7.578 H 18.972 C 22.429 30.813 27.018 28.169 32.08 27.118 z M 19.767 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 s 6.623 2.971 6.623 6.623 C 26.39 60.427 23.419 63.397 19.767 63.397 z M 70.738 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 c 3.651 0 6.622 2.971 6.622 6.623 C 77.36 60.427 74.39 63.397 70.738 63.397 z"  transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" fill="#55625dc2" />
</g>
</svg>
  );
  const userProfileIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M7.53637 5.67728C7.53637 4.04302 8.8612 2.71818 10.4955 2.71818C12.1297 2.71818 13.4546 4.04302 13.4546 5.67728C13.4546 7.31154 12.1297 8.63637 10.4955 8.63637C8.8612 8.63637 7.53637 7.31154 7.53637 5.67728ZM10.4955 1C7.91228 1 5.81819 3.09409 5.81819 5.67728C5.81819 8.26047 7.91228 10.3546 10.4955 10.3546C13.0787 10.3546 15.1727 8.26047 15.1727 5.67728C15.1727 3.09409 13.0787 1 10.4955 1ZM6.67728 12.4546C5.43679 12.4546 4.2471 12.9473 3.36994 13.8245C2.49278 14.7017 2 15.8913 2 17.1318V19.0409C2 19.5154 2.38463 19.9 2.85909 19.9C3.33356 19.9 3.71818 19.5154 3.71818 19.0409V17.1318C3.71818 16.347 4.02994 15.5944 4.58488 15.0394C5.13982 14.4845 5.89248 14.1727 6.67728 14.1727H14.3137C15.0985 14.1727 15.8511 14.4845 16.406 15.0394C16.961 15.5944 17.2727 16.347 17.2727 17.1318V19.0409C17.2727 19.5154 17.6574 19.9 18.1318 19.9C18.6063 19.9 18.9909 19.5154 18.9909 19.0409V17.1318C18.9909 15.8913 18.4981 14.7017 17.621 13.8245C16.7438 12.9473 15.5541 12.4546 14.3137 12.4546H6.67728Z"
        fill="#55625D"
      />
    </svg>
  );
  const token=localStorage.getItem("token");
 
  const [ws, setWs] = useState(null);
 
   useEffect(()=>{
 
    if(token && !ws) 
    {
       
      const socket = new WebSocket(`ws://localhost:5000/${token}/`);
      socket.onopen = () => {
         
        console.log('WebSocket connection opened');
        setWs(socket);
      };
    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      setTimeout(setWs(null),10000);
     
      // Attempt to reconnect after a delay
       
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data) ; 
       
      console.log('Received message from server:', data);
    };

    }
    

   },[ws]);
      
   const handleLogOut = () => {
    window.localStorage.removeItem("token");
    dispatch(logoutAction());
    navigate("/");
  };
  const childRef = useRef();
 


  const handleSearch=()=>{
    if(childRef.current)
    {
      childRef.current.search(globalSearch);
    }
    
  }

  const handleKeyPress=(e)=>{
    if(e.key=='Enter')
    {
      handleSearch() ;
    }
  }
  const [notificationCount,setNotificationCount]=useState(0);

  console.log("childRef ",childRef.current); 
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <div className="container-fluid">
            <div className="header-flex">
            <div className="MSearchInput" style={{height:mobileSearchBar? "50px":"0px"}}>
            <input type="text" placeholder="Search..." onKeyDown={handleKeyPress} onChange={(e)=>setGlobalSearch(e.target.value)} value={globalSearch} />
            <img src={searchicon} alt="" onClick={() => {handleSearch() }} />
              </div>
              <div className="header-left">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                  <img src={hamburgermenu} />
                </IconButton>
                <div className="logo-header">
                  <a href="/"> 
                    <img src={logo} alt="" />
                  </a>
                </div>
              </div>
              <div className="header-right">
                <div className="header-search">
                  <div className="header-search-input">
                    <div className="header-search-input-wrapper">
                      <input type="text" placeholder="Search..." onKeyDown={handleKeyPress} onChange={(e)=>setGlobalSearch(e.target.value)} value={globalSearch} />
                      <button onClick={() => {handleSearch() }}>
                        <img src={searchicon} alt="" />
                      </button>
                      <div className="header-search-close">
                        <i className="fa-solid fa-arrow-left" />
                      </div>
                    </div>
                  </div>
                  <div className="header-search-btn"  onClick={()=>setMobileSearchBar(!mobileSearchBar)}>
                    <img src={searchicon} alt="" />
                  </div>
                </div>
                <div className="notify-area dropdown show">
                  <a href="#" className="notify-btn" data-toggle="dropdown">
                    <img src={notifyicon} alt="" />
                  </a>
                  
                  {notificationCount>0 && (
         <span class="badge rounded-pill bg-danger notification-count">{notificationCount}</span>
                )}
                  <Notification setNotificationCount={setNotificationCount} />
                </div>
                
                <div className="header-profile">
                  <Dropdown>
                    <Dropdown.Toggle variant="default" id="dropdown-basic">
                      <span className="header-profile-avatar">
                        {userShortName}
                      </span>
                      <span className="header-profile-name">
                        {userData?.fullName}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                      <Dropdown.Item href="/profile#preference">Preferences</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <div className="logo-header">
            <a href="/">
              <img src={logo} alt="" />
            </a>
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "390px",
          }}
        >
          <ListItem
            className={
              tab === 0 ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => setTab(0)}
            disablePadding
          >
            <ListItemButton onClick={() => navigate(`/dashboard`)}>
              <ListItemIcon>{GarageIcon}</ListItemIcon>
              <ListItemText primary="Garage Dashboard" />
            </ListItemButton>
          </ListItem>


          <ListItem
            className={
              tab === 6  ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => navigate({pathname: '/add_car',search: `?id=${car_id}`})}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{carIcon}</ListItemIcon>
              <ListItemText primary="Car Profile" />
            </ListItemButton>
          </ListItem>



          <ListItem
            className={
              tab === 1 ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => navigate(`/car/${car_id}/add_record`)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{carDetailsIcon}</ListItemIcon>
              <ListItemText primary="Create a New Record" />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              tab === 2 ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => navigate(`/car/${car_id}/vehicle_log`)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{vehicleLogIcon}</ListItemIcon>
              <ListItemText primary="Vehicle Log" />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              tab === 3 ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => navigate(`/car/${car_id}/cost_dashboard`)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{costDashboardIcon}</ListItemIcon>
              <ListItemText primary="Cost Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              tab === 4 ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => navigate(`/car/${car_id}/document_tracking`)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{documentTrakingIcon}</ListItemIcon>
              <ListItemText primary="Document Tracking" />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              tab === 5 ? "sideMenuItem sideMenuItemActive" : "sideMenuItem"
            }
            onClick={() => navigate(`/profile`)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{userProfileIcon}</ListItemIcon>
              <ListItemText primary="User Profile" />
            
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open} className="main-section">
        <DrawerHeader />
        {/* place your pages */}

        {
          // tab === 0 ? <MyGarageDashboard /> :
           
          tab === 1 ? (
          <CreateNewRecord carId={car_id}/>
          ) : tab === 2 ? (
            <VehicleLog carObj={singleCarData} search={globalSearch}  ref={childRef} />
          ) : tab === 3 ? (
            <CostDashboard  carObj={singleCarData}/>
          ) : tab === 4 ? (
            <DocumentTracking carObj={singleCarData} open={open} search={globalSearch}  ref={childRef} />
          ) : // tab === 5 ? :
          null // Add a default case or handle it as per your requirement
        }
      </Main>
    </Box>
  );
}
