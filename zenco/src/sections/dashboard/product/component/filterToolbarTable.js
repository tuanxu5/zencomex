import { Autocomplete, Divider, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const countries = [
    { code: "AD", label: "Andorra", phone: "376" },
    { code: "AE", label: "United Arab Emirates", phone: "971" },
];

export const FilterToolbarTable = ({
    categoryList,
    childCategoryList,
    categorySelected,
    childCategorySelected,
    onChangeCategory,
    onChangeChildCategory,
}) => {
    return (
        <>
            <Stack direction="row">
                <Box display="flex" alignItems="center" p={2}>
                    <Typography fontWeight={600}>Bộ Lọc</Typography>
                </Box>
                <Autocomplete
                    sx={{ width: 250, m: 1 }}
                    options={categoryList}
                    autoHighlight
                    value={categorySelected}
                    onChange={(event, newValue) => onChangeCategory(newValue)}
                    getOptionLabel={(option) => option.ten_vi}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <Box
                                key={key}
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 }, p: 0 }}
                                {...optionProps}
                            >
                                {option.ten_vi}
                            </Box>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label="Danh mục cấp 1" />}
                />
                <Autocomplete
                    key="FilterTwo"
                    sx={{ width: 250, m: 1 }}
                    options={childCategoryList}
                    autoHighlight
                    value={childCategorySelected}
                    onChange={(event, newValue) => onChangeChildCategory(newValue)}
                    getOptionLabel={(option) => option.ten_vi}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <Box
                                key={key}
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 }, p: 0 }}
                                {...optionProps}
                            >
                                {option.ten_vi}
                            </Box>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label="Danh mục cấp 2" />}
                />
            </Stack>
            <Divider />
        </>
    );
};
