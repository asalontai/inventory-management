import { Box, Button, Typography, Stack, TextField, Modal, IconButton } from "@mui/material";
import { useState } from "react";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

export default function AddItem({ open, handleClose, addItem }) {
    const [itemName, setItemName] = useState("");
    
    const handleAddItem = () => {
        addItem(itemName);
        setItemName("");
        handleClose();
    };
    
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                position={"absolute"}
                top={"50%"}
                left={"50%"}
                width={400}
                border={"2px solid #000"}
                boxShadow={24}
                p={4}
                display={"flex"}
                flexDirection={"column"}
                gap={3}
                bgcolor={"#DCDCDC"}
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
                    color="red"
                >
                    <IconButton onClick={handleClose}>
                        <CancelPresentationIcon/>
                    </IconButton>
                </Box>

                <Typography variant="h6">Add Item</Typography>
                <Stack width={"100%"} direction={"row"} spacing={2}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Item..."
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: 15,
                                height: 25,
                                padding: 1,
                            },
                        }}
                    />
                    <Button variant="contained" onClick={handleAddItem}>
                        Add
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
