import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'company_name', headerName: 'Company Name', width: 200 },
  { field: 'type', headerName: 'Type', width: 60 },
  { field: 'iec', headerName: 'IEC', type: 'number', width: 100 },
  { field: 'gstin', headerName: 'GSTIN',  width: 160 },
  { field: 'pan', headerName: 'PAN',  width: 120 },
  { field: 'invoice_no', headerName: 'Invoice No',  width: 100 },
  { field: 'hs_code', headerName: 'HS Code', type: 'number', width: 100 },
  { field: 'description', headerName: 'Description',  width: 170 },
  { field: 'port_loading', headerName: 'Port Loading',  width: 100 },
  { field: 'port_discharge', headerName: 'Port Discharge',  width: 110 },
  { field: 'mode', headerName: 'Mode',  width: 60 },
  { field: 'packages', headerName: 'Packages', type: 'number', width: 80 },
  { field: 'gross_weight_kg', headerName: 'Gross Weight (Kg)', type: 'number', width: 135 },
  { field: 'declared_value_inr', headerName: 'Declared Value (INR)', type: 'number', width: 150 },
  { field: 'document_no', headerName: 'Document No',  width: 120 },
  { field: 'status', headerName: 'Status',  width: 80 },
];

function CustomsDetails({rows}) {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        getRowId={(row) => row.gstin} // Use the GSTIN as the row ID
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        pageSizeOptions={[15]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default CustomsDetails;
