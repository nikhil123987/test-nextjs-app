const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  priority: 0.9, 
  exclude: ['/test', '/content-gallery', '/404','/admin-dashboard/blogs','/admin-dashboard/blogs/add','/admin-dashboard/careers','/admin-dashboard/careers/add','/admin-dashboard/careers/edit','/admin-dashboard/coupons','/admin-dashboard/events','/admin-dashboard/events/add','/admin-dashboard/institutes','/admin-dashboard/overview','/admin-dashboard/requests','/admin-dashboard/settings','/admin-dashboard/settings/edit-categories','/admin-dashboard/settings/edit-filters','/admin-dashboard/students','/admin-dashboard/top-location','/admin-dashboard/whatsapp','/admin-dashboard/marketing/whatsapp-marketing','/admin-dashboard/marketing/whatsapp-onboarding','/commingsoon','/merchant-landing','/merchant/dashboard','/merchant/dashboard/accountancy','/merchant/dashboard/addCourses','/merchant/dashboard/courses','/merchant/dashboard/notifications','/merchant/dashboard/profile','/merchant/dashboard/settings','/merchant/dashboard/students','/merchant/details','/merchant/details/success','/merchant/login/forgot','/profile/manageCards','/profile/ongoingCourse','/profile/purchaseCourse','/profile/recentlyViewed','/profile/reviews','/profile/wishlist','/terms', '/merchant/dashboard/posts', '/merchant/dashboard/posts', '/merchant/dashboard/posts/add', '/merchant/dashboard/posts/edit', '/coaching-in-99', '/merchant/dashboard/reviews'],
  robotsTxtOptions: {
    policies: [
      {userAgent: '*', disallow:'/cgi-bin/'},
      {userAgent: 'Googlebot', disallow:''},
      {userAgent: 'googlebot-image', disallow:''},
      {userAgent: 'googlebot-mobile', disallow:''},
      {userAgent: 'MSNBot', disallow:''},
      {userAgent: 'Slurp', disallow:''},
      {userAgent: 'Teoma', disallow:''},
      {userAgent: 'Gigabot', disallow:''},
      {userAgent: 'Robozilla', disallow:''},
      {userAgent: 'Nutch', disallow:''},
      {userAgent: 'ia_archiver', disallow:''},
      {userAgent: 'baiduspider', disallow:''},
      {userAgent: 'naverbot', disallow:''},
      {userAgent: 'yeti', disallow:''},
      {userAgent: 'yahoo-mmcrawler', disallow:''},
      {userAgent: 'psbot', disallow:''},
      {userAgent: 'yahoo-blogs/v3.9', disallow:''},
    ],
    additionalSitemaps: [
      `${siteUrl}sitemap.xml`,
      `${siteUrl}server-sitemap.xml`,
    ],
  },
  // (optional)
  // ...other options
  outDir: "./public"
}
