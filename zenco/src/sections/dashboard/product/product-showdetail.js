import {
  Button,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const showDetailProduct = (product) => {
  return (
    <TableRow>
      <TableCell
        colSpan={7}
        sx={{
          p: 0,
          position: "relative",
          "&:after": {
            position: "absolute",
            content: '" "',
            top: 0,
            left: 0,
            backgroundColor: "primary.main",
            width: 3,
            height: "calc(100% + 1px)",
          },
        }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Typography variant="h6">Basic details</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={product.name}
                    fullWidth
                    label="Product name"
                    name="name"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={product.sku}
                    disabled
                    fullWidth
                    label="SKU"
                    name="sku"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={product.category}
                    fullWidth
                    label="Category"
                    select
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={product.id}
                    disabled
                    fullWidth
                    label="Barcode"
                    name="barcode"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography variant="h6">Pricing and stocks</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={product.price}
                    fullWidth
                    label="Old price"
                    name="old-price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {product.currency}
                        </InputAdornment>
                      ),
                    }}
                    type="number"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={product.price}
                    fullWidth
                    label="New price"
                    name="new-price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    type="number"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Switch />
                  <Typography variant="subtitle2">
                    Keep selling when stock is empty
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <Button
              onClick={handleProductUpdate}
              type="submit"
              variant="contained"
            >
              Update
            </Button>
            <Button color="inherit" onClick={handleProductClose}>
              Cancel
            </Button>
          </Stack>
          <div>
            <Button onClick={handleProductDelete} color="error">
              Delete product
            </Button>
          </div>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
