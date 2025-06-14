import React, { useState } from "react";
import { Box, CssBaseline, Typography, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import SchemaDetail from "../../components/SchemaDetail";
import { useTheme } from "@mui/material/styles";

const Home = () => {
  const [selectedSchema, setSelectedSchema] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // mobile <600px

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Sticky Header */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "60px",
            zIndex: 1300,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Header />
        </Box>

        {/* Sidebar + Main Content below the header */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            pt: "60px",
            height: "100%",
          }}
        >
          {/* Sidebar container */}
          <Box
            sx={{
              width: isMobile ? "auto" : "250px",
              bgcolor: isMobile ? "transparent" : "grey.100",
              overflowY: "auto",
              height: isMobile ? "auto" : "calc(100vh - 60px)",
              position: isMobile ? "relative" : "fixed",
              top: isMobile ? "auto" : "60px",
              left: isMobile ? "auto" : 0,
              bottom: isMobile ? "auto" : 0,
              zIndex: isMobile ? "auto" : 1200,
              boxShadow: isMobile ? "none" : 1,
            }}
          >
            <Sidebar setSelectedSchema={setSelectedSchema} />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              ml: isMobile ? 0 : "250px",
              p: 3,
              overflowY: "auto",
              height: "calc(100vh - 60px)",
              bgcolor: "#f1f3f6",
              width: "100%", // always full width available
            }}
          >
            {selectedSchema ? (
              <SchemaDetail schemaTitle={selectedSchema} />
            ) : (
              <Box>
                <Typography variant="h4" gutterBottom>
                  Welcome to the Dashboard
                </Typography>
                <Typography>
                  Select an item from the sidebar to view its data.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Home;