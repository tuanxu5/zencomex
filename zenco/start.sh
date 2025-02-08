#!/bin/bash

# Di chuyển vào thư mục ứng dụng
cd /home/tranthanhloc/zencomex-newver/zenco

# Tải các biến môi trường từ tệp .env
export $(grep -v '^#' .env | xargs)

# Khởi động ứng dụng
npm start
