// Minimal Shopify Storefront API client — just enough to create a cart and
// send the shopper to Shopify checkout. The Storefront token is designed to
// be public (same one the Buy Button / Hydrogen use client-side), so it's
// safe behind NEXT_PUBLIC_.

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = "2025-01";

type ShopifyFetchArgs = {
  query: string;
  variables?: Record<string, unknown>;
};

async function shopifyFetch<T>({ query, variables }: ShopifyFetchArgs): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Shopify Storefront API is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in .env.local."
    );
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(", "));
  }

  return json.data as T;
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
};

export type CartLine = { variantId: string; quantity: number };

/** Creates a Shopify cart with one or more lines and returns the hosted checkout URL. */
export async function createCartCheckoutUrl(lines: CartLine[]) {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE,
    variables: { lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) },
  });

  const { cart, userErrors } = data.cartCreate;

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(", "));
  }
  if (!cart) {
    throw new Error("Shopify did not return a cart.");
  }

  return cart.checkoutUrl;
}

const PRODUCT_BY_HANDLE = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      featuredImage {
        url
        altText
      }
      variants(first: 1) {
        nodes {
          id
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type ProductByHandleResponse = {
  product: {
    id: string;
    title: string;
    featuredImage: { url: string; altText: string | null } | null;
    variants: { nodes: { id: string; price: { amount: string; currencyCode: string } }[] };
  } | null;
};

/** Looks up a product (and its first variant) by handle for live price/availability. */
export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE,
    variables: { handle },
  });

  return data.product;
}

const VARIANT_NODES = /* GraphQL */ `
  query VariantNodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        price {
          amount
        }
        compareAtPrice {
          amount
        }
        stockStatus: metafield(namespace: "custom", key: "stock_status") {
          value
        }
      }
    }
  }
`;

type VariantNodesResponse = {
  nodes: ({
    id: string;
    availableForSale: boolean;
    price: { amount: string };
    compareAtPrice: { amount: string } | null;
    stockStatus: { value: string } | null;
  } | null)[];
};

export type LiveVariantPrice = {
  price: number;
  compareAtPrice: number | null;
  availableForSale: boolean;
  // True when the merchant has manually flagged this variant via the
  // "stock_status" metafield (namespace "custom") — a manual override on
  // top of Shopify's own inventory-based availableForSale.
  manuallyOutOfStock: boolean;
};

/**
 * Fetches live price/compare-at/availability for a batch of variants in one
 * request. Keyed by numeric Shopify variant ID (not the gid string) so
 * callers can look results up against the static ids in lib/bikeRacks.ts.
 */
export async function getVariantPrices(numericIds: number[]): Promise<Map<number, LiveVariantPrice>> {
  const ids = numericIds.map((id) => `gid://shopify/ProductVariant/${id}`);
  const data = await shopifyFetch<VariantNodesResponse>({
    query: VARIANT_NODES,
    variables: { ids },
  });

  const result = new Map<number, LiveVariantPrice>();
  for (const node of data.nodes) {
    if (!node) continue;
    const numericId = Number(node.id.split("/").pop());
    result.set(numericId, {
      price: Math.round(Number(node.price.amount)),
      compareAtPrice: node.compareAtPrice ? Math.round(Number(node.compareAtPrice.amount)) : null,
      availableForSale: node.availableForSale,
      manuallyOutOfStock: node.stockStatus?.value === "out_of_stock",
    });
  }
  return result;
}

export const isShopifyConfigured = Boolean(domain && token);
