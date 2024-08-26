// This is the home page of the application

import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "../utils";
import { NavBar } from "../components";
import { ContentCard } from "../components";
import { Grid, Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { updateDocument, fetchDocuments } from "../services/api";
import { Typography } from "@mui/material";

export const Home = () => {
  // State for storing items and their positions
  const [items, setItems] = useState([]);

  // Refs for tracking previous items and items that have changed
  const previousItemsRef = useRef([]);
  const changedItemsRef = useRef([]);

  // State for managing save process and time since last save
  const [saving, setSaving] = useState(false);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState(0);

  // Refs for handling drag-and-drop functionality
  const dragCard = useRef(0);
  const draggedOverCard = useRef(0);

  // Fetch documents on component mount
  useEffect(() => {
    async function setDocuments() {
      try {
        const documents = await fetchDocuments();
        previousItemsRef.current = documents;
        setItems((prevItems) => documents);
      } catch (error) {
        console.error(error);
      }
    }
    setDocuments();
  }, []);

  // Custom hook for running a callback at specified intervals
  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  // Save changes every 5 seconds if there are changes
  useInterval(() => {
    if (changedItemsRef.current.length > 0) {
      setSaving(true);
      Promise.all(changedItemsRef.current.map(updateDocument))
        .then(() => {
          setSaving(false);
          setTimeSinceLastSave(0);
          changedItemsRef.current = [];
        })
        .catch((error) => {
          console.error("Error updating documents:", error);
          setSaving(false);
        });
    }
  }, 5000);

  // Update time since last save every second
  useInterval(() => {
    setTimeSinceLastSave((prev) => prev + 1);
  }, 1000);

  // Handle the start of a drag event
  const handleDragStart = (position) => {
    dragCard.current = position;
  };

  // Handle the drag enter event
  const handleDragEnter = (position) => {
    draggedOverCard.current = position;
  };

  // Handle the end of a drag event and update positions
  const handleDragEnd = () => {
    const itemsClone = [...items];

    const dragCardIndex = itemsClone.findIndex(
      (item) => item.position === dragCard.current
    );
    const draggedOverCardIndex = itemsClone.findIndex(
      (item) => item.position === draggedOverCard.current
    );

    // Swap positions of dragged items
    itemsClone[dragCardIndex].position = draggedOverCard.current;
    itemsClone[draggedOverCardIndex].position = dragCard.current;

    // Update changed items for saving
    let changedDragCardIndex = changedItemsRef.current.findIndex(
      (item) => item.id === itemsClone[dragCardIndex].id
    );
    let changedDraggedOverCardIndex = changedItemsRef.current.findIndex(
      (item) => item.id === itemsClone[draggedOverCardIndex].id
    );

    if (changedDragCardIndex !== -1) {
      changedItemsRef.current[changedDragCardIndex] = itemsClone[dragCardIndex];
    } else {
      changedItemsRef.current.push(itemsClone[dragCardIndex]);
    }
    if (changedDraggedOverCardIndex !== -1) {
      changedItemsRef.current[changedDraggedOverCardIndex] =
        itemsClone[draggedOverCardIndex];
    } else {
      changedItemsRef.current.push(itemsClone[draggedOverCardIndex]);
    }

    dragCard.current = null;
    draggedOverCard.current = null;
    setItems((prevItems) => itemsClone);
  };

  // Prevent default behavior for drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {saving ? (
          <>
            <CircularProgress />
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                justifySelf: "start",
              }}
            >
              Saving...
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="body2"
              sx={{
                ml: "auto",
                color: "text.secondary",
                mr: 2,
                justifySelf: "start",
              }}
            >
              Time since last save: {timeSinceLastSave} seconds
            </Typography>
            <Grid container spacing={2} sx={{ maxWidth: "950px" }}>
              {items
                ?.sort((a, b) => a.position - b.position)
                .map((dataItem, index) => (
                  <Grid item xs={4} key={index}>
                    <ContentCard
                      title={dataItem.title}
                      imgPath={dataItem.imgpath}
                      position={dataItem.position}
                      handleDragStart={handleDragStart}
                      handleDragEnd={handleDragEnd}
                      handleDragOver={handleDragOver}
                      handleDragEnter={handleDragEnter}
                    />
                  </Grid>
                ))}
            </Grid>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};
