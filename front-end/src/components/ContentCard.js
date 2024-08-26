//This component is rendered on the homepage in a grid with a title and an image underneath it.

import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CircularProgress, Modal } from "@mui/material";
import { Box } from "@mui/material";

export const ContentCard = ({
  title,
  imgPath,
  position,
  handleDragStart,
  handleDragEnter,
  handleDragOver,
  handleDragEnd,
}) => {
  // State to manage loading status of the image
  const [loading, setLoading] = useState(true);

  // State to manage the modal open/close status
  const [open, setOpen] = useState(false);

  // Function to open the modal when the card is clicked
  const handleOpen = () => setOpen(true);

  // Function to close the modal, when escape is tapped over.
  const handleClose = () => setOpen(false);

  // Function to set loading to false when the image is loaded
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          height: "300px",
          width: "300px",
        }}
        onClick={handleOpen}
        elevation={6}
        draggable
        onDragStart={() => handleDragStart(position)}
        onDragEnter={() => handleDragEnter(position)}
        onDragEnd={() => handleDragEnd()}
        onDragOver={(e) => handleDragOver(e)}
      >
        <CardContent>
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{ textAlign: "center" }}
          >
            {title}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          image={imgPath}
          alt={title}
          onLoad={handleImageLoad}
          sx={{ objectFit: "cover", height: "100%", w: "100%" }}
        />
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 150,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            src={imgPath}
            alt={title}
            style={{ maxHeight: "80%", maxWidth: "80%" }}
          />
        </Box>
      </Modal>
    </>
  );
};
