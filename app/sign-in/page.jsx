"use client"

import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import GoogleIcon from '@/public/google-icon.svg'
import Image from "next/image";

export default function SignIn() {
    const [user, loading] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
          router.push("/");
        }
    }, [loading, user, router]);

    const handleSignIn = async () => {
        setError("");
        setProcessing(true);

        if (!email || !password) {
            setError("All fields are required.");
            setProcessing(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", email)
            router.push('/');
        } catch (error) {
            setError(error.message);
            console.log("Error signing up:", error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleGoogle = async () => {
        setError("")
        setProcessing(true);

        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in with Google");
            router.push('/');
        } catch (error) {
            setError(error.message)
            console.log("Error signing in with Google:", error.message);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <Box
            width={"100vw"}
            height={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Box 
                textAlign={"center"}
                text
                width={"500px"}
                height={"525px"}
                gap={4}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                bgcolor={"lightblue"}
            >
                <Typography variant="h4" marginTop={"25px"}>Sign In</Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        width: "400px",
                        marginTop: "5px"
                    }}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        width: "400px"
                    }}
                />
                {error && 
                    <Typography 
                        sx={{
                            marginTop: "-20px",
                            marginBottom: "-36px"
                        }} 
                        color="error"
                    >
                        {error}
                    </Typography>
                }
                <Button
                    variant="contained"
                    onClick={handleSignIn}
                    sx={{
                        marginTop: "10px",
                    }}
                >
                    {processing ? "Signing In..." : "Sign In"}
                </Button>
                <Box
                    display={'flex'}
                    gap={1}
                >
                    <Typography>Don't have an account?</Typography>
                    <Link href={"/sign-up"} className="blue">Create an account</Link>
                </Box>
                <Divider sx={{ width: '400px', borderColor: 'black', marginTop: "-10px"}}>or</Divider>
                <Button
                    sx={{
                        marginTop: "-5px",
                        textTransform: "none"
                    }}  
                    variant="contained"
                    onClick={handleGoogle}
                >
                    <Box 
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                    >
                        <Image src={GoogleIcon} height={35} width={35} alt='' />
                        <Typography>Sign in with Google</Typography>
                    </Box>
                </Button>
            </Box>
        </Box>
    )
}
