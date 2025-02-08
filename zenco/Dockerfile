# Sử dụng image Node.js chính thức từ Docker Hub
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và yarn.lock vào container
COPY package.json yarn.lock ./

# Cài đặt các phụ thuộc của ứng dụng bằng yarn
RUN yarn install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Next.js
RUN yarn build

EXPOSE 3000

# Chạy ứng dụng frontend khi container khởi động
CMD ["yarn", "start"]
