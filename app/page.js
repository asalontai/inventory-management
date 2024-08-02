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
import { signOut } from "firebase/auth";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    signOut(auth).then(() => {
      router.push("/sign-in")
    })
  }

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
    if (!user) return;
    const docRef = doc(
      collection(firestore, "inventory"), 
      `${user.uid}_${item}`
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
    if (!user) return;
    const docRef = doc(
      collection(firestore, "inventory"), 
      `${user.uid}_${item}`
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

  useEffect(() => {
    if (user) {
      updatedInventory(user.uid);
    }
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
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
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
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
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleSignOut();
        }}
      >
        Sign Out
      </Button>
      <Box border={"1px solid #333"}>
        <Box
          width={"800px"}
          height={"100px"}
          bgcolor={"#ADD8E6"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h2" color={"333"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width={"800px"} height={"300px"} spacing={2} overflow={"auto"}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width={"100%"}
              minHeight={"150px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              bgcolor={"#f0f0f0"}
              padding={5}
            >
              <Typography
                variant="h3"
                color={"#333"}
                textAlign={"center"}
                textTransform={"capitalize"}
              >
                {name}
              </Typography>
              <Typography
                variant="h3"
                color={"#333"}
                textAlign={"center"}
                textTransform={"capitalize"}
              >
                {quantity}
              </Typography>
              <Stack
                direction={"row"}
                spacing={2}
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
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
