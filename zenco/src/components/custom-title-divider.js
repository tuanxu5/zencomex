import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";

const TitleWithDivider = ({ title, sx }) => {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: "20px !important",
                    fontWeight: 700,
                    position: "relative",
                    display: "inline-block",

                    "&:after": {
                        content: '""', // Tạo một phần tử giả để thêm đường line
                        position: "absolute",
                        left: 0,
                        bottom: 0, // Điều chỉnh khoảng cách từ chữ xuống đường gạch chân
                        width: "100%", // Đường line sẽ có chiều dài bằng đoạn chữ
                        height: "1px", // Độ dày của đường gạch chân
                        backgroundColor: "#0099FF", // Màu của đường gạch chân
                    },
                    ...sx,
                }}
                variant="h2"
            >
                {title}
            </Typography>
            <Divider
                sx={{
                    borderColor: "#0099FF", // Màu border
                    mt: 0.5,
                    width: "100%",
                }}
            />
        </Box>
    );
};
export default TitleWithDivider;
