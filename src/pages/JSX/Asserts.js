import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Schemadetail from '../../components/SchemaDetail';
import {
  Box,
  Button,
  Card,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(() => ({
  position: "relative",
  borderRadius: 16,
  padding: 12,
  backgroundColor: "#e5fcfb",
  minWidth: 250,
  boxShadow: "0 0 20px 0 rgba(0,0,0,0.12)",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  },
}));

const ButtonLearnMore = styled(Button)(() => ({
  backgroundColor: "#fff !important",
  color: "#fb703c",
  boxShadow: "0 2px 6px #d0efef",
  borderRadius: 12,
  minWidth: 120,
  textTransform: "initial",
  fontSize: "0.875rem",
  fontWeight: 700,
}));

const StyledDiv = styled("div")(() => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  transform: "translate(70%, 50%)",
  borderRadius: "50%",
  backgroundColor: "rgba(71, 167, 162, 0.12)",
  padding: "40%",
  "&:before": {
    content: '""',
    position: "absolute",
    borderRadius: "50%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "-16%",
    backgroundColor: "rgba(71, 167, 162, 0.08)",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Asserts = () => {
  const [assertsmenu, setAssertsmenu] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:8080/schemas");
        const data = await response.json();
        setAssertsmenu(data);
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      }
    };
    fetchMenu();
  }, []);

  const handleOpen = (title) => {
    setSelectedSchema(title);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchema(null);
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, p: 2 }}>
        {assertsmenu.map((item, index) => (
          <StyledCard key={index}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mr: 2 }}>
              <Typography sx={{ color: "#fb703c", fontSize: "1.125rem", fontWeight: 700 }}>
                {item.title || `Item ${index + 1}`}
              </Typography>
              <Typography sx={{ color: "#48bbb5", fontSize: "0.875rem", fontWeight: 500 }}>
                {item.description || "No description available."}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <ButtonLearnMore onClick={() => handleOpen(item.title)}>View Details</ButtonLearnMore>
              </Box>
            </Box>
            <StyledDiv />
          </StyledCard>
        ))}
      </Box>

      {/* Fullscreen Dialog */}
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative", backgroundColor: "#48bbb5" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {selectedSchema} Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          {selectedSchema && <Schemadetail schemaTitle={selectedSchema} />}
        </Box>
      </Dialog>
    </>
  );
};

export default Asserts;
