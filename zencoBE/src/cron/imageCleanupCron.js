import cron from "node-cron";
import db from "../models";
import cloudinary from "cloudinary";
import { Op } from "sequelize";

cloudinary.config({
    cloud_name: process.env.APP_CLOUDINARY_NAME,
    api_key: process.env.APP_CLOUDINARY_API_KEY,
    api_secret: process.env.APP_CLOUDINARY_SECRET,
});

const handleCronTask = async () => {
    console.log("Running a task every day at midnight");
    try {
        const images = await db.table_photo.findAll({
            where: {
                isdelete: true,
                deleted_at: {
                    [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Xóa ảnh đã bị đánh dấu quá 1 ngày
                },
            },
        });

        if (images.length > 0) {
            const links = images.map((photo) => photo.link);
            const id_vitri = images.map((photo) => photo.id_vitri);
            // tim tat ca cac anh co link trong bang photo
            const allImages = await db.table_photo.findAll({
                where: {
                    link: {
                        [Op.in]: links,
                    },
                },
            });
            // nhom cac anh theo link
            const imagesGroupedByLink = allImages.reduce((acc, image) => {
                if (!acc[image.link]) {
                    acc[image.link] = [];
                }
                acc[image.link].push(image);
                return acc;
            }, {});

            const publicIdsToDelete = [];

            if (allImages.length === 1) {
                publicIdsToDelete.push(...allImages.map((image) => image.thumb_vi));
            } else {
                for (const link of links) {
                    const imagesForLink = imagesGroupedByLink[link];
                    const imagesAtLocationForLink = images.filter((image) => image.link === link);

                    // Kiểm tra nếu tất cả các bản sao của ảnh có link đó đều thuộc về id_vitri hiện tại
                    const shouldDelete = imagesForLink.length === imagesAtLocationForLink.length;

                    if (shouldDelete) {
                        publicIdsToDelete.push(...imagesAtLocationForLink.map((image) => image.thumb_vi));
                    }
                }
            }
            if (publicIdsToDelete && publicIdsToDelete.length > 0) {
                await cloudinary.v2.api.delete_resources(publicIdsToDelete);
            }
            await db.table_photo.destroy({
                where: {
                    link: {
                        [Op.in]: links,
                    },
                    id_vitri: id_vitri,
                },
            });
        }
    } catch (error) {
        console.log("error", error);
    }
};

const task = cron.schedule("0 0 * * *", handleCronTask);
handleCronTask();
task.start();

export default task;
