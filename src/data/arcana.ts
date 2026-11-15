export const categories = {
  "nhan-vat": { name: "Thẻ nhân vật", icon: "swords", color: "#d69864" },
  "hanh-dong": { name: "Thẻ hành động", icon: "bolt", color: "#d8b668" },
  "ho-tro": { name: "Thẻ hỗ trợ", icon: "shield", color: "#81b9a0" },
  "phu-kien": { name: "Phụ kiện", icon: "box", color: "#a6a1d1" },
} as const;

export const elements = {
  hoa: { name: "Hỏa", icon: "flame", color: "#ed9065" },
  bang: { name: "Băng", icon: "snow", color: "#8cc8ef" },
  moc: { name: "Mộc", icon: "leaf", color: "#97c98b" },
  bong: { name: "Bóng", icon: "moon", color: "#be9ded" },
  loi: { name: "Lôi", icon: "bolt", color: "#e6c875" },
  quang: { name: "Quang", icon: "sun", color: "#f0ce8f" },
  "trung-tinh": { name: "Trung tính", icon: "diamond", color: "#b1b8cc" },
} as const;

export const rarities = {
  "huyen-thoai": { name: "Huyền thoại", color: "#efbf78" },
  "su-thi": { name: "Sử thi", color: "#c1a3ec" },
  hiem: { name: "Hiếm", color: "#91bbdc" },
  thuong: { name: "Thường", color: "#b4b8c2" },
} as const;

export const collections = {
  "khoi-nguyen": { name: "Khởi Nguyên", code: "KN" },
  "nguyet-anh": { name: "Nguyệt Ảnh", code: "NA" },
  "co-lam": { name: "Cổ Lâm", code: "CL" },
  "hanh-trang": { name: "Hành Trang", code: "HT" },
} as const;

export type Category = keyof typeof categories;
export type Element = keyof typeof elements;
export type Rarity = keyof typeof rarities;
export type Collection = keyof typeof collections;
export type Edition = "Standard" | "Foil";
export type Condition = "Như mới" | "Rất tốt";

export type Offer = {
  sku: string;
  edition: Edition;
  condition: Condition;
  price: number;
  stock: number;
};

type Skill = { name: string; description: string; damage?: number };
type Character = { category: "nhan-vat"; hp: number; skills: Skill[] };
type Spell = { category: "hanh-dong" | "ho-tro"; cost: number; effect: string };
type Accessory = { category: "phu-kien"; material: string; size: string; pack: string };

type ProductInfo = {
  id: string;
  code: string;
  name: string;
  collection: Collection;
  element: Element;
  rarity: Rarity;
  description: string;
  art: string;
  shopCategory?: "pola" | "postcard" | "card-vuong" | "key" | "standee-lon" | "standee-nho";
};

export type ProductFace = ProductInfo & (Character | Spell | Accessory);
export type Product = ProductFace & { offers: Offer[] };
type ProductSeed = Omit<ProductInfo, "art"> & (Character | Spell | Accessory) & { art?: string };
type OfferSeed = [Edition, number, number, Condition?];

function product(seed: ProductSeed, offers: OfferSeed[]): Product {
  return {
    ...seed,
    art: seed.art ?? `/cards/${seed.id}.webp`,
    offers: offers.map(([edition, price, stock, condition = "Như mới"]) => ({
      edition,
      price,
      stock,
      condition,
      sku: `${seed.code}-${edition === "Foil" ? "FL" : "ST"}${condition === "Rất tốt" ? "-RT" : ""}`,
    })),
  };
}

// Các sản phẩm được xếp theo thứ tự phát hành, mới nhất ở trên.
const collectibles: Product[] = [
  product({
    id: "hoa-an", code: "KN-001", name: "Kỵ Sĩ Hỏa Ấn", category: "nhan-vat",
    collection: "khoi-nguyen", element: "hoa", rarity: "huyen-thoai", hp: 120,
    description: "Người canh giữ lò rèn cuối cùng của Khởi Nguyên. Mỗi lần rút kiếm, dấu ấn trên giáp lại cháy sáng.",
    skills: [
      { name: "Kiếm Tàn Hỏa", damage: 40, description: "Gây 40 sát thương lên một nhân vật đối phương." },
      { name: "Ấn Phượng Hoàng", damage: 70, description: "Gây 70 sát thương. Nếu HP còn dưới một nửa, hồi thêm 20 HP." },
    ],
  }, [["Standard", 99000, 12], ["Standard", 79000, 4, "Rất tốt"], ["Foil", 129000, 3]]),
  product({
    id: "bang-nguyet", code: "NA-002", name: "Pháp Sư Băng Nguyệt", category: "nhan-vat",
    collection: "nguyet-anh", element: "bang", rarity: "su-thi", hp: 100,
    description: "Dưới ánh trăng xanh, pháp sư của thành Bạch Nguyệt có thể gọi sương giá từ mặt hồ phẳng lặng.",
    skills: [
      { name: "Tinh Thể Nguyệt", damage: 30, description: "Gây 30 sát thương và giảm 10 sát thương nhận ở lượt kế tiếp." },
      { name: "Băng Kết", damage: 60, description: "Gây 60 sát thương. Đối phương bỏ qua lần hồi HP tiếp theo." },
    ],
  }, [["Standard", 89000, 8], ["Foil", 119000, 0]]),
  product({
    id: "ho-ve-co-lam", code: "CL-003", name: "Hộ Vệ Cổ Lâm", category: "nhan-vat",
    collection: "co-lam", element: "moc", rarity: "hiem", hp: 110,
    description: "Dấu chân của người gác rừng biến thành những mầm cây nhỏ trên đường tuần tra.",
    skills: [
      { name: "Mũi Tên Gai", damage: 35, description: "Gây 35 sát thương lên một nhân vật đối phương." },
      { name: "Lời Thề Cổ Thụ", description: "Hồi 30 HP cho một nhân vật đồng minh." },
    ],
  }, [["Standard", 69000, 10], ["Foil", 99000, 2]]),
  product({
    id: "da-hanh", code: "NA-004", name: "Sát Thủ Dạ Hành", category: "nhan-vat",
    collection: "nguyet-anh", element: "bong", rarity: "su-thi", hp: 90,
    description: "Khi đèn đường tắt, chỉ còn bóng chiếc áo choàng của Dạ Hành lướt qua những mái nhà.",
    skills: [
      { name: "Lưỡi Dao Bóng", damage: 45, description: "Gây 45 sát thương lên mục tiêu có ít HP nhất." },
      { name: "Ẩn Thân", description: "Bỏ qua sát thương từ đòn tấn công tiếp theo." },
    ],
  }, [["Standard", 85000, 7]]),
  product({
    id: "ung-loi", code: "KN-005", name: "Ưng Sấm Vàng", category: "nhan-vat",
    collection: "khoi-nguyen", element: "loi", rarity: "hiem", hp: 80,
    description: "Loài ưng làm tổ trên đỉnh tháp cổ, nơi sấm chớp không bao giờ tắt.",
    skills: [
      { name: "Cánh Chớp", damage: 25, description: "Gây 25 sát thương. Rút một thẻ hành động." },
      { name: "Sấm Rền", damage: 50, description: "Gây 50 sát thương lên một nhân vật đối phương." },
    ],
  }, [["Standard", 65000, 9]]),
  product({
    id: "long-tan-hoa", code: "KN-006", name: "Long Tàn Hỏa", category: "nhan-vat",
    collection: "khoi-nguyen", element: "hoa", rarity: "huyen-thoai", hp: 160,
    description: "Con rồng cuối cùng ngủ trong lòng núi lửa. Hơi thở của nó giữ than hồng cháy suốt cả mùa đông.",
    skills: [
      { name: "Vảy Hắc Diệm", description: "Giảm 20 sát thương nhận trong lượt này." },
      { name: "Hơi Thở Tàn Tro", damage: 90, description: "Gây 90 sát thương lên một nhân vật đối phương." },
    ],
  }, [["Standard", 149000, 0], ["Foil", 199000, 0]]),
  product({
    id: "tu-te-mam-xanh", code: "CL-007", name: "Tư Tế Mầm Xanh", category: "nhan-vat",
    collection: "co-lam", element: "moc", rarity: "thuong", hp: 75,
    description: "Ngọn đèn của tư tế được nuôi bằng ánh sáng lọc qua tán rừng vào buổi sớm.",
    skills: [
      { name: "Đèn Mầm Sống", description: "Hồi 25 HP cho một nhân vật đồng minh." },
      { name: "Chồi Gai", damage: 20, description: "Gây 20 sát thương lên một nhân vật đối phương." },
    ],
  }, [["Standard", 49000, 16]]),
  product({
    id: "linh-gac-bang", code: "NA-008", name: "Lính Gác Băng Vực", category: "nhan-vat",
    collection: "nguyet-anh", element: "bang", rarity: "thuong", hp: 105,
    description: "Lớp giáp băng dày thêm sau mỗi đêm đứng gác nơi cổng thành lạnh nhất.",
    skills: [
      { name: "Giáo Hàn", damage: 25, description: "Gây 25 sát thương lên một nhân vật đối phương." },
      { name: "Thành Lũy Băng", description: "Giảm 20 sát thương nhận ở lượt kế tiếp." },
    ],
  }, [["Standard", 45000, 13]]),
  product({
    id: "thien-thach", code: "KN-009", name: "Thiên Thạch Đỏ", category: "hanh-dong",
    collection: "khoi-nguyen", element: "hoa", rarity: "hiem", cost: 3,
    description: "Đốm sáng đỏ xuất hiện trên bầu trời là lời báo trước cho một trận mưa đá lửa.",
    effect: "Gây 50 sát thương lên một nhân vật đối phương và 10 sát thương lên mỗi nhân vật dự bị của họ.",
  }, [["Standard", 59000, 11]]),
  product({
    id: "vong-xoay-bang", code: "NA-010", name: "Vòng Xoáy Băng", category: "hanh-dong",
    collection: "nguyet-anh", element: "bang", rarity: "thuong", cost: 2,
    description: "Một cơn gió cuộn qua mặt hồ, cuốn theo hàng nghìn mảnh băng nhỏ.",
    effect: "Gây 25 sát thương và giảm 15 sát thương từ đòn đánh tiếp theo của mục tiêu.",
  }, [["Standard", 39000, 14]]),
  product({
    id: "loi-giang", code: "KN-011", name: "Lôi Giáng", category: "hanh-dong",
    collection: "khoi-nguyen", element: "loi", rarity: "su-thi", cost: 4,
    description: "Trụ đá trên đỉnh Tháp Vàng dẫn tia sét đầu tiên của mùa mưa xuống chiến trường.",
    effect: "Gây 65 sát thương. Nếu bạn có nhân vật hệ Lôi trên bàn, rút thêm một thẻ.",
  }, [["Standard", 79000, 6], ["Foil", 109000, 2]]),
  product({
    id: "nguyet-thuc", code: "NA-012", name: "Cổng Nguyệt Thực", category: "hanh-dong",
    collection: "nguyet-anh", element: "bong", rarity: "hiem", cost: 3,
    description: "Chỉ trong vài nhịp thở lúc nguyệt thực, cầu thang cổ mới dẫn đến cánh cổng này.",
    effect: "Đổi nhân vật đang giao chiến của đối phương với một nhân vật dự bị do họ chọn.",
  }, [["Standard", 55000, 8]]),
  product({
    id: "khien-thai-duong", code: "KN-013", name: "Khiên Thái Dương", category: "ho-tro",
    collection: "khoi-nguyen", element: "quang", rarity: "hiem", cost: 2,
    description: "Ấn mặt trời trên khiên giữ lại chút ấm áp của bình minh.",
    effect: "Gắn lên một nhân vật đồng minh. Giảm 25 sát thương từ đòn đánh đầu tiên họ nhận.",
  }, [["Standard", 55000, 12]]),
  product({
    id: "linh-duoc", code: "CL-014", name: "Linh Dược Cổ Lâm", category: "ho-tro",
    collection: "co-lam", element: "moc", rarity: "thuong", cost: 1,
    description: "Giọt sương chắt từ lá cây trăm tuổi phát sáng trong lọ pha lê.",
    effect: "Hồi 30 HP và giải một hiệu ứng bất lợi cho một nhân vật đồng minh.",
  }, [["Standard", 35000, 18]]),
  product({
    id: "hop-hac-tinh", code: "HT-015", name: "Hộp Bài Hắc Tinh", category: "phu-kien",
    collection: "hanh-trang", element: "trung-tinh", rarity: "thuong",
    description: "Hộp nắp nam châm bọc da tổng hợp, có biểu tượng la bàn Arcana ép đồng.",
    material: "Da PU, lót microfiber", size: "82 × 80 × 104 mm", pack: "1 hộp, chứa tối đa 80 thẻ bọc",
  }, [["Standard", 189000, 5]]),
  product({
    id: "boc-tinh-van", code: "HT-016", name: "Bọc Thẻ Tinh Vân", category: "phu-kien",
    collection: "hanh-trang", element: "trung-tinh", rarity: "thuong",
    description: "Bọc thẻ trong suốt ở mặt trước, mặt sau xanh tím lì với họa tiết viền đồng.",
    material: "Polypropylene", size: "66 × 91 mm", pack: "60 bọc thẻ",
  }, [["Standard", 75000, 14]]),
];

type MerchSeed = Pick<Accessory, "size" | "material"> & Pick<ProductInfo, "id" | "name" | "code" | "description"> & {
  shopCategory: NonNullable<ProductInfo["shopCategory"]>;
  artwork: Product;
  price: number;
  stock: number;
};

function merchandise({ artwork, price, stock, ...seed }: MerchSeed): Product {
  return product({
    ...seed, category: "phu-kien", pack: "1 món", rarity: "thuong",
    collection: artwork.collection, element: artwork.element, art: artwork.art,
  }, [["Standard", price, stock]]);
}

const [knight, mage, guardian, assassin, eagle] = collectibles;
const merchandiseItems = [
  merchandise({ id: "pola-bang-nguyet", code: "DG-001", name: "Pola Băng Nguyệt", shopCategory: "pola",
    artwork: mage, material: "Giấy ảnh mờ", size: "54 × 86 mm", price: 25000, stock: 18,
    description: "Ảnh Pola Băng Nguyệt in mờ, chừa viền trắng để ghi lời nhắn." }),
  merchandise({ id: "postcard-co-lam", code: "DG-002", name: "Postcard Cổ Lâm", shopCategory: "postcard",
    artwork: guardian, material: "Giấy mỹ thuật 300 gsm", size: "100 × 150 mm", price: 35000, stock: 15,
    description: "Bưu thiếp minh họa Hộ Vệ Cổ Lâm, với mặt sau để viết lời nhắn." }),
  merchandise({ id: "card-vuong-hoa-an", code: "DG-003", name: "Card vuông Hỏa Ấn", shopCategory: "card-vuong",
    artwork: knight, material: "Giấy couche cán mờ", size: "70 × 70 mm", price: 29000, stock: 20,
    description: "Bản in vuông minh họa Kỵ Sĩ Hỏa Ấn, cán mờ và bo nhẹ các góc." }),
  merchandise({ id: "key-da-hanh", code: "DN-001", name: "Key Dạ Hành", shopCategory: "key",
    artwork: assassin, material: "Acrylic và khoen kim loại", size: "50 mm, chưa tính khoen", price: 59000, stock: 12,
    description: "Móc khóa acrylic minh họa Dạ Hành, dùng cho balô hoặc chùm chìa khóa." }),
  merchandise({ id: "standee-hoa-an-lon", code: "DN-002", name: "Standee Hỏa Ấn Lớn", shopCategory: "standee-lon",
    artwork: knight, material: "Acrylic trong và đế rời", size: "Cao 150 mm", price: 129000, stock: 7,
    description: "Standee Hỏa Ấn bản lớn, có đế tháo rời để trưng trên bàn hoặc kệ." }),
  merchandise({ id: "standee-sam-vang-nho", code: "DN-003", name: "Standee Sấm Vàng Nhỏ", shopCategory: "standee-nho",
    artwork: eagle, material: "Acrylic trong và đế rời", size: "Cao 75 mm", price: 69000, stock: 10,
    description: "Standee Ưng Sấm Vàng bản nhỏ, có đế acrylic để đặt cạnh bộ bài." }),
];

export const products = [...merchandiseItems, ...collectibles];

export const productsById = new Map(products.map((item) => [item.id, item]));
export const offersBySku = new Map(
  products.flatMap((item) => item.offers.map((offer) => [offer.sku, { product: item, offer }] as const)),
);

export const featuredIds = ["hoa-an", "long-tan-hoa", "loi-giang", "hop-hac-tinh"];
export const showcaseIds = [
  "thien-thach", "ung-loi", "da-hanh", "bang-nguyet", "hoa-an",
  "ho-ve-co-lam", "khien-thai-duong", "nguyet-thuc", "linh-gac-bang",
];
