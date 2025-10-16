import profileAvatar from 'figma:asset/87bb8be30f1ab82a7e85c745cc7e7359d4ebf809.png';
// EduManage screenshots
import em01 from '../assets/edumanage/1_Login_screen_light.png';
import em02a from '../assets/edumanage/2a_Signup_screen_light.png';
import em02d from '../assets/edumanage/2_Login_screen_dark.png';
import em03 from '../assets/edumanage/3_Dashboard_admin_screen_light_1.png';
import em04 from '../assets/edumanage/4_Dashboard_admin_screen_light_2.png';
import em05 from '../assets/edumanage/5_Academics_screen_light_1.png';
import em06 from '../assets/edumanage/6_Academics_screen_light_2.png';
import em07 from '../assets/edumanage/7_Newsletter_screen_light.png';
import em07a from '../assets/edumanage/7a_Profile_screen_light_1.png';
import em08 from '../assets/edumanage/8_Profile_settings_screen_light_1.png';
import em09 from '../assets/edumanage/9_Profile_settings_screen_light_2.png';
import em10 from '../assets/edumanage/10_Profile_edit_screen_light_1.png';
import em11 from '../assets/edumanage/11_Profile_notifications_screen_light.png';
import em12 from '../assets/edumanage/12_Forgot_password_screen_light_1.png';

// NutriFind screenshots
import nf01 from '../assets/nutrifind/1_Login_screen.png';
import nf02 from '../assets/nutrifind/2_Signup_screen.png';
import nf03a from '../assets/nutrifind/3a_Food_item_details_screen.png';
import nf03 from '../assets/nutrifind/3_Text_search_screen.png';
import nf04 from '../assets/nutrifind/4_Voice_search_screen.png';
import nf05 from '../assets/nutrifind/5_Photo_search_screen.png';
import nf06 from '../assets/nutrifind/6_Profile_screen.png';

export const resumeData = {
    profile: {
        name: "Venkata Sagar Varma Muppala",
        firstName: "Venkata Sagar Varma",
        lastName: "Muppala",
        title: "Full-Stack Software Architect",
        tagline:
            "11+ years building scalable apps across finance, travel, and retail. Java + Angular + React/React Native + microservices. AI-assisted delivery.",
        avatar: profileAvatar,
        location: "St Louis, MO",
        email: "sagar.varma8@gmail.com",
        links: {
            linkedin:
                "https://linkedin.com/in/venkata-sagar-varma-muppala-271ba369",
        },
    },
    objective: {
        headline:
            "Build scalable, user-first products with AI-accelerated delivery.",
        description:
            "Seasoned Full Stack Developer with 11+ years of experience in building scalable applications across domains like finance, travel, and retail. Expertise in React.js, NextJs, React Native, NestJS, NodeJs, Angular and Java combined with a strong grasp of microservices, DevOps tools, and modern UI frameworks. Passionate about integrating AI tools into daily development workflows for improved productivity and faster delivery.",
    },
    skills: {
        frontend: [
            "React Js",
            "Next Js",
            "React Native",
            "Zustand",
            "Redux",
            "Tailwind",
            "Figma",
            "Bootstrap",
            "Angular",
            "D3.js",
        ],
        backend: [
            "Java",
            "JPA",
            "Microservices",
            "Redis",
            "REST APIs",
            "Spring Boot",
            "MongoDB",
            "Oracle",
            "SQL Server",
        ],
        cloud: ["AWS", "Docker", "Gitlab", "Jenkins", "Maven", "Gradle"],
        aiTools: [
            "AmazonQ",
            "Copilot in VsCode",
            "Cursor AI",
            "Figma Make",
            "Gemini in IntelliJ",
            "Replit",
            "Uizard",
            "v0. dev",
            "Workik",
        ],
    },
    experience: [
        {
            company: "Sira Soft Solutions Inc",
            role: "Software Architect III",
            Location: "Missouri USA",
            period: "07/2024 – Present",
            stack: [
                "React Js",
                "Zustand",
                "Webpack 5",
                "Module Federation",
                "React Native",
                "Expo",
                "Java",
                "Spring",
                "MySQL",
                "Datadog",
                "MapLibre",
                "HERE Maps",
                "Cucumber",
                "Selenium",
                "QAF",
            ],
            achievements: [
                "Led a team of 4 UI engineers in delivering high-performance web and mobile applications, driving sprint planning, code reviews, and feature delivery with precision and velocity.",
                "Architected scalable full-stack solutions using React.js, Next.js, Zustand, and Spring Boot, enabling seamless user experiences across platforms and devices.",
                "Currently building an internal AI-powered tool that integrates Amazon Q with Figma MCP server, automatically converting Figma designs into React.js and Jetpack Compose code while preserving core UI styling and layout fidelity.",
                "Built Micro Frontend architecture with Webpack 5 Module Federation, allowing dynamic dependency sharing and modular deployment across enterprise-grade apps.",
                "Developed a reusable Survey Form library with plug-and-play capabilities, reducing UI implementation time by 90% within one month and standardizing form logic across projects.",
                "Converted complex web apps into mobile-native experiences using React Native, Expo, and Capacitor JS, ensuring full Android/iOS compatibility and offline resilience.",
                "Integrated real-time technician tracking using Maplibre, AWS Here Maps, and Datadog, delivering live location monitoring and proactive alerting for field operations.",
                "Accelerated development cycles with AI tools like GitHub Copilot, Supabase AI, Figma Make, WorkIk, and Replit, streamlining code generation, UI prototyping, and backend scaffolding.",
                "Implemented BDD test automation using Cucumber, Selenium, and QAF, achieving robust coverage and reducing manual QA effort across web and mobile platforms.",
                "Mentored junior developers on frontend architecture, performance tuning, and design best practices, fostering a culture of clean code and scalable UI patterns."
            ],
        },
        {
            company: "Wells Fargo India",
            role: "Technical Lead",
            Location: "Hyderabad, India",
            period: "04/2021 – 05/2024",
            stack: [
                "React Js",
                "Zustand",
                "Webpack 5",
                "Module Federation",
                "Java",
                "Spring Boot",
                "Spring Cloud",
                "Microservices",
                "Cucumber BDD",
                "QAF automation",
                "Jenkins",
                "SonarQube",
                "Postman",
                "JUnit",
                "Mockito",
                "Jest"
            ],
            achievements: [
                "Led a cross-functional team of 4 engineers to deliver a secure, scalable financial advisory platform, balancing frontend innovation with backend robustness across microservices.",
                "Architected a Micro Frontend ecosystem using Webpack 5 Module Federation, enabling independent deployment of advisory modules and seamless integration across banking portals.",
                "Engineered dynamic, responsive UIs in React.js, leveraging Zustand for lightweight state management and optimizing performance with custom Webpack configurations.",
                "Standardized component libraries and design tokens, ensuring consistent branding and accessibility across federated React apps.",
                "Integrated Cucumber BDD with Selenium and Qmetry, automating end-to-end test scenarios for advisory workflows and improving QA coverage by 75%.",
                "Designed and implemented Spring Boot microservices, exposing secure REST APIs for financial data aggregation, client profiling, and advisory recommendations.",
                "Championed Agile rituals and sprint planning, aligning technical deliverables with business goals and fostering a culture of ownership and velocity.",
                "Mentored junior developers in React, Java, and automation frameworks, conducting code reviews, pairing sessions, and architecture walkthroughs to elevate team capability.",
                "Collaborated with product managers and stakeholders, translating financial advisory requirements into scalable tech solutions and delivering PoCs for client validation.",
                "Optimized CI/CD pipelines for micro frontends and backend services, reducing deployment friction and enabling faster iteration cycles across advisory modules."
            ],
        },
        {
            company: "Amadeus Labs",
            role: "Senior Software Engineer",
            Location: "Bengaluru, India",
            period: "08/2019 – 03/2021",
            stack: [
                "Java",
                "Spring Boot",
                "Spring MVC",
                "JPA",
                "Oracle 12c",
                "ARIA templates",
                "OAuth2",
                "SSO/SAML",
                "JWT",
                "Tomcat",
                "AWS",
                "Redis",
                "Maven",
                "Jenkins",
                "Git",
                "Bitbucket",
                "JUnit",
                "Mockito",
                "TestNG",
                "Splunk",
            ],
            achievements: [
                "Altea Reservation Desktop: web application for airline staff/agents to book tickets with customer-specific customizations.",
                "Designed and developed business logic using Java 8 (lambdas, LocalDate, collections); created resource classes and database access.",
                "Used Spring Boot modules and Spring Validation for server-side validations.",
                "Developed DAOs using JPA for Oracle 12c operations.",
                "Built web apps using Spring MVC and ARIA templates (in-house framework).",
                "Applied dependency injection with Spring; configured beans via IOC and AOP.",
                "Implemented OAuth2 and SSO/SAML; created JWT for stateless endpoint authorization.",
                "Enhanced existing app with ARIA templates, including role-based navigation menus sourced from XML.",
                "Developed responsive UIs using ARIA templates; collaborated to improve UX.",
                "Authored Maven builds to generate WAR/JARs for deployment to Apache Tomcat.",
                "Wrote SQL (INSERT/UPDATE/DELETE/ALTER/JOIN) using SQL Developer.",
                "Performed manual deployments of WAR/JAR in Linux/Unix via shell; managed Spring Boot service restarts in higher environments.",
                "Contributed to migration of an on-prem application to AWS; applied caching to reduce latency.",
                "Used Redis for identity validation/session management at API gateway and for query caching.",
                "Remediated security issues using Fortify/FindBugs; generated reports.",
                "Defined test cases and scripts to perform load, performance, and regression testing.",
                "Integrated with Jenkins for release management; resolved production issues with Splunk logs.",
                "Implemented unit tests using JUnit, Mockito, and TestNG; managed source with Git/Bitbucket.",
                "Followed Agile/Scrum to track and optimize features to customer needs.",
            ],
        },
        {
            company: "Analytics Quotient",
            role: "Senior Software Engineer",
            Location: "Bengaluru, India",
            period: "05/2018 – 08/2019",
            stack: [
                "Java",
                "Spring MVC",
                "Spring Data MongoDB",
                "Spring Boot",
                "REST",
                "Angular",
                "D3",
                "Google Charts",
                "Html2Canvas",
                "Apache POI",
                "Aspose.Slides",
                "MongoDB",
                "Swagger",
                "Maven",
                "SVN",
                "Jenkins",
            ],
            achievements: [
                "KPI-Dashboard: web application providing data visualization of client historical data to predict future sales trends.",
                "Followed Agile/Sprint methodology for requirements, analysis, planning, development, and testing; tracked work in Rally.",
                "Developed core Java business rules and workflows using Spring MVC and Spring Data MongoDB.",
                "Built microservices with Spring Boot; used RestTemplate for service-to-service communication.",
                "Developed REST services and tested with Postman; raised defects as needed.",
                "Extensively used Angular to build responsive, performant interfaces.",
                "Built charts and visualizations with D3, Google Charts, SVGs, and Html2Canvas (pie, bar, trend, line, custom).",
                "Created utilities to export historical data and charts to Excel and PowerPoint using Apache POI and Aspose.Slides.",
                "Implemented Swagger configuration in Spring Boot for auto-generated API docs.",
                "Analyzed OLTP and business processes to improve data quality and meet new requirements via MongoDB.",
                "Provided production support and bug fixes; used Maven for build/deploy across QA and Prod.",
                "Used SVN and SourceTree for version control, branching, and merging; continuous deployment via Jenkins.",
            ],
        },
        {
            company: "Infosys Ltd",
            role: "Software Engineer",
            Location: "Mysore, India",
            period: "02/2014 – 05/2018",
            stack: [
                "Java",
                "Spring",
                "SQL",
                "XML",
                "XSLT",
                "JavaScript",
                "HTML",
                "CSS",
            ],
            achievements: [
                "Allstate Insurance application: web app to create/modify customer insurance policies (Home, Car, Boat, etc.).",
                "Developed in-depth knowledge of Infosys applications and led discussions to deliver technical analysis and solutions.",
                "Interacted with engineering and peers to isolate product defects; performed defect investigation and production support.",
                "Designed, developed, and tested processes for extracting data from legacy systems and production databases.",
                "Generated PDFs using XML and XSLT; identified and implemented process/product/tool improvements.",
                "Provided technical guidance to team members; continuous learning and knowledge sharing.",
            ],
        },
    ],
    education: [
        {
            institution: "CDAC University, Bengaluru",
            degree: "PG Diploma",
            field: "Embedded Systems",
            period: "2013",
            GPA: "80%",
        },
        {
            institution:
                "Narayana Engineering College, Nellore, India",
            degree: "Bachelors of Technology",
            field: "Electronics & Communications",
            period: "2008-2012",
            GPA: "76%",
        },
        {
            institution:
                "Sri Chaitanya Junior Kalashala, Tirupathi, India",
            degree: "Class 12",
            field: "Maths, Physics & Science",
            period: "2006-2008",
            GPA: "94.2%",
        },
        {
            institution: "Rayalaseema Public School, Tirupati, India",
            degree: "SSC",
            field: "General Studies",
            period: "2005-2006",
            GPA: "83%",
        },
    ],
    certifications: [],
    languages: {
        spoken: [
            { name: "English", level: "Fluent" },
            { name: "Telugu", level: "Native" },
            { name: "Hindi", level: "Fluent" },
        ],
        programming: ["Java", "TypeScript", "JavaScript", "SQL"],
    },
    hobbies: {
        items: [
            {
                name: "Dancing",
                description:
                    "Passionate about various dance forms including contemporary, ballroom, and street dance. Dancing helps me stay creative, express myself artistically, and maintain physical fitness. I enjoy performing at local events and continuously learning new dance styles and techniques.",
                images: [
                    "https://images.unsplash.com/photo-1524330685423-3e1966445abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jaW5nJTIwcGVyZm9ybWFuY2UlMjBzdGFnZXxlbnwxfHx8fDE3NTgwNjI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1706604342065-f36f34513a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBkYW5jZSUyMHN0dWRpb3xlbnwxfHx8fDE3NTgwNjI3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1736552724448-67c581bc3d85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxscm9vbSUyMGRhbmNpbmclMjBjb3VwbGV8ZW58MXx8fHwxNzU4MDYyNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1605450984717-5b2386930f7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBkYW5jZSUyMHVyYmFufGVufDF8fHx8MTc1ODA2Mjc4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                ],
            },
            {
                name: "Badminton",
                description:
                    "Avid badminton player who enjoys both casual games and competitive tournaments. This sport keeps me physically active, helps improve my strategic thinking, and provides great stress relief after long coding sessions. I love the fast-paced nature and precise technique required in badminton.",
                images: [
                    "https://images.unsplash.com/photo-1613918431551-b2ef2720387c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBwbGF5ZXIlMjBhY3Rpb258ZW58MXx8fHwxNzU4MDA5NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1626225015999-2e53f6aaa008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBjb3VydCUyMHNwb3J0c3xlbnwxfHx8fDE3NTgwNjI3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1722003185511-e9320e4a5d00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBzaHV0dGxlY29jayUyMHJhY2tldHxlbnwxfHx8fDE3NTgwNjI3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1626721105368-a69248e93b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjB0b3VybmFtZW50JTIwY29tcGV0aXRpb258ZW58MXx8fHwxNzU4MDYyNzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                ],
            },
            {
                name: "Travelling",
                description:
                    "Love exploring new destinations, experiencing different cultures, and capturing memories through photography. Travel broadens my perspective, inspires creativity in my work, and helps me understand diverse user needs. Whether it's mountain adventures, beach relaxation, or urban exploration, each journey teaches me something new.",
                images: [
                    "https://images.unsplash.com/photo-1631684188521-28b3fd9f40e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NTgwNjI3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1585675444601-25e0f56bc7c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBiYWNrcGFjayUyMGV4cGxvcmV8ZW58MXx8fHwxNzU4MDYyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1694550936154-c4180f6518ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZhY2F0aW9uJTIwdHJvcGljYWwlMjB0cmF2ZWx8ZW58MXx8fHwxNzU4MDYyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1663144239874-9933c251d128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdHJhdmVsJTIwdXJiYW4lMjBleHBsb3JhdGlvbnxlbnwxfHx8fDE3NTgwMzk0MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                ],
            },
        ],
    },
    background: {
        bio: "Venkata Sagar Varma Muppala\nSt Louis, MO•(314) 514-5938•sagar.varma8@gmail.com•\nlinkedin.com/in/venkata-sagar-varma-muppala-271ba369\nFullstack Software Architect\nSeasoned Full Stack Developer with 11+ years of experience in building scalable applications across finance, travel, and retail domains. Expertise in Java, Angular, React.js, React Native, Next.js, NestJS and Node.js with a strong grasp of microservices, DevOps tools, and modern UI frameworks. Passionate about integrating AI tools into daily development workflows for improved productivity and faster delivery.",
        timeline: [
            {
                year: "2014",
                title: "Started Software Engineering Journey",
                description:
                    "Began career as a Software Engineer at Infosys, focusing on Java programming fundamentals and building solid foundation in enterprise application development.",
                icon: "GraduationCap",
                company: "Infosys Ltd",
                role: "Software Engineer",
            },
            {
                year: "2018",
                title: "Evolved to Full Stack Developer",
                description:
                    "Advanced to Senior Software Engineer at Analytics Quotient, mastering Angular, Java, and D3 Charts while building comprehensive KPI Dashboards for data visualization.",
                icon: "Code",
                company: "Analytics Quotient",
                role: "Senior Software Engineer",
            },
            {
                year: "2019",
                title: "Leadership & Mentoring Expertise",
                description:
                    "Transitioned to Senior Software Engineer at Amadeus Labs, gaining valuable experience in team management and mentoring junior developers while expanding technical skills.",
                icon: "Users",
                company: "Amadeus Labs",
                role: "Senior Software Engineer",
            },
            {
                year: "2021",
                title: "Team Leadership & Full SDLC Ownership",
                description:
                    "Promoted to Technical Lead at Wells Fargo, leading full stack development teams through complete software development lifecycle including requirements gathering, design, development, testing, CI/CD, and maintenance.",
                icon: "Briefcase",
                company: "Wells Fargo India",
                role: "Technical Lead",
            },
            {
                year: "2024",
                title: "Software Architect & Innovation Leader",
                description:
                    "Advanced to Software Architect III at Sira Soft Solutions, focusing on individual contribution, exploring cutting-edge technologies, and identifying optimal tech stacks for scalable product growth and innovation.",
                icon: "Rocket",
                company: "Sira Soft Solutions Inc",
                role: "Software Architect III",
            },
        ],
    },
    projects: [
        {
            name: "EduManage - Mobile School Management App",
            description:
                "Multi-role mobile app (Students, Teachers, Parents, Admins) with role-based dashboards, real-time notifications, attendance, assignments, schedules with conflict detection, chat, newsletters, fee tracking, and admin analytics.",
            tech: [
                "React Native",
                "Expo",
                "TypeScript",
                "NativeWind",
                "Gluestack UI",
                "Supabase",
                "NestJS",
                "Zustand",
            ],
            image:
                "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            link: "",
            screenshots: [
                em01,
                em02a,
                em02d,
                em03,
                em04,
                em05,
                em06,
                em07,
                em07a,
                em08,
                em09,
                em10,
                em11,
                em12,
            ],
        },
        {
            name: "NutriFind - Nutrition Tracking App",
            description:
                "AI-assisted cross-platform app to search foods and view detailed nutrition with secure auth, light/dark themes, and polished UX.",
            tech: [
                "React Native",
                "Expo",
                "TypeScript",
                "React Navigation",
                "NativeWind",
            ],
            image:
                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            link: "",
            screenshots: [
                nf01,
                nf02,
                nf03a,
                nf03,
                nf04,
                nf05,
                nf06,
            ],
        },
    ],
    testimonials: [],
    contact: {
        email: "sagar.varma8@gmail.com",
        linkedin:
            "https://linkedin.com/in/venkata-sagar-varma-muppala-271ba369",
        github: "https://github.com/sagar465",
    },
} as const;

export default resumeData;