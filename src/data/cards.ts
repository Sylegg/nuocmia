import {
  type MainCategoryId,
  type StandeeVariantId,
  type SubCategoryId,
} from "./categories";

export interface GoodsProduct {
  id: string;
  slug: string;
  name: string;
  category: MainCategoryId;
  subcategory?: SubCategoryId;
  variant?: StandeeVariantId;
  image: string;
  artFocusY?: string;
  price?: number;
  description?: string;
  stock: number;
}

export interface CuratedCard {
  id: string;
  slug: string;
  name: string;
  code: string;
  badge: "BÁN CHẠY" | "THẺ HIẾM" | "GIỚI HẠN" | "ĐƯỢC YÊU THÍCH";
  badgeType: "best-seller" | "rare" | "limited" | "favorite";
  stars: number;
  element: string;
  world: "Fantasy" | "Anime";
  price: number;
  image: string;
  description: string;
  stock: number;
}

export function getGoodsShopCategory(card: GoodsProduct): string {
  switch (card.subcategory) {
    case "square-card": return "card-vuong";
    case "standee": return card.variant === "large" ? "standee-lon" : card.variant === "small" ? "standee-nho" : "standee";
    default: return card.subcategory ?? (card.category === "paper" ? "do-giay" : card.category === "plastic" ? "do-nhua" : "khac");
  }
}

export const CURATED_CARDS: CuratedCard[] = [
  {
    id: "kael-ho-ve-rung",
    slug: "kael-ho-ve-rung",
    name: "Kael — Hộ Vệ Rừng",
    code: "THE WILDWOOD · 001",
    badge: "BÁN CHẠY",
    badgeType: "best-seller",
    stars: 5,
    element: "Hệ Mộc · Fantasy Edition",
    world: "Fantasy",
    price: 189000,
    image: "/cards/ho-ve-co-lam.webp",
    description: "Thợ săn thần bí bảo hộ cánh rừng cổ sơ ngàn năm với cung tên ma thuật.",
    stock: 15,
  },
  {
    id: "eira-loi-thi-tham-bang",
    slug: "eira-loi-thi-tham-bang",
    name: "Eira — Lời Thì Thầm Băng",
    code: "FROSTBOUND · 002",
    badge: "THẺ HIẾM",
    badgeType: "rare",
    stars: 5,
    element: "Hệ Băng · Fantasy Edition",
    world: "Fantasy",
    price: 229000,
    image: "/cards/bang-nguyet.webp",
    description: "Nữ vương băng hà mang quyền năng điều khiển gió tuyết và ánh trăng hàn nguyệt.",
    stock: 8,
  },
  {
    id: "ronan-ky-si-hoa",
    slug: "ronan-ky-si-hoa",
    name: "Ronan — Kỵ Sĩ Hỏa",
    code: "EMBERFALL · 003",
    badge: "GIỚI HẠN",
    badgeType: "limited",
    stars: 4,
    element: "Hệ Hỏa · Fantasy Edition",
    world: "Fantasy",
    price: 179000,
    image: "/cards/hoa-an.webp",
    description: "Chiến binh mang kiếm lửa thiêng rực cháy, dẫn dắt đạo quân vượt qua tàn tích núi lửa.",
    stock: 10,
  },
  {
    id: "lyra-nguoi-det-trang",
    slug: "lyra-nguoi-det-trang",
    name: "Lyra — Người Dệt Trăng",
    code: "MOONWEAVE · 004",
    badge: "ĐƯỢC YÊU THÍCH",
    badgeType: "favorite",
    stars: 4,
    element: "Hệ Trăng · Fantasy Edition",
    world: "Fantasy",
    price: 199000,
    image: "/cards/da-hanh.webp",
    description: "Pháp sư dệt nên những sợi tơ ánh trăng để che chở linh hồn lữ khách trong đêm.",
    stock: 14,
  },
  {
    id: "boreas-linh-gac-bang",
    slug: "boreas-linh-gac-bang",
    name: "Boreas — Linh Gác Băng",
    code: "FROSTBOUND · 005",
    badge: "THẺ HIẾM",
    badgeType: "rare",
    stars: 5,
    element: "Hệ Băng · Fantasy Edition",
    world: "Fantasy",
    price: 219000,
    image: "/cards/linh-gac-bang.webp",
    description: "Thần thú hộ vệ miền cực bắc canh giữ vương miện băng cổ xưa.",
    stock: 9,
  },
  {
    id: "zephyr-ung-loi-than",
    slug: "zephyr-ung-loi-than",
    name: "Zephyr — Ưng Lôi Thần",
    code: "STORMCHASER · 006",
    badge: "THẺ HIẾM",
    badgeType: "rare",
    stars: 5,
    element: "Hệ Lôi · Anime Edition",
    world: "Anime",
    price: 219000,
    image: "/cards/ung-loi.webp",
    description: "Vị thần ưng sấm sét cai quản bầu trời bão táp với tốc độ xé toạc màn đêm.",
    stock: 9,
  },
  {
    id: "glacia-vong-xoay-bang",
    slug: "glacia-vong-xoay-bang",
    name: "Glacia — Vòng Xoáy Băng",
    code: "FROSTBOUND · 007",
    badge: "BÁN CHẠY",
    badgeType: "best-seller",
    stars: 5,
    element: "Hệ Băng · Anime Edition",
    world: "Anime",
    price: 189000,
    image: "/cards/vong-xoay-bang.webp",
    description: "Cơn lốc xoáy băng tinh thể phong ấn mọi vật chất vĩnh cửu trong hư không tuyệt đối.",
    stock: 12,
  },
  {
    id: "ignis-long-tan-hoa",
    slug: "ignis-long-tan-hoa",
    name: "Ignis — Long Tàn Hỏa",
    code: "EMBERFALL · 008",
    badge: "GIỚI HẠN",
    badgeType: "limited",
    stars: 4,
    element: "Hệ Hỏa · Anime Edition",
    world: "Anime",
    price: 199000,
    image: "/cards/long-tan-hoa.webp",
    description: "Hỏa diệm rồng thiêng bất diệt bùng cháy từ tro tàn cổ đại.",
    stock: 11,
  },
  {
    id: "selene-cong-nguyet-thuc",
    slug: "selene-cong-nguyet-thuc",
    name: "Selene — Cổng Nguyệt Thực",
    code: "MOONWEAVE · 009",
    badge: "ĐƯỢC YÊU THÍCH",
    badgeType: "favorite",
    stars: 5,
    element: "Hệ Trăng · Anime Edition",
    world: "Anime",
    price: 249000,
    image: "/cards/nguyet-thuc.webp",
    description: "Cánh cổng thần bí chỉ mở ra khi mặt trăng bị bóng tối che khuất hoàn toàn.",
    stock: 7,
  },
  {
    id: "astra-loi-giang",
    slug: "astra-loi-giang",
    name: "Astra — Lôi Giáng Cổ Đạo",
    code: "STORMCHASER · 010",
    badge: "GIỚI HẠN",
    badgeType: "limited",
    stars: 5,
    element: "Hệ Lôi · Anime Edition",
    world: "Anime",
    price: 239000,
    image: "/cards/loi-giang.webp",
    description: "Tia sét thần phạt giáng xuống từ tầng mây thiên thạch ngàn năm.",
    stock: 8,
  },
];

export const COLLECTIBLE_CARDS: GoodsProduct[] = [
  ...CURATED_CARDS.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    category: "paper" as const,
    subcategory: "postcard" as const,
    image: c.image,
    price: c.price,
    description: c.description,
    stock: c.stock,
  })),
  {
    id: "pola-bang-nguyet",
    slug: "pola-bang-nguyet",
    name: "Pola Băng Nguyệt",
    category: "paper",
    subcategory: "pola",
    image: "/cards/bang-nguyet.webp",
    artFocusY: "28%",
    price: 25000,
    description:
      "Ảnh phong cách Polaroid in trên giấy ảnh mờ, chừa viền trắng đặc trưng để viết lời nhắn hoặc trang trí sổ tay.",
    stock: 18,
  },
  {
    id: "pola-hoa-an",
    slug: "pola-hoa-an",
    name: "Pola Hỏa Ấn",
    category: "paper",
    subcategory: "pola",
    image: "/cards/hoa-an.webp",
    artFocusY: "32%",
    price: 25000,
    description:
      "Ảnh Pola in sắc nét minh họa Kỵ Sĩ Hỏa Ấn, phù hợp kẹp ốp lưng hoặc trưng bày trên bàn làm việc.",
    stock: 14,
  },
  {
    id: "pola-da-hanh",
    slug: "pola-da-hanh",
    name: "Pola Dạ Hành",
    category: "paper",
    subcategory: "pola",
    image: "/cards/da-hanh.webp",
    artFocusY: "32%",
    price: 25000,
    description:
      "Ảnh Pola tông tối huyền bí với viền trắng tối giản phong cách Polaroid sưu tầm.",
    stock: 12,
  },
  {
    id: "postcard-co-lam",
    slug: "postcard-co-lam",
    name: "Postcard Cổ Lâm",
    category: "paper",
    subcategory: "postcard",
    image: "/cards/ho-ve-co-lam.webp",
    artFocusY: "30%",
    price: 35000,
    description:
      "Bưu thiếp in trên giấy mỹ thuật dày dặn với mặt sau chừa khoảng trống ghi lời chúc.",
    stock: 15,
  },
  {
    id: "postcard-long-tan-hoa",
    slug: "postcard-long-tan-hoa",
    name: "Postcard Long Tàn Hỏa",
    category: "paper",
    subcategory: "postcard",
    image: "/cards/long-tan-hoa.webp",
    artFocusY: "36%",
    price: 39000,
    description:
      "Bưu thiếp minh họa Long Tàn Hỏa tông ấm rực rỡ, thích hợp làm quà tặng hoặc treo tường.",
    stock: 10,
  },
  {
    id: "postcard-nguyet-thuc",
    slug: "postcard-nguyet-thuc",
    name: "Postcard Nguyệt Thực",
    category: "paper",
    subcategory: "postcard",
    image: "/cards/nguyet-thuc.webp",
    artFocusY: "40%",
    price: 35000,
    description:
      "Ảnh in dạng postcard tái hiện khung cảnh Cổng Nguyệt Thực với độ tương phản sâu.",
    stock: 11,
  },
  {
    id: "square-card-thien-thach",
    slug: "square-card-thien-thach",
    name: "Card vuông Thiên Thạch",
    category: "paper",
    subcategory: "square-card",
    image: "/cards/thien-thach.webp",
    artFocusY: "42%",
    price: 29000,
    description:
      "Thẻ ảnh hình vuông cán mờ nhẹ, bo tròn góc tinh tế giúp hạn chế trầy xước khi cầm.",
    stock: 20,
  },
  {
    id: "square-card-thai-duong",
    slug: "square-card-thai-duong",
    name: "Card vuông Thái Dương",
    category: "paper",
    subcategory: "square-card",
    image: "/cards/khien-thai-duong.webp",
    artFocusY: "42%",
    price: 29000,
    description:
      "Thẻ ảnh vuông họa tiết Khiên Thái Dương với sắc vàng đồng nổi bật trên nền giấy mờ.",
    stock: 16,
  },
  {
    id: "square-card-mam-xanh",
    slug: "square-card-mam-xanh",
    name: "Card vuông Mầm Xanh",
    category: "paper",
    subcategory: "square-card",
    image: "/cards/tu-te-mam-xanh.webp",
    artFocusY: "30%",
    price: 29000,
    description:
      "Thẻ ảnh hình vuông gam màu xanh dịu nhẹ, thích hợp sưu tầm theo bộ hoặc trang trí góc học tập.",
    stock: 19,
  },
  {
    id: "key-da-hanh",
    slug: "key-da-hanh",
    name: "Key Dạ Hành",
    category: "plastic",
    subcategory: "key",
    image: "/cards/da-hanh.webp",
    artFocusY: "32%",
    price: 59000,
    description:
      "Móc khóa nhựa acrylic trong suốt hai lớp, kèm khoen kim loại chắc chắn cho balo và chìa khóa.",
    stock: 12,
  },
  {
    id: "key-bang-vuc",
    slug: "key-bang-vuc",
    name: "Key Băng Vực",
    category: "plastic",
    subcategory: "key",
    image: "/cards/linh-gac-bang.webp",
    artFocusY: "34%",
    price: 59000,
    description:
      "Móc khóa nhựa in hai mặt chống trầy, sắc xanh băng mát mắt.",
    stock: 14,
  },
  {
    id: "key-vong-xoay-bang",
    slug: "key-vong-xoay-bang",
    name: "Key Vòng Xoáy Băng",
    category: "plastic",
    subcategory: "key",
    image: "/cards/vong-xoay-bang.webp",
    artFocusY: "45%",
    price: 59000,
    description:
      "Móc khóa nhựa acrylic gọn nhẹ, viền cắt laser mịn tay.",
    stock: 15,
  },
  {
    id: "standee-hoa-an-lon",
    slug: "standee-hoa-an-lon",
    name: "Standee Hỏa Ấn Lớn",
    category: "plastic",
    subcategory: "standee",
    variant: "large",
    image: "/cards/hoa-an.webp",
    artFocusY: "32%",
    price: 129000,
    description:
      "Standee nhựa acrylic bản Lớn có đế tháo rời chắc chắn, nổi bật khi trưng bày trên bàn hoặc kệ sách.",
    stock: 7,
  },
  {
    id: "standee-loi-giang-lon",
    slug: "standee-loi-giang-lon",
    name: "Standee Lôi Giáng Lớn",
    category: "plastic",
    subcategory: "standee",
    variant: "large",
    image: "/cards/loi-giang.webp",
    artFocusY: "42%",
    price: 135000,
    description:
      "Standee nhựa phiên bản Lớn với chi tiết tia sét sắc nét và chân đế trong suốt.",
    stock: 6,
  },
  {
    id: "standee-sam-vang-nho",
    slug: "standee-sam-vang-nho",
    name: "Standee Sấm Vàng Nhỏ",
    category: "plastic",
    subcategory: "standee",
    variant: "small",
    image: "/cards/ung-loi.webp",
    artFocusY: "38%",
    price: 69000,
    description:
      "Standee nhựa bản Nhỏ gọn gàng kèm đế acrylic rời, dễ dàng đặt cạnh màn hình hoặc góc bàn.",
    stock: 10,
  },
  {
    id: "standee-linh-duoc-nho",
    slug: "standee-linh-duoc-nho",
    name: "Standee Linh Dược Nhỏ",
    category: "plastic",
    subcategory: "standee",
    variant: "small",
    image: "/cards/linh-duoc.webp",
    artFocusY: "44%",
    price: 69000,
    description:
      "Standee nhựa bản Nhỏ thiết kế thanh thoát, phù hợp sưu tầm theo cặp.",
    stock: 13,
  },
  {
    id: "other-hop-hac-tinh",
    slug: "other-hop-hac-tinh",
    name: "Hộp Đựng Goods Hắc Tinh",
    category: "other",
    image: "/cards/hop-hac-tinh.webp",
    artFocusY: "46%",
    price: 189000,
    description:
      "Hộp nắp nam châm lót vải mềm giúp bảo quản bộ sưu tập Pola, Postcard và Card vuông gọn gàng.",
    stock: 5,
  },
  {
    id: "other-boc-tinh-van",
    slug: "other-boc-tinh-van",
    name: "Túi Bọc Bảo Quản Tinh Vân",
    category: "other",
    image: "/cards/boc-tinh-van.webp",
    artFocusY: "46%",
    price: 75000,
    description:
      "Túi bọc bảo quản trong suốt chống bụi và chống ẩm cho sản phẩm giấy sưu tầm.",
    stock: 14,
  },
];
