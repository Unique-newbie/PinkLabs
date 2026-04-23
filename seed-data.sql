-- =====================================================
-- Pink Labs — MASTER SEED DATA (Comprehensive)
-- =====================================================
-- Run this AFTER master-schema.sql in the Supabase SQL Editor.
-- It populates ALL content tables with professional data.
-- =====================================================

-- 1. Services (with features)
INSERT INTO public.services (title, description, icon_name, features, sort_order) VALUES
('Custom Web Development', 'High-performance, scalable web applications built with Next.js, React, and modern tech stacks designed for growth.', 'Code', ARRAY['Server-side rendering', 'Progressive Web Apps', 'API development', 'Database design'], 1),
('Mobile App Solutions', 'Native and cross-platform mobile experiences for iOS and Android using React Native and Flutter.', 'Smartphone', ARRAY['iOS & Android', 'Push notifications', 'Offline support', 'App Store optimization'], 2),
('UI/UX Design', 'User-centric designs that focus on conversion, accessibility, and premium aesthetic appeal.', 'Palette', ARRAY['User research', 'Wireframing', 'High-fidelity prototypes', 'Design systems'], 3),
('Cloud Infrastructure', 'Robust, secure, and scalable server architectures using AWS, Azure, and Google Cloud.', 'Server', ARRAY['Auto-scaling', 'CI/CD pipelines', 'Container orchestration', 'Monitoring & alerts'], 4),
('E-commerce Systems', 'Tailored online stores with seamless payment integration, inventory management, and analytics.', 'ShoppingBag', ARRAY['Stripe & PayPal', 'Inventory management', 'Order tracking', 'Analytics dashboards'], 5),
('AI & Machine Learning', 'Integrating intelligent features, automation, and predictive analytics into your digital products.', 'Blocks', ARRAY['Natural language processing', 'Computer vision', 'Recommendation engines', 'Predictive analytics'], 6);

-- 2. Projects (Portfolio)
INSERT INTO public.projects (title, description, category, tags, image_url, project_url, is_featured, sort_order) VALUES
('Elite Commerce', 'A luxury e-commerce platform built for high-end fashion brands. Features include personalized recommendations, AR try-on, and a seamless checkout experience that increased conversions by 34%.', 'Web App', ARRAY['Next.js', 'Stripe', 'Tailwind CSS', 'Supabase'], 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200', 'https://example.com', true, 1),
('Visionary Bank', 'Digital banking interface with real-time analytics, AI-powered fraud detection, and biometric security. Serving 50,000+ active users with 99.99% uptime.', 'FinTech', ARRAY['React', 'D3.js', 'Node.js', 'PostgreSQL'], 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200', '', true, 2),
('HealthSync App', 'Mobile health tracking application for professional athletes. Real-time vitals monitoring, workout planning, and nutrition tracking with Apple Health integration.', 'Mobile', ARRAY['React Native', 'Firebase', 'HealthKit'], 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200', '', true, 3),
('Neo Realty', 'Real estate marketplace with immersive 3D virtual tour integrations, AI-powered property valuations, and smart contract-based transactions.', 'Web App', ARRAY['Three.js', 'Supabase', 'Next.js'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200', 'https://example.com', false, 4),
('Pixel Stream', 'A custom video streaming service for independent filmmakers. Features adaptive bitrate streaming, creator monetization tools, and community engagement features.', 'Streaming', ARRAY['WebRTC', 'AWS S3', 'FFmpeg', 'React'], 'https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&q=80&w=1200', '', false, 5),
('Pulse Social', 'Next-gen social networking platform focused on privacy and speed. End-to-end encrypted messaging, algorithmic feed control, and zero-tracking browsing.', 'Social', ARRAY['GraphQL', 'Flutter', 'Rust', 'Redis'], 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200', '', false, 6);

-- 3. Testimonials
INSERT INTO public.testimonials (client_name, client_role, client_company, quote, rating) VALUES
('Sarah Jenkins', 'CEO', 'TechFlow', 'PinkLabs delivered our MVP three weeks ahead of schedule. Their attention to detail is unmatched and the product quality exceeded our expectations.', 5),
('Michael Chen', 'Product Manager', 'InnovateX', 'The team transformed our legacy system into a modern, lightning-fast platform. Our user engagement increased by 60% within the first month.', 5),
('David Miller', 'Founder', 'GrowthEngine', 'Working with PinkLabs felt like having our own in-house dev team. They truly became a partner in our success and growth story.', 5),
('Emma Watson', 'Design Lead', 'CreativePulse', 'Their UI/UX team understands premium design at its core. Our conversion rate increased by 40% after the redesign — the ROI was incredible.', 5);

-- 4. Team Members
INSERT INTO public.team_members (name, role, bio, avatar_url, sort_order) VALUES
('Alice Rivera', 'Founder & CEO', 'Visionary leader with 10+ years in the software industry. Former engineering lead at a Fortune 500 company.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', 1),
('Marcus Chen', 'Co-Founder & CTO', 'Deep-tech expert specialized in scalable architecture. Built systems serving millions of daily active users.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 2),
('Sofia Rodriguez', 'Design Director', 'Crafting award-winning user experiences for global brands. 8+ years in product design and design systems.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 3),
('James Wilson', 'Lead Fullstack Developer', 'Expert in Next.js, PostgreSQL, and high-performance React applications. Open-source contributor.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 4),
('Elena Kostas', 'Branding Specialist', 'Passionate about creating cohesive and memorable brand identities that tell compelling stories.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 5),
('Leo Sterling', 'Product Strategist', 'Bridging the gap between business goals and technical excellence. MBA with a focus on digital transformation.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', 6);

-- 5. FAQs
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('How long does a typical project take?', 'An MVP usually takes 4-8 weeks. Larger enterprise platforms can take 3-6 months depending on the scope and complexity. We always provide a detailed timeline during the discovery phase.', 'General', 1),
('Do you offer post-launch support?', 'Yes! We provide ongoing maintenance, monitoring, scaling, and support packages to ensure your software remains secure and performant. We''re in it for the long haul.', 'Support', 2),
('What technologies do you specialize in?', 'We are experts in Next.js, React, Node.js, Supabase, PostgreSQL, and various mobile frameworks like React Native and Flutter. We choose the best tech for each project.', 'Tech', 3),
('Can you help with UI/UX design only?', 'Absolutely. We offer standalone design services including user research, wireframing, high-fidelity prototypes, and complete design systems. No development required.', 'Design', 4),
('How do we get started?', 'Simply fill out our contact form or submit a project request. We''ll schedule a free discovery call within 24 hours to discuss your vision, timeline, and budget.', 'Process', 5),
('What is your pricing model?', 'We offer flexible pricing: fixed-price for well-defined projects, and time-and-materials for agile engagements. Every project starts with a transparent, detailed quote.', 'Pricing', 6);

-- 6. Process Steps
INSERT INTO public.process_steps (step_number, title, description, icon_name, sort_order) VALUES
('01', 'Discovery', 'We deep-dive into your problem space, identifying core users, business objectives, and technical requirements through workshops and research.', 'Search', 1),
('02', 'Design', 'Transparent design process where we prototype and iterate until the vision is perfect. You see progress at every step with interactive Figma prototypes.', 'Palette', 2),
('03', 'Develop', 'Clean, tested, and high-performance code written with modern technologies. Regular demos ensure we''re always aligned with your expectations.', 'Code', 3),
('04', 'Deploy', 'Smooth launch followed by real-time monitoring, performance optimization, and data-driven improvements. We ensure zero-downtime deployments.', 'Rocket', 4);

-- 7. Company Values
INSERT INTO public.company_values (title, description, icon_name, sort_order) VALUES
('Precision', 'Every line of code is crafted with purpose. We don''t cut corners — we build things right the first time with thorough testing and code reviews.', 'Target', 1),
('Innovation', 'We stay at the cutting edge of technology. Modern frameworks, best practices, and creative solutions that push boundaries.', 'Lightbulb', 2),
('Collaboration', 'Your project is a partnership. We work transparently, communicate often, and iterate fast to ensure alignment at every stage.', 'Users', 3),
('Speed', 'Time to market matters. We use agile methodologies and modern tooling to deliver quality at velocity without compromising standards.', 'Rocket', 4),
('Passion', 'We genuinely love building software. That passion shows in every pixel, every function, and every interaction we craft.', 'Heart', 5),
('Reliability', 'We build software that lasts. Robust architecture, thorough testing, comprehensive documentation, and long-term support.', 'Shield', 6);

-- 8. Brands (Trusted By logos)
INSERT INTO public.brands (name, logo_url, sort_order) VALUES
('TechFlow', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 1),
('InnovateX', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 2),
('GrowthEngine', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', 3),
('CreativePulse', 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg', 4),
('Vortex', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 5),
('Lumina', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 6);

-- 9. Site Stats
INSERT INTO public.site_stats (label, value, icon_name, sort_order) VALUES
('Projects Delivered', '150+', 'CheckCircle2', 1),
('Client Satisfaction', '99%', 'Heart', 2),
('Years Experience', '5+', 'Clock', 3),
('Global Partners', '50+', 'Globe', 4);

-- 10. Global Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('contact_info', '{
  "email": "hello@pinklabs.dev",
  "phone": "+1 (555) 123-4567",
  "location": "Remote-first, Worldwide",
  "hours": "Mon – Fri, 9am – 6pm IST",
  "socials": {
    "twitter": "https://twitter.com/pinklabs",
    "github": "https://github.com/pinklabs",
    "linkedin": "https://linkedin.com/company/pinklabs"
  }
}'),
('navigation', '{
  "main_nav": [
    { "name": "Services", "href": "/services" },
    { "name": "Portfolio", "href": "/portfolio" },
    { "name": "About", "href": "/about" },
    { "name": "Contact", "href": "/contact" }
  ],
  "footer_services": [
    { "name": "Web Applications", "href": "/services" },
    { "name": "Mobile Apps", "href": "/services" },
    { "name": "UI/UX Design", "href": "/services" },
    { "name": "E-Commerce", "href": "/services" },
    { "name": "API Development", "href": "/services" }
  ],
  "footer_company": [
    { "name": "About Us", "href": "/about" },
    { "name": "Portfolio", "href": "/portfolio" },
    { "name": "Contact", "href": "/contact" }
  ],
  "footer_support": [
    { "name": "Client Portal", "href": "/dashboard" },
    { "name": "New Project", "href": "/join" },
    { "name": "Support", "href": "/dashboard/new-ticket" }
  ]
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Done! ✅
