"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Navbar from "./components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <Box width={"100vw"} sx={{ userSelect: "none", }} >
      <Navbar />
      <Box mt={23}>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} sx={{ my: 5 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: "semibold" }}>
            Welcome to Pantry Manager
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Manage your pantry efficiently and never lose track of your supplies.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4 }}
            onClick={() => router.push("/sign-up")}
          >
            Get Started
          </Button>
        </Box>

        <Box display={"flex"} justifyContent="center" alignItems="center" sx={{ mt: 8, ml: 14, mr: 8 }}>
          <Grid container justifyContent={"center"} spacing={2}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center" }} width={"300px"} height={"150px"} border={"1px solid lightgray"} p={2}>
                <Typography variant="h6" gutterBottom>
                  Add Items to Your Pantry
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Easily add new items to your pantry by entering the item name and uploading a photo.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center" }} width={"300px"} height={"150px"} border={"1px solid lightgray"} p={2}>
                <Typography variant="h6" gutterBottom>
                  Delete Items from Your Pantry
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Remove items from your pantry list with a single click.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center" }} width={"300px"} height={"150px"} border={"1px solid lightgray"} p={2}>
                <Typography variant="h6" gutterBottom>
                  Search Pantry Items
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quickly find specific items in your pantry using the search functionality.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center" }} width={"300px"} height={"150px"} border={"1px solid lightgray"} p={2}>
                <Typography variant="h6" gutterBottom>
                  Add Items with Photos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enhance your pantry management by adding items with photos.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>


        <Box display={"flex"} justifyContent={"center"} sx={{ my: 10 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => router.push("/sign-in")}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
