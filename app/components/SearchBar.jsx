import { Box, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <Box
            display={"flex"}
            gap={1}
        >
            <TextField 
                variant="outlined"
                placeholder="Search Items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: "150px",
                  "& .MuiInputBase-input": {
                    fontSize: 15,
                    height: 20,
                    padding: 1
                  }
                }}
            />
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                width={20}
            >
                <SearchIcon 
                sx={{
                    width: 30,
                    height: 30
                }}
                />
            </Box>
        </Box>
    )
}