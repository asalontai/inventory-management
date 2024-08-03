"use client";

import { useState, useEffect } from "react";
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
import SearchIcon from '@mui/icons-material/Search';
import Navbar from "./components/Navbar";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <Modal open={open} onClose={handleClose}>
          <Box
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            width={400}
            bgcolor={"white"}
            border={"2px solid #000"}
            boxShadow={24}
            p={4}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            sx={{
              transform: "translate(-50%,-50%)",
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width={"100%"} direction={"row"} spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Item..."
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: 15,
                    height: 25,
                    padding: 1
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
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
            <Box
              display={"flex"}
              gap={1}
            >
              <TextField 
                variant="outlined"
                placeholder="Search Items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: "150px",
                  "& .MuiInputBase-input": {
                    fontSize: 15,
                    height: 20,
                    padding: 1
                  }
                }}
              />
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                width={20}
              >
                <SearchIcon 
                  sx={{
                    width: 30,
                    height: 30
                  }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              Add New Item
            </Button>
          </Box>
        </Box>
        <Box border={"1px solid #333"} sx={{ borderRadius: "6px" }}>
          <Box
            width={"900px"}
            height={"60px"}
            bgcolor={"#1976d2"}
            display={"flex"}
            alignItems={"center"}
            padding={2}
            sx={{
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: "4px 4px 0 0"
            }}
          >
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Typography variant="h6" textAlign={"center"} color={"white"} width={"30%"}>
                Item
              </Typography>
              <Typography variant="h6" textAlign={"center"} color={"white"} width={"30%"}>
                Quantity
              </Typography>
              <Typography variant="h6" textAlign={"center"} color={"white"} width={"40%"}>
                Buttons
              </Typography>
            </Box>
          </Box>
          <Stack width={"900px"} height={"350px"} spacing={2} overflow={"auto"} bgcolor={"##DCDCDC"} sx={{ borderRadius: "0 0 4px 4px" }}>
            {handleSearch.map(({ name, quantity }) => (
              <Box
                key={name}
                width={"100%"}
                height={"60px"}
                display={"flex"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                padding={2}
                borderBottom={"1px solid #333"}
              >
                <Typography
                  variant="h5"
                  color={"#333"}
                  width={"30%"}
                  textAlign={"center"}
                  textTransform={"capitalize"}
                >
                  {name}
                </Typography>
                <Typography
                  variant="h5"
                  color={"#333"}
                  width={"30%"}
                  textAlign={"center"}
                >
                  {quantity}
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"40%"}
                  gap={1}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
        <Box
          display={"flex"}
          gap={2}
          marginTop={6}
        >
          <Box
            width={140}
            height={140}
            display={"flex"}
            flexDirection={"column"}
            textAlign={"center"}
            justifyContent={"center"}
            color={"white"}
            bgcolor={"#1976d2"}
            border={"1px solid #333"}
            sx={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              userSelect: "none",
              borderRadius: "8px"
            }}
          >
            <Typography variant="h6" width={110} marginLeft={"auto"} marginRight={"auto"} borderBottom={"1px solid white"}>Total Items</Typography>
            <Typography variant="h6" marginTop={1}>{totalItems}</Typography>
          </Box>
          <Box
            width={140}
            height={140}
            display={"flex"}
            flexDirection={"column"}
            textAlign={"center"}
            justifyContent={"center"}
            color={"white"}
            bgcolor={"#1976d2"}
            border={"1px solid #333"}
            sx={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              userSelect: "none",
              borderRadius: "8px"
            }}
          >
            <Typography variant="h6" width={130} marginLeft={"auto"} marginRight={"auto"} borderBottom={"1px solid white"}>Total Quantity</Typography>
            <Typography variant="h6" marginTop={1}>{totalQuantity}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
