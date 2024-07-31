"use client"

import { useState } from "react";
import { auth, firestore } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Box, Button, TextField, Typography } from "@mui/material";
import bcrypt from "bcryptjs";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <Box 
            width={"300px"}
            height={"100vh"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Typography
                variant="h4"
            >
                Sign Up
            </Typography>
        </Box>
    )
}
