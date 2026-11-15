export type ShopCategory = { id: string; name: string; children?: readonly ShopCategory[] };

export const shopGroups = [
  {
    id: "do-giay", name: "Đồ giấy", icon: "card", color: "#d69864",
    children: [
      { id: "pola", name: "Pola" },
      { id: "postcard", name: "Postcard" },
      { id: "card-vuong", name: "Card vuông" },
    ],
  },
  {
    id: "do-nhua", name: "Đồ nhựa", icon: "diamond", color: "#81b9a0",
    children: [
      { id: "key", name: "Key" },
      { id: "standee", name: "Standee", children: [
        { id: "standee-lon", name: "Lớn" },
        { id: "standee-nho", name: "Nhỏ" },
      ] },
    ],
  },
  { id: "khac", name: "Khác", icon: "box", color: "#a6a1d1", children: [] },
] as const;

export const categoryPaths = new Map<string, ShopCategory[]>();

function indexCategories(nodes: readonly ShopCategory[], parents: ShopCategory[]) {
  for (const node of nodes) {
    const path = [...parents, node];
    categoryPaths.set(node.id, path);
    if (node.children) indexCategories(node.children, path);
  }
}

indexCategories(shopGroups, []);

export function categoryLabel(id: string, includeGroup = false) {
  const path = categoryPaths.get(id) ?? [];
  return (includeGroup || path.length === 1 ? path : path.slice(1)).map(({ name }) => name).join(" › ");
}

export function inShopCategory(productCategory: string | undefined, selected: string) {
  return categoryPaths.get(productCategory ?? "khac")?.some(({ id }) => id === selected) ?? false;
}
