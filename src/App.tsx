import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  FormHelperText,
  Pagination,
} from "@mui/material";
import {
  countries,
  errroFields,
  formInitialFields,
  genders,
  predefinedData,
} from "./constants";
import styles from "./app.module.css";
import { invalidEmail } from "./helper";

const App: React.FC = () => {
  const [formData, setFormData] = useState(formInitialFields);

  const [errors, setErrors] = useState(errroFields);

  const [submittedData, setSubmittedData] = useState<any[]>(predefinedData);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | "";
  }>({ key: "", direction: "" });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { value: string; name: string } }
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
    if (name) setErrors({ ...errors, [name]: false }); // Reset errors on change
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, subscription: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: formData.name === "",
      email: formData.email === "" || invalidEmail(formData.email),
      gender: formData.gender === "",
      country: formData.country === "",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      setSubmittedData([...submittedData, formData]);
      setFormData(formInitialFields);
    }
  };

  // Update, Copy, and Delete functionality (memoized)
  const handleDelete = useCallback(
    (index: number) => {
      const newData = [...submittedData];
      newData.splice(index, 1);
      setSubmittedData(newData);
    },
    [submittedData]
  );

  const handleUpdate = useCallback(
    (index: number) => {
      setFormData(submittedData[index]);
      handleDelete(index);
    },
    [submittedData, handleDelete]
  );

  const handleCopy = useCallback(
    (index: number) => {
      const copiedData = { ...submittedData[index] };
      setSubmittedData([...submittedData, copiedData]);
    },
    [submittedData]
  );

  // Summary of numeric fields (Age)
  const totalAge = useMemo(() => {
    return submittedData.reduce(
      (sum, data) => sum + (parseInt(data.age) || 0),
      0
    );
  }, [submittedData]);

  const sortedData = [...submittedData].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting if key is not set
    const key = sortConfig.key as keyof FormData;
    const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;

    const valueA = a[key];
    const valueB = b[key];

    // Handle numeric values
    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * directionMultiplier;
    }

    // Handle string values (alphabetical comparison)
    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * directionMultiplier;
    }

    // Handle boolean values (true -> 1, false -> 0)
    if (typeof valueA === "boolean" && typeof valueB === "boolean") {
      return (Number(valueA) - Number(valueB)) * directionMultiplier;
    }

    return 0; // Default case (if types don't match, etc.)
  });

  // Search logic
  const filteredData = useMemo(
    () =>
      sortedData.filter((data) =>
        Object.values(data).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [sortedData]
  );

  // Pagination logic
  const finalData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Sorting logic
  const handleSort = useCallback(
    (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );
  // Page change logic
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <React.Fragment>
      <div className={styles.container}>
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {/* Name Input */}
          <div className={styles.field}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />
          </div>

          {/* Email Input */}
          <div className={styles.field}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={errors.email}
              helperText={
                errors.email && invalidEmail(formData.email)
                  ? "Invalid email"
                  : errors.email
                  ? "Email is required"
                  : ""
              }
            />
          </div>

          {/* Age Input */}
          <div className={styles.field}>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
            />
          </div>

          {/* Country Select Section */}
          <div className={styles.field}>
            <FormControl fullWidth error={errors.country}>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                name="country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
              >
                {countries.map((countryName) => (
                  <MenuItem key={countryName} value={countryName}>
                    {countryName}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && (
                <FormHelperText>Country is required</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Gender Radio Buttons */}
          <div className={styles.field}>
            <FormControl component="fieldset" error={errors.gender}>
              <RadioGroup
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                row
              >
                {genders.map((gender) => (
                  <FormControlLabel
                    value={gender.toLowerCase()}
                    key={gender}
                    control={<Radio />}
                    label={gender}
                  />
                ))}
              </RadioGroup>
              {errors.gender && (
                <FormHelperText>Gender is required</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Subscription Checkbox */}
          <div className={styles.field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.subscription}
                  onChange={handleCheckboxChange}
                />
              }
              label="Subscribe to newsletter"
            />
          </div>

          {/* Feedback */}
          <div className={styles.field}>
            <TextField
              label="Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </div>

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>

        {/* Search Input */}
        <div className={styles.formContainer}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
      </div>
      {/* Submitted Form Data Table */}
      <div className={styles.tableSection}>
        <h2>Form Data</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("name")}>Name</TableCell>
                <TableCell onClick={() => handleSort("email")}>Email</TableCell>
                <TableCell onClick={() => handleSort("gender")}>
                  Gender
                </TableCell>
                <TableCell onClick={() => handleSort("age")}>Age</TableCell>
                <TableCell onClick={() => handleSort("country")}>
                  Country
                </TableCell>
                <TableCell onClick={() => handleSort("subscription")}>
                  Subscribed
                </TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.email}</TableCell>
                  <TableCell>{data.gender}</TableCell>
                  <TableCell>{data.age}</TableCell>
                  <TableCell>{data.country}</TableCell>
                  <TableCell>{data.subscription ? "Yes" : "No"}</TableCell>
                  <TableCell>{data.feedback}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleUpdate(index)}>Update</Button>
                    <Button onClick={() => handleDelete(index)}>Delete</Button>
                    <Button onClick={() => handleCopy(index)}>Copy</Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Summary section with total numeric value i.e age */}
              <TableRow>
                <TableCell colSpan={3}>Summary</TableCell>
                <TableCell>{totalAge}</TableCell>
                <TableCell colSpan={4}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination section */}
        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          className={styles.pagination}
        />
      </div>
    </React.Fragment>
  );
};

export default App;
