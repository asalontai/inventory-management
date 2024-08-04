"use client";

import { useState, useEffect, useRef } from "react";
import { auth, firestore } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Navbar from "./components/Navbar";
import InventoryList from "./components/InventoryList";
import AddItem from "./components/AddItem";
import CountDisplay from "./components/CountDisplay";
import SearchBar from "./components/SearchBar";
import CameraItem from "./components/CameraItem";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const camera = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  const updatedInventory = async (userId) => {
    const snapshot = query(
      collection(firestore, "inventory"), 
      where("userId", "==", userId)
    );
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id.replace(`${userId}_`, ""),
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const addItem = async (item) => {
    let itemName  = item.toLowerCase();

    if (item == "") {
      return;
    }

    if (!user) return;
    const docRef = doc(
      collection(firestore, "inventory"), 
      `${user.uid}_${itemName}`
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { userId: user.uid, quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { userId: user.uid, quantity: 1 });
    }

    await updatedInventory(user.uid);
  };

  const removeItem = async (item) => {
    let itemName = item.toLowerCase();

    if (!user) return;
    const docRef = doc(
      collection(firestore, "inventory"), 
      `${user.uid}_${itemName}`
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { userId: user.uid, quantity: quantity - 1 });
      }
    }

    await updatedInventory(user.uid);
  };

  const handleSearch = inventory.filter((item) => item.name.toLowerCase().startsWith(searchQuery.toLowerCase()));

  const totalItems = handleSearch.length;
  const totalQuantity = handleSearch.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) {
      updatedInventory(user.uid);
    }
  }, [user]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenPhoto = () => setOpenPhoto(true);
  const handleClosePhoto = () => setOpenPhoto(false);

  return (
    <Box
      sx={{
        userSelect: "none",
      }}
    >
      <Navbar />
      <Box
        width={"100vw"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        marginTop={5}
      >
        <AddItem open={openAdd} handleClose={handleCloseAdd} addItem={addItem} /> 
        <CameraItem open={openPhoto} handleClose={handleClosePhoto} />
        <Box 
          width={"870px"}
          display={"flex"}
          alignItems={"center"}
        >
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography
              variant="h5"
            >
              Inventory
            </Typography>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Button
              variant="contained"
              onClick={() => {
                handleOpenPhoto();
              }}
            >
              Add With Photo
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleOpenAdd();
              }}
            >
              Add New Item
            </Button>
          </Box>
        </Box>
        <InventoryList inventory={handleSearch} addItem={addItem} removeItem={removeItem} />
        <Box
          display={"flex"}
          gap={2}
          marginTop={6}
        >
          <CountDisplay name={"Total Items"} count={totalItems} />
          <CountDisplay name={"Total Quantity"} count={totalQuantity} />
        </Box>
      </Box>
    </Box>
  );
}
