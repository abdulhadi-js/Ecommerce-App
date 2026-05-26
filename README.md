# Luxe Store

Luxe Store is an enterprise-grade luxury e-commerce platform designed to deliver a premium shopping experience. Built with a focus on high performance, transaction security, and visual fidelity, it provides a robust foundation for modern digital storefronts handling exclusive inventory and high-value transactions.

**Live Demo:** [https://luxestoreapp.vercel.app/](https://luxestoreapp.vercel.app/)

## Core Features & Architecture

*   **Atomic Inventory Management:** Utilizes database-level row locking and atomic Prisma transactions during checkout to guarantee stock integrity and prevent overselling of limited-edition items.
*   **Stripe Payment Integration:** Implements a secure, two-phase payment architecture. Order creation is decoupled from payment confirmation via a custom Stripe webhook handler, which relies on cryptographic signature verification to update order statuses.
*   **API Protection:** Protects critical endpoints, including the checkout pipeline, against brute-force and botnet attacks using sliding-window rate limiting powered by Upstash Redis.
*   **Cursor-Based Pagination:** Optimizes database query performance and UI rendering for large datasets (e.g., admin order history) by replacing inefficient offset pagination with cursor-based fetching.
*   **Cloudinary Asset Optimization:** Preserves the visual quality of luxury media without compromising load speeds by dynamically serving compressed, next-generation image formats (AVIF/WebP) via the Cloudinary CDN.

## Tech Stack & Dependencies

**Frontend:**
*   Next.js (App Router)
*   React
*   Tailwind CSS
*   Framer Motion
*   next-cloudinary

**Backend & Database:**
*   Node.js
*   Prisma ORM
*   PostgreSQL

**Payments & Security:**
*   Stripe SDK
*   @upstash/ratelimit

**Caching & Storage:**
*   Upstash Redis
*   Cloudinary

**Installation:**
```bash
npm install
npm install stripe @upstash/ratelimit @upstash/redis next-cloudinary @prisma/client
```

## Environment Variables Template (.env.example)

Create a `.env` file in the root of your project and populate it with the following configuration:

```env
# --- Application ---
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# --- Database (PostgreSQL) ---
DATABASE_URL=postgresql://user:password@localhost:5432/luxestore?schema=public

# --- Redis (Upstash) ---
UPSTASH_REDIS_REST_URL=https://your-upstash-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token

# --- Stripe Payments ---
# Your secret key from the Stripe Developer Dashboard
STRIPE_SECRET_KEY=sk_test_...
# Your publishable key (if required by frontend components)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# Webhook signing secret (generated via Stripe CLI or Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...

# --- Cloudinary Assets ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/luxe-store.git
    cd luxe-store
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the `.env.example` template above into a new `.env` file and fill in your specific credentials.

4.  **Synchronize Database Schema:**
    Push the Prisma schema to your local PostgreSQL database:
    ```bash
    npx prisma db push
    ```

5.  **Start Stripe Webhook Listener (Required for local payment testing):**
    In a separate terminal window, forward Stripe events to your local API route:
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
    *Note: Copy the `whsec_...` secret provided by this command into your `.env` file under `STRIPE_WEBHOOK_SECRET`.*

6.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployment Instructions

### Vercel Deployment

1.  Push your code to a GitHub/GitLab repository.
2.  Import the project into Vercel.
3.  In the Vercel project settings, add all the environment variables from your `.env` file.
    *   *Important:* Ensure `NEXT_PUBLIC_BASE_URL` is set to your production Vercel domain (e.g., `https://luxestoreapp.vercel.app`).
4.  Deploy the application.

### Stripe Production Webhook

1.  Navigate to the **Webhooks** section in your Stripe Dashboard.
2.  Click **Add an endpoint**.
3.  Set the endpoint URL to your production domain: `https://luxestoreapp.vercel.app/api/webhooks/stripe`.
4.  Select the `checkout.session.completed` event to listen for.
5.  Click **Add endpoint**, reveal the production Signing Secret, and update your `STRIPE_WEBHOOK_SECRET` environment variable in Vercel with this new value.