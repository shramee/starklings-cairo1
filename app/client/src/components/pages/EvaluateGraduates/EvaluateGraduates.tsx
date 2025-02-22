import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../../constants/api";
import { useNotification } from "../../../hooks/useNotification";

export const EvaluateGraduates = () => {
  const [file, setFile] = useState<File | null>(null);
  const { showError } = useNotification();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await axios.post(API_URL + "/graduates/evaluate", file, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "evaluated_graduates.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      let errorMessage = "Error uploading file";
      if (axios.isAxiosError(error) && error.response) {
        const blob = new Blob([error.response.data]);
        const text = await blob.text();
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
      }
      showError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 6,
        flexDirection: "column",
      }}
    >
      <Typography variant="h5">Evaluate students</Typography> <br />
      <Typography sx={{mt: 4}}>
        Upload a .csv file containing a single column labeled 'Students' with GitHub usernames, one per line.
      </Typography>
      <Typography variant="caption" component="div" sx={{ my: 2 }}>
        Example:
        <pre>
          Students <br />
          firstStudent <br />
          secondStudent <br />
          thirdStudent <br />
        </pre>
      </Typography>
      <Typography>
        Upon submission, you'll receive a .csv file listing the students and their Starklings exercises completion status.
      </Typography>
      <Box sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input">
            <Button variant="contained" sx={{ my: 2, borderRadius: 0 }} component="span">
              Select CSV File
            </Button>
          </label>
          {file && (
            <Typography sx={{ mt: 2 }}>Selected file: {file.name}</Typography>
          )}
          <br />
          <Button
            variant="contained"
            color="success"
            onClick={handleUpload}
            sx={{ mt: 2 }}
            disabled={!file}
          >
            Submit CSV
          </Button>
        </form>
      </Box>
    </Box>
  );
};
