export const getServerSideProps = async ({ res }) => {
    // Cấu hình file robots.txt
    const robotsTxt = `
      User-agent: *
      Disallow: /auth
      Disallow: /docs
      Disallow: /admin
      Disallow: /dashboard
      Disallow: /components
      Allow: /
      Sitemap: ${process.env.NEXT_PUBLIC_API_URL}/sitemap.xml
    `;

    // Đặt header cho nội dung trả về dạng text
    res.setHeader("Content-Type", "text/plain");
    res.write(robotsTxt);
    res.end();

    return {
        props: {},
    };
};

export default function Robots() {
    // Không cần render nội dung cho trang này, vì nó sẽ trả về nội dung của robots.txt
    return null;
}
