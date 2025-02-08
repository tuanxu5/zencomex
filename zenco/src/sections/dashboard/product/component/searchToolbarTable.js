import { Divider, Input, Stack, SvgIcon } from "@mui/material";
//icon
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
export const SearchToolbarTable = ({ searchValue, onchangeSearchValue }) => {
  return (
    <>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <SearchMdIcon />
        </SvgIcon>
        <Input
          disableUnderline
          fullWidth
          // inputProps={{ ref: queryRef }}
          placeholder="Tìm sản phẩm"
          sx={{ flexGrow: 1 }}
          value={searchValue}
          onChange={(e) => {
            onchangeSearchValue(e.target.value);
          }}
        />
      </Stack>
      <Divider />
    </>
  );
};
