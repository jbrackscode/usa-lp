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

const PAGE_BY_HANDLE = /* GraphQL */ `
  query PageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
    }
  }
`;

type PageByHandleResponse = {
  page: { id: string; title: string; body: string } | null;
};

/** Fetches a Shopify Online Store page (Admin > Online Store > Pages) by its handle. */
export async function getPageByHandle(handle: string) {
  const data = await shopifyFetch<PageByHandleResponse>({
    query: PAGE_BY_HANDLE,
    variables: { handle },
  });
  return data.page;
}

// --- Cart -------------------------------------------------------------
// A real, persistent Shopify cart (as opposed to createCartCheckoutUrl
// above, which spins up a disposable cart just to redirect straight to
// checkout). Used by the on-site /cart page and header cart icon.

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
      }
      totalAmount {
        amount
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            price {
              amount
            }
            compareAtPrice {
              amount
            }
            selectedOptions {
              name
              value
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
`;

type CartLineNodeRaw = {
  id: string;
  quantity: number;
  cost: { totalAmount: { amount: string } };
  merchandise: {
    id: string;
    title: string;
    image: { url: string; altText: string | null } | null;
    price: { amount: string };
    compareAtPrice: { amount: string } | null;
    selectedOptions: { name: string; value: string }[];
    product: { title: string; handle: string };
  };
};

type CartRaw = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string }; totalAmount: { amount: string } };
  lines: { nodes: CartLineNodeRaw[] };
};

export type CartLineItem = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  image: { url: string; altText: string | null } | null;
  price: number;
  compareAtPrice: number | null;
  selectedOptions: { name: string; value: string }[];
  lineTotal: number;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  total: number;
  lines: CartLineItem[];
};

function normalizeCart(raw: CartRaw): ShopifyCart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: Number(raw.cost.subtotalAmount.amount),
    total: Number(raw.cost.totalAmount.amount),
    lines: raw.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      variantId: line.merchandise.id,
      variantTitle: line.merchandise.title,
      productTitle: line.merchandise.product.title,
      productHandle: line.merchandise.product.handle,
      image: line.merchandise.image,
      price: Number(line.merchandise.price.amount),
      compareAtPrice: line.merchandise.compareAtPrice ? Number(line.merchandise.compareAtPrice.amount) : null,
      selectedOptions: line.merchandise.selectedOptions,
      lineTotal: Number(line.cost.totalAmount.amount),
    })),
  };
}

type CartMutationResponse = { cart: CartRaw | null; userErrors: { field: string[]; message: string }[] };

function unwrapCartMutation(result: CartMutationResponse): ShopifyCart {
  const { cart, userErrors } = result;
  if (userErrors.length > 0) throw new Error(userErrors.map((e) => e.message).join(", "));
  if (!cart) throw new Error("Shopify did not return a cart.");
  return normalizeCart(cart);
}

/** Creates a new persistent cart with the given lines. */
export async function createCart(lines: CartLine[]): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartCreateFull($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{ cartCreate: CartMutationResponse }>({
    query,
    variables: { lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) },
  });
  return unwrapCartMutation(data.cartCreate);
}

/** Fetches an existing cart by id, or null if it no longer exists (expired/invalid). */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = /* GraphQL */ `
    ${CART_FIELDS}
    query CartGet($id: ID!) {
      cart(id: $id) {
        ...CartFields
      }
    }
  `;
  const data = await shopifyFetch<{ cart: CartRaw | null }>({ query, variables: { id: cartId } });
  return data.cart ? normalizeCart(data.cart) : null;
}

export async function addCartLines(cartId: string, lines: CartLine[]): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResponse }>({
    query,
    variables: { cartId, lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) },
  });
  return unwrapCartMutation(data.cartLinesAdd);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResponse }>({
    query,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  return unwrapCartMutation(data.cartLinesUpdate);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = /* GraphQL */ `
    ${CART_FIELDS}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResponse }>({
    query,
    variables: { cartId, lineIds: [lineId] },
  });
  return unwrapCartMutation(data.cartLinesRemove);
}

export const isShopifyConfigured = Boolean(domain && token);
