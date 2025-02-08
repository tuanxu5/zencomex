export const formatTimeDMY = (time) => {
    const date = new Date(time * 1000); // Chuyển đổi giây thành mili giây

    // Lấy ngày, tháng, năm, giờ, phút từ đối tượng Date
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    // Định dạng ngày tháng năm giờ phút theo định dạng DD/MM/YYYY HH:mm
    const formattedDateTime = `${hours}:${minutes} ${day}/${month}/${year}`;
    return formattedDateTime;
};
