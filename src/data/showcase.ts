export type ShotVariant =
  | "pay"
  | "launch"
  | "shop"
  | "brand"
  | "frete"
  | "power"
  | "off"
  | "plain";

export interface ShotItem {
  url: string;
  v: ShotVariant;
  t?: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface ProductItem {
  tag?: string;
  name: string;
  meta: string;
  price: string;
  oldPrice?: string;
  url: string;
  alt: string;
}

export const NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Origin", href: "#origin" },
  { label: "Learn how", href: "#learn-how" },
  { label: "Core Vertex", href: "#core-vertex" },
  { label: "Prices", href: "#prices" },
  { label: "Support", href: "#support" },
];

export const SHOTS: readonly ShotItem[] = [
  {
    v: "pay",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110422_0fc34393-7417-41b0-a200-43fd2b08a37f.png",
  },
  {
    v: "launch",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110423_ba46182e-43bc-43a8-9007-a8234acf442d.png",
  },
  {
    v: "shop",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110423_06cfbb84-6f96-48f6-be45-e03516510e48.png",
  },
  {
    v: "brand",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110422_634bf390-f171-4f5d-9151-0d2c86c26e7b.png",
  },
  {
    v: "frete",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110423_0cfe058d-db0e-4ee6-9708-7a297cc11a7a.png",
  },
  {
    v: "plain",
    t: "RITUAL REGIME",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110422_a90a35d7-ae20-4ce3-86d7-e3f6f658a6bc.png",
  },
  {
    v: "power",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110422_de267714-7647-4d9a-a0a9-55325683b2a2.png",
  },
  {
    v: "plain",
    t: "JUST ARRIVED",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_80eda275-e380-4ccb-b51f-332f25337079.png",
  },
  {
    v: "off",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110422_d6ba08f5-4ff8-4f09-8abe-93ee6bb0e34e.png",
  },
  {
    v: "plain",
    t: "STREETWEAR",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110423_87ec2115-3157-47ef-ac98-973f8ad6532d.png",
  },
];

export const HERO_BANNER = {
  url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_0316394c-37bd-432b-a1f2-ee46a461c22b.png",
  alt: "Warm amber and ivory skincare collection in golden morning light",
} as const;

export const PRODUCTS: readonly ProductItem[] = [
  {
    tag: "-24%",
    name: "Serum Radiance C",
    meta: "Brightens · 30ml",
    price: "$ 129.90",
    oldPrice: "$ 169.90",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110423_3b5dcf24-cc07-4f3b-8423-b597fffcdbfb.png",
    alt: "Vitamin C serum in amber glass",
  },
  {
    name: "Nourishing Lotion",
    meta: "Arid skin · 50g",
    price: "$ 89.90",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_50ec81be-8341-447f-a0c2-a5673a465447.png",
    alt: "Nourishing lotion jar on soft linen",
  },
  {
    tag: "SET",
    name: "Kit Sunset Renewal",
    meta: "3 products",
    price: "$ 219.90",
    oldPrice: "$ 289.90",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_fd208d72-9112-4cde-b509-8d273b470c6f.png",
    alt: "Three-piece Sunset Renewal skincare kit",
  },
  {
    tag: "JUST",
    name: "Defender SPF 60",
    meta: "Light feel · 40g",
    price: "$ 74.90",
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_110504_9731544c-a83b-48c4-bacb-e31e4d4b9f42.png",
    alt: "Lightweight facial sunscreen beside clear water",
  },
];

export const TRUST_ITEMS: readonly string[] = [
  "Ships gratis north of $ 199",
  "Pay 12x nil rates",
  "Swaps in 30 days",
  "Hypoallergenically checked",
];

