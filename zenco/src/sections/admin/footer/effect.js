import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { Box } from "@mui/system";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";

const menuEffect = [
    {
        id: 1,
        value: "none",
        label: "Không có hiệu ứng",
    },
    {
        id: 2,
        value: "christmas",
        label: "Hiệu ứng Giáng sinh",
    },
    {
        id: 3,
        value: "lunar",
        label: "Hiệu ứng Tết Nguyên Đán",
    },
];

const HomeEffect = () => {
    const [effectSelected, setEffectSelected] = useState({});
    const handleChangeEffect = async (value) => {
        const data = { noidung_vi: value };
        await axiosInstance.put(`/footer/update/${effectSelected.id}`, data);
        getEffectNow();
    };

    const getEffectNow = async () => {
        const res = await axiosInstance.get("/footer?type=effect");
        if (res && res.data.DT) {
            const effectNow = res.data.DT[0];
            setEffectSelected(effectNow);
        } else {
            const data = {
                type: "effect",
                ten_vi: "hiệu ứng website",
                tenkhongdau: "hieu-ung-website",
                noidung_vi: "none",
            };
            await axiosInstance.post("/footer/create", { data });
            getEffectNow();
        }
    };
    useEffect(() => {
        getEffectNow();
    }, []);
    return (
        <Box>
            <h2>Hiệu ứng hiện tại:</h2>
            <FormGroup>
                {menuEffect.map((i) => (
                    <FormControlLabel
                        key={i.id}
                        control={
                            <Switch
                                checked={effectSelected.noidung_vi === i.value ? true : false}
                                onChange={() => handleChangeEffect(i.value)}
                            />
                        }
                        value={i.value}
                        label={i.label}
                    />
                ))}
            </FormGroup>
        </Box>
    );
};

export default HomeEffect;
