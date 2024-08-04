import { Box, Typography, Stack, Button } from "@mui/material";

export default function InventoryList({ inventory, addItem, removeItem }) {
  return (
    <Box border={"1px solid #333"} sx={{ borderRadius: "6px" }}>
      <Box
        width={"900px"}
        height={"60px"}
        bgcolor={"#1976d2"}
        display={"flex"}
        alignItems={"center"}
        padding={2}
        sx={{
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "4px 4px 0 0",
        }}
      >
        <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
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
      <Stack
        width={"900px"}
        height={"350px"}
        overflow={"auto"}
        bgcolor={"#DCDCDC"}
        sx={{ borderRadius: "0 0 4px 4px" }}
      >
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width={"100%"}
            height={"70px"}
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
            <Typography variant="h5" color={"#333"} width={"30%"} textAlign={"center"}>
              {quantity}
            </Typography>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"40%"} gap={1}>
              <Button variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
