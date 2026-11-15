export type MainCategoryId = "paper" | "plastic" | "other";
export type SubCategoryId =
  | "pola"
  | "postcard"
  | "square-card"
  | "key"
  | "standee";
export type StandeeVariantId = "large" | "small";

export interface CategoryNode {
  id: string;
  name: string;
  children?: readonly CategoryNode[];
}

export const SHOP_CATEGORIES: readonly CategoryNode[] = [
  {
    id: "paper",
    name: "Đồ giấy",
    children: [
      { id: "pola", name: "Pola" },
      { id: "postcard", name: "Postcard" },
      { id: "square-card", name: "Card vuông" },
    ],
  },
  {
    id: "plastic",
    name: "Đồ nhựa",
    children: [
      { id: "key", name: "Key" },
      {
        id: "standee",
        name: "Standee",
        children: [
          { id: "large", name: "Lớn" },
          { id: "small", name: "Nhỏ" },
        ],
      },
    ],
  },
  {
    id: "other",
    name: "Khác",
    children: [],
  },
] as const;

export function getMainCategoryName(categoryId: MainCategoryId): string {
  return SHOP_CATEGORIES.find((c) => c.id === categoryId)?.name ?? "Khác";
}

export function getSubcategoryName(
  categoryId: MainCategoryId,
  subcategoryId?: SubCategoryId
): string | null {
  if (!subcategoryId) return null;
  const main = SHOP_CATEGORIES.find((c) => c.id === categoryId);
  return main?.children?.find((sub) => sub.id === subcategoryId)?.name ?? null;
}

export function getVariantName(
  categoryId: MainCategoryId,
  subcategoryId?: SubCategoryId,
  variantId?: StandeeVariantId
): string | null {
  if (!subcategoryId || !variantId) return null;
  const main = SHOP_CATEGORIES.find((c) => c.id === categoryId);
  const sub = main?.children?.find((s) => s.id === subcategoryId);
  return sub?.children?.find((v) => v.id === variantId)?.name ?? null;
}

export function getProductCategoryTrail(product: {
  category: MainCategoryId;
  subcategory?: SubCategoryId;
  variant?: StandeeVariantId;
}): string[] {
  const trail = [getMainCategoryName(product.category)];
  const sub = getSubcategoryName(product.category, product.subcategory);
  if (sub) trail.push(sub);
  const variant = getVariantName(
    product.category,
    product.subcategory,
    product.variant
  );
  if (variant) trail.push(variant);
  return trail;
}

export function matchesCategorySelection(
  product: {
    category: MainCategoryId;
    subcategory?: SubCategoryId;
    variant?: StandeeVariantId;
  },
  selection: {
    category: MainCategoryId | "all";
    subcategory: SubCategoryId | "all";
    variant: StandeeVariantId | "all";
  }
): boolean {
  if (selection.category === "all") return true;
  if (product.category !== selection.category) return false;
  if (selection.subcategory !== "all" && product.subcategory !== selection.subcategory) {
    return false;
  }
  if (
    selection.subcategory === "standee" &&
    selection.variant !== "all" &&
    product.variant !== selection.variant
  ) {
    return false;
  }
  return true;
}
