import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.luxestore.com';

  // Core Pages
  const staticRoutes = [
    '',
    '/about',
    '/careers',
    '/contact',
    '/faq',
    '/privacy',
    '/products',
    '/returns',
    '/shipping',
    '/sustainability',
    '/site-map',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // In a real app, we would fetch dynamic product slugs here.
  // For now, we will add a placeholder or rely on the static list.
  // const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
  // const productRoutes = products.map(...)

  return [
    ...staticRoutes,
    // Add dynamic routes here in the future
  ];
}