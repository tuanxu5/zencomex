import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import { styled } from "@mui/material/styles";

export const Scrollbar = styled(SimpleBar)`
    .simplebar-scrollbar {
        opacity: 1 !important; /* Luôn hiển thị thanh cuộn */
        width: 10px;
    }

    .simplebar-track.simplebar-vertical {
        visibility: visible;
    }
`;
