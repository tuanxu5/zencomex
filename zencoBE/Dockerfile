# Sử dụng image Node.js chính thức từ Docker Hub
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt các phụ thuộc của ứng dụng bằng npm
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chạy ứng dụng backend khi container khởi động
CMD ["npm", "start"]