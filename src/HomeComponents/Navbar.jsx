import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  DrawerContent
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../reduxAuth/action";
import axios from "axios";

export default function NavBar(){

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const btnRef = useRef();
  const isAuth = useSelector((store)=>store.AuthReducer.isAuth);
  let isBooked = useSelector((store)=>store.AuthReducer.isBooked);
  const [userDetails, setUserDetails] = useState([]);

  const navigate = useNavigate();
  const dispatch=useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const storedUsers = localStorage.getItem("users");
  const userName = storedUsers ? JSON.parse(storedUsers) : [];
  let userIndex; // Declare userIndex outside the axios.get callback
  let emailFromStore=useSelector((store)=>store.AuthReducer.storedEmail);

  const handleLogout = () => {
    dispatch(authLogout())
    navigate("/");
  };

  useEffect(()=>{
    console.log("navbarA",isAuth);
    console.log("navbarB",isBooked);

    if(isAuth || isBooked){
      axios.get('https://forevercare.onrender.com/users')
        .then((response) => { console.log("1st fetch",response.data)
          const existingData = response.data;
          userIndex = existingData.find(user => user.email === emailFromStore);

          if (userIndex) {
            setUserDetails(userIndex.userDetails);
            // Note: isBooked is a prop from Redux store, we shouldn't modify it here
          }
        });
    }
  }, [isAuth, isBooked, emailFromStore]);

  const linkAction = isAuth ? handleLogout : null;

  const Paths = [
    { path: "/", onClick: linkAction, label: "Home" },
    { path: "/services", onClick: linkAction, label: "Service" },
    { path: "/about", onClick: linkAction, label: "About" },
    { path: "/packages", onClick: linkAction, label: "Packages" },
    { path: "/contact", onClick: linkAction, label: "Contact" },
  ];

  const openDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
   <div>
    <Box position="relative" zIndex={10} mb={"60px"}>
      <Box
        position="fixed"
        width={"-webkit-full-available"}
        bg="white"
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
      >
        <Flex
          bg="white"
          color="black"
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          align="center"
          justify="space-between"
        >
          <Flex align="center" justify="center">
            <Link to="/">
              <Box fontSize="2xl" fontWeight="bold" color="#009E60">
                Forever Care
              </Box>
            </Link>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }} align="center">
            <HStack spacing={8}>
              {Paths.map((path) => (
                <Link key={path.path} to={path.path}>
                  <Box
                    px={3}
                    py={2}
                    rounded="md"
                    textStyle="sm"
                    fontWeight="500"
                    _hover={{
                      textDecoration: "none",
                      bg: "gray.100",
                    }}
                  >
                    {path.label}
                  </Box>
                </Link>
              ))}
            </HStack>
          </Flex>

          <Flex align="center">
            <Stack direction="row" spacing={7}>
              {isAuth ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Avatar size="sm" src="https://bit.ly/broken-link" />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Stack direction="row" spacing={4}>
                  <Link to="/signin">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button bg="#009E60" color="white" _hover={{ bg: "#008B52" }}>
                      Sign Up
                    </Button>
                  </Link>
                </Stack>
              )}
            </Stack>
          </Flex>

          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={openDrawer}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open menu"
            ref={btnRef}
          />
        </Flex>
      </Box>

      <Drawer
        isOpen={isDrawerVisible}
        placement="right"
        onClose={closeDrawer}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              {Paths.map((path) => (
                <Link key={path.path} to={path.path} onClick={closeDrawer}>
                  <Box
                    px={3}
                    py={2}
                    rounded="md"
                    textStyle="sm"
                    fontWeight="500"
                    _hover={{
                      textDecoration: "none",
                      bg: "gray.100",
                    }}
                  >
                    {path.label}
                  </Box>
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
   </div>
  );
}