"use client"

import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import GoogleIcon from '@/public/google-icon.svg'
import Image from "next/image";

export default function SignUp() {
    const [user, loading] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
          router.push("/");
        }
    }, [loading, user, router]);

    const handleSignUp = async () => {
        setError("");
        setProcessing(true);

        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            setProcessing(false);
            return;
          }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setProcessing(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", email)
            router.push('/sign-in');
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
            color={"white"}
        >
            <Box 
                textAlign={"center"}
                text
                width={"500px"}
                height={"615px"}
                gap={4}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                bgcolor={"#1976d2"}
                sx={{
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    userSelect: "none",
                    borderRadius: "8px"
                }}
            >
                <Typography variant="h4" marginTop={"25px"} color={"white"}>Sign Up</Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        width: "400px",
                        marginTop: "5px",
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white', 
                            },
                            '&:hover fieldset': {
                                borderColor: '#ffffff',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ffffff', 
                            },
                            '& input': {
                                color: 'white',
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "white",
                            "&.Mui-focused": {
                            color: "white",
                            },
                        },
                    }}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        width: "400px",
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white', 
                            },
                            '&:hover fieldset': {
                                borderColor: '#ffffff',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ffffff', 
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "white",
                            "&.Mui-focused": {
                            color: "white",
                            },
                        },
                    }}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{
                        width: "400px",
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white', 
                            },
                            '&:hover fieldset': {
                                borderColor: '#ffffff',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ffffff', 
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "white",
                            "&.Mui-focused": {
                            color: "white",
                            },
                        },
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
                    onClick={handleSignUp}
                    sx={{
                        marginTop: "10px",
                        backgroundColor: "white",
                        color: "black",
                        '&:hover': {
                            backgroundColor: "#DCDCDC"
                        }
                    }}
                >
                    {processing ? "Signing Up..." : "Sign Up"}
                </Button>
                <Box
                    display={'flex'}
                    gap={1}
                >
                    <Typography>Have an account?</Typography>
                    <Link href={"/sign-in"} className="custom-link">Login with account</Link>
                </Box>
                <Divider sx={{ width: '400px', marginTop: "-10px"}}>or</Divider>
                <Button
                    sx={{
                        marginTop: "-5px",
                        textTransform: "none",
                        backgroundColor: "white",
                        color: "black",
                        '&:hover': {
                            backgroundColor: "#DCDCDC"
                        }
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
                        <Typography>Sign Up with Google</Typography>
                    </Box>
                </Button>
            </Box>
        </Box>
    )
}
