import { Container } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";
import TiptapEditor from "../../components/tiptap/tiptapEditor";

const HomeIntroduction = () => {
    const { overviewInfo } = useSelector((state) => state.information);
    const [data, setData] = useState(() => {
        if (!!overviewInfo && Object.keys(overviewInfo).length > 0) {
            const intro = overviewInfo?.intro;
            return intro;
        } else return "";
    });

    return (
        <Container maxWidth="xl">
            {!!data && data !== "" && (
                <Box>
                    <TiptapEditor contentEditor={data?.noidung_vi || ""} isDisable={true} />
                </Box>
            )}
        </Container>
    );
};
export default HomeIntroduction;
