import { Box, Button, Typography, Stack, TextField, Modal, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import axios from "axios";
import { auth, firestore, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

export default function CameraItem({ open, handleClose, refreshInventory }) {
    const [itemName, setItemName] = useState("");
    const [inventory, setInventory] = useState([]);
    const [user] = useAuthState(auth);

    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [currentCamera, setCurrentCamera] = useState(0)

    useEffect(() => {
        if (user) {
          updatedInventory(user.uid);
        }
    }, [user]);

    const handleTakePhoto = () => {
        const photo = camera.current.takePhoto();

        console.log(photo)
        setImage(photo);
        setIsImage(true);
    };

    const handleReakePhoto = () => {
        setImage("");
        setIsImage(false);
    };

    const handleSwitchCamera = () => {
        camera.current.switchCamera();
    };

    const close = () => {
        setImage("");
        setIsImage(false);
        handleClose();
    }

    const addItem = async (item) => {
        let itemName = item.toLowerCase();

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
    };

    const handleConfirm = async () => {
        try {
            const storageRef = ref(storage, `photos/${user.uid}/${Date.now()}.png`)
            await uploadString(storageRef, image, 'data_url');

            const response = await axios.post('/api/generate', { image }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            setImage("");
            setIsImage(false);
            handleClose();

            const content = response.data.response.message.content.toLowerCase();

            setItemName(content);

            await addItem(content);

            refreshInventory();

            console.log(response.data)
            console.log(content)
        } catch(error) {
            console.error(error);
        }
    };
    
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                position={"absolute"}
                top={"50%"}
                left={"50%"}
                width={375}
                height={375}
                border={"2px solid #000"}
                boxShadow={24}
                display={"flex"}
                flexDirection={"column"}
                textAlign={"center"}
                bgcolor={"#DCDCDC"}
                p={3}
                sx={{
                    transform: "translate(-50%,-50%)",
                    userSelect: "none",
                    borderRadius: "8px"
                }}
            >
                <Box
                    position={"absolute"}
                    right={10}
                    top={10}
                >
                    <IconButton onClick={close}>
                        <CancelPresentationIcon/>
                    </IconButton>
                </Box>
                <Typography marginTop={2} variant="h4">Scan Item</Typography>
                {isImage ?  (
                    <Box
                        width={250}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        overflow="hidden"
                        borderRadius="8px"
                        border={"1px solid #ddd"}
                        bgcolor={"lightgray"}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "15px"
                        }}
                    >
                        <img
                            src={image}
                            alt="Captured"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                ) : (
                    <Box
                        width={250}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        overflow="hidden"
                        borderRadius="8px"
                        border={"1px solid #ddd"}
                        bgcolor={"lightgray"}
                        flexDirection={"column"}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "15px"
                        }}
                    >
                        <Camera
                            ref={camera}
                            aspectRatio={4 / 3}
                            facingMode={currentCamera === 0 ? "environment" : "user"}
                            numberOfCamerasCallback={setCameras}
                        />
                        {cameras <= 1 || currentCamera === 0 && (
                            <Box
                                position={"absolute"}
                                color={"gray"}
                                bottom={95}
                                right={65}
                            >
                                <IconButton onClick={handleSwitchCamera}>
                                    <CameraswitchIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                )}
                {isImage ? (
                        <Box
                            display={"flex"}
                            gap={2}
                            sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "20px"
                            }}
                        >
                            <Button 
                                variant="contained" 
                                onClick={handleReakePhoto}
                            >
                                Retake Photo
                            </Button>
                            <Button 
                                variant="contained"
                                onClick={handleConfirm} 
                            >
                                Confirm
                            </Button>
                    </Box>
                    ) : (
                        <Box
                            display={"flex"}
                            gap={2}
                            sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "20px"
                            }}
                        >
                            <Button 
                                variant="contained" 
                                onClick={handleTakePhoto}
                            >
                                Take Photo
                            </Button>
                        </Box>
                    )
                }
            </Box>
        </Modal>
    );
}
