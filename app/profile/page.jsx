"use client"

import { Avatar, Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
    const [user, loading] = useAuthState(auth);
    const [profileData, setProfileData] = useState({
        displayName: "",
        photoURL: "",
        email: "",
    });

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
          router.push("/sign-in");
        }
    }, [loading, user, router]);
    
    useEffect(() => {
        if (user) {
          const fetchProfileData = async () => {
            const userDoc = await getDoc(doc(firestore, "users", user.uid));
    
            if (userDoc.exists()) {
              setProfileData({
                displayName: userDoc.data().displayName || user.displayName || "",
                photoURL: userDoc.data().photoURL || user.photoURL || "",
                email: user.email || "",
              });
            } else {
              setProfileData({
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                email: user.email || "",
              });
            }
          };
    
          fetchProfileData();
        }
    }, [user]);
    

    return (
        <Box>
            <Navbar />
            <Box
                width={"100vw"}
                marginTop={"200px"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={2}
            >
                <Avatar
                    src={profileData.photoURL}
                    alt={profileData.displayName}
                    sx={{ width: 100, height: 100 }}
                />
                <Typography variant="h4">Name: {profileData.displayName}</Typography>
                <Typography variant="h6">Email: {profileData.email}</Typography>
            </Box>
        </Box>
    )
}