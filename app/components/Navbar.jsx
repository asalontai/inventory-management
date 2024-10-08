import { auth } from "@/firebase";
import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);

  const [anchor, setAnchor] = useState(null);

  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth).then(() => {
      router.push("/");
    });
  };

  const handleMain = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  }

  const handleAccount = () => {
    router.push("/account");
  }

  const handleMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClosing = () => {
    setAnchor(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          textAlign={"center"}
          sx={{
            display: "inline-block",
            cursor: "pointer",
            userSelect: "none",
            width: "160px",
          }}
          onClick={handleMain}
        >
          Pantry Tracker
        </Typography>
        {user ? (
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorE1={anchor}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchor)}
              onClose={handleClosing}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleAccount}>My account</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        ) : (
          <div style={{ marginLeft: "auto" }}>
            <Button href="/sign-in" color="inherit">
              Login
            </Button>
            <Button href="/sign-up" color="inherit">
              Sign Up
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
