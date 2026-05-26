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
DATABASE_URL="mysql://4VTxz33iSeBYANw.root:SqIoClDeTSekjCY1@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dge52jrnc"
NEXT_PUBLIC_CLOUDINARY_API_KEY="195958177116481"
CLOUDINARY_API_SECRET="quHO-t_AOv_bDEfhM_KVZyTWszg"

AUTH_SECRET="0/F+rC8zG2qacCJLqtl39qvFXMxpTS3JpFUhaz+HRd4="
NEXT_PUBLIC_BASE_URL="https://luxestoreapp.vercel.app/"

# Gmail SMTP Configuration
EMAIL_SERVER_USER="dev.alhadi@gmail.com"
# This is NOT your normal login password. 
# You must generate an "App Password" in your Google Account Security settings.
EMAIL_SERVER_PASSWORD="yjgfhypfkkgygagc" 
EMAIL_FROM="LuxeStore <dev.alhadi@gmail.com>"

# Google Authentication
GOOGLE_CLIENT_ID="225888483864-ououbpm2j08874ovh4ehiic32d9pmch8.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
AUTH_TRUST_HOST=true

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_51Tb6LjHhiAW8EOxhsiUGSfwUeBR3dQE0VZkYU0rIAWRT8OMsYWgmEZ9u2AcUy3YUkTh6IdweSp8cX8acvurLNFmd007VG9pvhA"
STRIPE_WEBHOOK_SECRET="whsec_05b89c625c4bb6ded331a1635414edd8ae9aac3a2e3119353b2fef6c40ca7b1"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://liberal-wildcat-136425.upstash.io"
UPSTASH_REDIS_REST_TOKEN="gQAAAAAAAhTpAAIgcDEwNTZkZDI3MmU2OWI0MGVkOTFjYzU4Yzk3MDlmYjEyYw"
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