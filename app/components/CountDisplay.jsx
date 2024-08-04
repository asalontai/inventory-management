import { Box, Typography } from "@mui/material";

export default function CountDisplay({ name, count }) {
    return (
        <Box
            width={140}
            height={140}
            display={"flex"}
            flexDirection={"column"}
            textAlign={"center"}
            justifyContent={"center"}
            color={"white"}
            bgcolor={"#1976d2"}
            border={"1px solid #333"}
            sx={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              userSelect: "none",
              borderRadius: "8px"
            }}
        >
            <Typography variant="h6" width={125} marginLeft={"auto"} marginRight={"auto"} borderBottom={"1px solid white"}>{name}</Typography>
            <Typography variant="h6" marginTop={1}>{count}</Typography>
        </Box>
    )
}