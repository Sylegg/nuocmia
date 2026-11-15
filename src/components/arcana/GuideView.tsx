import { catalogHref } from "@/lib/arcana-catalog";
import { Breadcrumbs, guideLinks } from "./ShopChrome";
import { Icon } from "./ShopUI";

const policies: Record<keyof typeof guideLinks, { title: string; body: string }[]> = {
  "mua-hang": [
    { title: "Tìm và chọn thẻ", body: "Tìm theo tên, mã thẻ hoặc bộ sưu tập. Trên trang chi tiết, chọn phiên bản, tình trạng và số lượng còn kho." },
    { title: "Đặt hàng", body: "Thêm thẻ vào giỏ hoặc chọn Mua ngay. Điền thông tin người nhận giả lập, chọn cách giao và kiểm tra tổng tiền trước khi xác nhận." },
    { title: "Theo dõi đơn", body: "Lưu mã đơn và dùng mã đó cùng số điện thoại khi đặt để tra cứu trạng thái." },
  ],
  "giao-hang": [
    { title: "Giao tiêu chuẩn", body: "Phí 30.000 ₫. Đơn được miễn phí giao tiêu chuẩn khi tiền hàng sau ưu đãi đạt 500.000 ₫." },
    { title: "Giao nhanh", body: "Phí 50.000 ₫. Bạn có thể chuyển sang giao nhanh tại trang thanh toán." },
    { title: "Đóng gói", body: "Ví dụ đóng gói của Arcana gồm bọc thẻ, tấm đỡ chống cong và bao thư có đệm." },
  ],
  "doi-tra": [
    { title: "Hủy trước khi xác nhận", body: "Mở trang Tra cứu đơn, nhập mã đơn và số điện thoại. Đơn Chờ xác nhận có nút Hủy đơn." },
    { title: "Ví dụ yêu cầu đổi trả", body: "Khi nhận sai phiên bản hoặc thẻ bị hư hỏng, giữ bao bì và chuẩn bị ảnh mặt trước, mặt sau cùng mã đơn để cửa hàng đối chiếu." },
  ],
  "cau-hoi": [
    { title: "Foil khác Standard thế nào?", body: "Foil có lớp phản quang tạo hiệu ứng đổi màu dưới ánh sáng. Mỗi phiên bản có giá và tồn kho riêng." },
    { title: "Mã CARD10 giảm bao nhiêu?", body: "CARD10 giảm 10% tiền hàng, tối đa 50.000 ₫. Nhập mã ở giỏ hàng trước khi thanh toán." },
    { title: "Tìm lại đơn hàng bằng cách nào?", body: "Mở Tra cứu đơn và nhập mã đơn cùng số điện thoại bạn đã dùng. Dữ liệu demo được lưu trên trình duyệt đã đặt đơn." },
    { title: "Thanh toán mô phỏng hoạt động thế nào?", body: "Ở trang thanh toán, chọn Thanh toán mô phỏng rồi chọn Thành công hoặc Thất bại. Bạn có thể đổi kết quả và thử lại với thông tin đã điền." },
  ],
};

export function GuideView({ id }: { id: keyof typeof guideLinks }) {
  return (
    <div className="shop-width inner-page guide-page">
      <Breadcrumbs items={[{ label: guideLinks[id] }]} />
      <div className="page-heading"><h1>{guideLinks[id]}</h1><p>Thông tin minh họa của Arcana Card Shop.</p></div>
      <div className="shop-panel guide-panel">
        {policies[id].map((item) => <details key={item.title} open={id === "cau-hoi" ? undefined : true}>
          <summary>{item.title}<Icon name="down" size={17} /></summary><p>{item.body}</p>
        </details>)}
      </div>
      <a className="button button-secondary" href={catalogHref()}><Icon name="back" size={17} /> Quay lại danh mục</a>
    </div>
  );
}
