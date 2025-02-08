// components/LazyLoad.js
import React from "react";
import { useInView } from "react-intersection-observer";

const LazyLoad = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Tải chỉ một lần khi phần tử xuất hiện
        threshold: 0.1, // 10% của phần tử xuất hiện trong viewport để kích hoạt
    });

    return <div ref={ref}>{inView ? children : null}</div>;
};

export default LazyLoad;
