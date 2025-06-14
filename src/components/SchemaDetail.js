import React, { useEffect, useState } from "react";
import FeedbackDialog from './FeedbackDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from "@mui/x-data-grid";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  ThemeProvider,
  createTheme,
  Stack,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
  },
});

const SchemaDetail = ({ schemaTitle }) => {
  const [schemaFields, setSchemaFields] = useState([]);
  const [contributors, setContributors] = useState([]); // 👈 store full list
  const [formData, setFormData] = useState({});
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(0); // MUI DataGrid pages are 0-indexed
  const [pageSize, setPageSize] = useState(7);
  const [totalRows, setTotalRows] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [jsonSchema, setJsonSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState("idle");  // "idle" | "loading" | "success" | "error"
  const [dialogOperation, setDialogOperation] = useState("create");   // "create" | "edit" | "delete"

  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const base64Credentials = btoa(`${email}:${password}`);
  const apiUrl = `http://localhost:8080/${schemaTitle}`;

  useEffect(() => {
    fetchSchema();
    fetchAllData(page, pageSize);
  }, [schemaTitle, page, pageSize]);

  const fetchAllData = async (pageNumber, pageSize) => {

    try {
      const from = pageNumber * pageSize;
      const res = await fetch(`${apiUrl}?from=${from}&size=${pageSize}`, {
        headers: { Authorization: `Basic ${base64Credentials}` },
      });

      if (res.ok) {
        const json = await res.json();
        setAllData(json.data);
        setTotalRows(json.totalData);

        if (json.data.length > 0) {
          const fieldNames = Object.keys(json.data[0]).filter((key) => key !== "id");
          const fields = fieldNames.map((name) => ({
            name,
            type: typeof json.data[0][name] === "number" ? "number" : "text",
          }));
          setSchemaFields(fields);
        }
      } else {
        console.log(res.status);
        console.log(await res.json()
        );

        alert("Access denied or login expired");
      }
    } catch (err) {
      console.error("Pagination fetch error", err);
    }
  };


  const fetchSchema = async () => {
    try {
      const schemaRes = await fetch(`http://localhost:8080/schemas/${schemaTitle}`, {
        headers: { Authorization: `Basic ${base64Credentials}` },
      });

      const schemaData = await schemaRes.json();

      // 👇 Only do this for transaction schema
      if (schemaTitle === "transaction") {
        const contributorRes = await fetch("http://localhost:8080/contributor", {
          headers: { Authorization: `Basic ${base64Credentials}` },
        });

        const contributorJson = await contributorRes.json();

        // Store entire contributor objects
        const contributors = contributorJson.data;

        // Create a dropdown with contributor names (you can store this as ref or state)
        const contributorNames = contributors.map(c => c.contributorName);

        // Set enum in frontend only (not expected by backend)
        schemaData.properties.contributorName.enum = contributorNames;

        // 💡 Store contributors list in state
        setContributors(contributors);
      }

      setJsonSchema(schemaData);
      setUiSchema(generateUISchema(schemaData));
    } catch (err) {
      console.error("Schema fetch failed", err);
    }
  };


  const generateUISchema = (schema) => {
    const elements = Object.keys(schema.properties).map((key) => {
      if (key === "contributorId") {
        return {
          type: "Control",
          scope: `#/properties/${key}`,
          options: {
            hidden: true
          }
        };
      }

      return {
        type: "Control",
        scope: `#/properties/${key}`,
      };
    });

    return { type: "VerticalLayout", elements };
  };


  const handleSubmit = async () => {
    setDialogState("loading");
    setDialogOpen(true);

    try {
      const method = dialogOperation === "edit" ? "PUT" : "POST";
      const url = dialogOperation === "edit" ? `${apiUrl}/${selectedItemId}` : apiUrl;

      console.log(url);
      console.log(JSON.stringify(formData));



      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogState("success");
        await fetchAllData(page, pageSize);
        setFormData({});
        setShowForm(false);
        setSelectedItemId(null);
      } else {
        setDialogState("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setDialogState("error");
    }
  };

  const handleDelete = async (id) => {
    setDialogState("loading");
    setDialogOpen(true);
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${base64Credentials}` },
      });

      if (res.ok) {
        await fetchAllData(page, pageSize);
        setDialogState("success");
        setShowDeleteDialog(false);
        setSelectedItemId(null);
      } else {
        setDialogState("error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDialogState("error");
    }
  };

  const columns = [
    ...schemaFields.map((field) => ({
      field: field.name,
      headerName: field.name,
      flex: 1,
    })),
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color="warning"
            onClick={() => {
              setSelectedItemId(params.row.id);
              setFormData(params.row);
              setShowForm(true)
              setDialogOperation("edit");
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setSelectedItemId(params.row.id);
              setShowDeleteDialog(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    }
    ,
  ];

  const rows = allData.map((item, index) => ({
    id: item.id || item._id || index,
    ...item,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {schemaTitle} Data
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setDialogOperation("create");
              setFormData({});
              setShowForm(true);
            }}
          >
            Create
          </Button>
        </Box>

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this item?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={() => handleDelete(selectedItemId)} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create/Edit Form Dialog */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
          <DialogTitle>{dialogOperation === "edit" ? "Edit Entry" : "New Entry"}</DialogTitle>
          <DialogContent>
            {jsonSchema && (
              <JsonForms
                schema={jsonSchema}
                uischema={uiSchema}
                data={formData}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data }) => {
                  if (schemaTitle === "transaction" && data.contributorName && contributors.length) {
                    const selected = contributors.find(c => c.contributorName === data.contributorName);

                    if (selected) {
                      data.contributorId = selected.id || selected._id;
                      data.amount = selected.amount; // or whatever you want to auto-fill
                    }
                  }

                  setFormData(data);
                }}


              />

            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit} color="success" variant="contained">
              Submit
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Data Table */}
        <Box mt={4} style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            page={page}
            pageSize={pageSize}
            rowCount={totalRows}       // total rows count from backend
            paginationMode="server"     // server side pagination
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(0);
            }}
            rowsPerPageOptions={[7, 10, 20, 50]}
            pagination
          />

          <FeedbackDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            operation={dialogOperation}
            state={dialogState}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SchemaDetail;
