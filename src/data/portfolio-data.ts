export const portfolioData = {
  personal: {
    name: "Alex Chen",
    title: "Full Stack Software Architect & Founder",
    tagline: "Building scalable EdTech solutions that empower learning",
    bio: "Passionate about creating innovative educational technology solutions that scale. Currently growing EduManage while exploring the intersection of nutrition and learning optimization.",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  objective: {
    title: "Mission & Vision",
    description: "To revolutionize education through scalable technology solutions that make learning more accessible, engaging, and effective for students worldwide.",
    goals: [
      "Scale EduManage to 10,000+ educational institutions",
      "Launch innovative nutrition-learning optimization platform",
      "Mentor the next generation of EdTech entrepreneurs",
      "Build sustainable, profitable products that create real impact"
    ]
  },
  skills: {
    backend: {
      title: "Backend Development",
      technologies: ["Java", "Node.js", "NestJS", "Python", "GraphQL", "REST APIs", "Microservices"]
    },
    frontend: {
      title: "Frontend Development", 
      technologies: ["React", "React Native", "Angular", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js"]
    },
    cloud: {
      title: "Cloud & Infrastructure",
      technologies: ["Supabase", "Firebase", "AWS", "Google Cloud", "Docker", "Kubernetes", "PostgreSQL", "MongoDB"]
    },
    ai: {
      title: "AI & Development Tools",
      technologies: ["GitHub Copilot", "Cursor", "Zencoder", "OpenAI API", "TensorFlow", "Machine Learning"]
    }
  },
  experience: [
    {
      id: 1,
      company: "EduManage",
      role: "Founder & CEO",
      period: "2022 - Present",
      location: "San Francisco, CA",
      description: "Founded and leading a comprehensive educational management platform serving K-12 institutions.",
      achievements: [
        "Built platform serving 500+ schools with 50,000+ active users",
        "Raised $2M in seed funding from prominent EdTech investors",
        "Reduced administrative workload by 60% for partner institutions",
        "Led team of 12 engineers across frontend, backend, and mobile"
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "React Native"]
    },
    {
      id: 2,
      company: "TechFlow Solutions",
      role: "Senior Software Architect",
      period: "2020 - 2022",
      location: "Seattle, WA",
      description: "Led architecture decisions for enterprise-scale applications serving Fortune 500 clients.",
      achievements: [
        "Designed microservices architecture handling 1M+ daily transactions",
        "Reduced system latency by 40% through optimization initiatives",
        "Mentored 8 junior developers and established coding standards",
        "Implemented CI/CD pipelines reducing deployment time by 75%"
      ],
      technologies: ["Java", "Spring Boot", "Kubernetes", "Angular", "MongoDB"]
    },
    {
      id: 3,
      company: "StartupLab",
      role: "Full Stack Developer",
      period: "2018 - 2020",
      location: "Austin, TX",
      description: "Developed MVP products for early-stage startups across various industries.",
      achievements: [
        "Built 5 successful MVPs that raised combined $10M+ in funding",
        "Delivered projects 20% ahead of schedule on average",
        "Established rapid prototyping workflows for client projects",
        "Collaborated with designers to create intuitive user experiences"
      ],
      technologies: ["React", "Node.js", "Firebase", "React Native", "TypeScript"]
    }
  ],
  education: [
    {
      institution: "Stanford University",
      degree: "M.S. Computer Science",
      field: "Human-Computer Interaction",
      period: "2016 - 2018",
      gpa: "3.9/4.0"
    },
    {
      institution: "UC Berkeley",
      degree: "B.S. Computer Science",
      field: "Software Engineering",
      period: "2012 - 2016",
      gpa: "3.7/4.0"
    }
  ],
  certifications: [
    "AWS Solutions Architect Professional",
    "Google Cloud Professional Developer",
    "Certified Scrum Master (CSM)",
    "MongoDB Certified Developer"
  ],
  languages: {
    spoken: [
      { name: "English", level: "Native" },
      { name: "Mandarin Chinese", level: "Fluent" },
      { name: "Spanish", level: "Conversational" }
    ],
    programming: [
      "JavaScript/TypeScript", "Java", "Python", "Go", "Swift", "Kotlin", "SQL", "GraphQL"
    ]
  },
  hobbies: [
    {
      name: "Travel Photography",
      description: "Documenting cultures and landscapes around the world",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
      ]
    },
    {
      name: "UI/UX Design",
      description: "Creating beautiful and functional digital experiences",
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop"
      ]
    },
    {
      name: "Technology Tinkering",
      description: "Building IoT projects and experimenting with emerging tech",
      images: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop"
      ]
    }
  ],
  projects: [
    {
      id: 1,
      name: "EduManage Platform",
      description: "Comprehensive educational management system for K-12 institutions with student tracking, grade management, and parent communication tools.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "React Native"],
      links: {
        live: "https://edumanage.com",
        github: "https://github.com/alexchen/edumanage"
      },
      highlights: [
        "500+ schools using the platform",
        "50,000+ active users",
        "99.9% uptime SLA",
        "Mobile app with 4.8★ rating"
      ]
    },
    {
      id: 2,
      name: "NutriLearn AI",
      description: "AI-powered platform connecting nutrition optimization with learning performance for students and professionals.",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop",
      technologies: ["Python", "TensorFlow", "React", "FastAPI", "MongoDB"],
      links: {
        live: "https://nutrilearn.ai",
        github: "https://github.com/alexchen/nutrilearn"
      },
      highlights: [
        "ML model with 92% accuracy",
        "15% improvement in focus metrics",
        "Research partnership with Stanford",
        "Beta testing with 1,000+ users"
      ]
    },
    {
      id: 3,
      name: "DevFlow CLI",
      description: "Command-line tool for streamlining development workflows with automated testing, deployment, and code quality checks.",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=400&fit=crop",
      technologies: ["Go", "Docker", "GitHub Actions", "CLI"],
      links: {
        github: "https://github.com/alexchen/devflow-cli"
      },
      highlights: [
        "2,000+ GitHub stars",
        "50+ contributors",
        "Used by 500+ developers",
        "Featured in DevTool Weekly"
      ]
    }
  ],
  testimonials: [
    {
      name: "Sarah Johnson",
      role: "Principal at Lincoln Elementary",
      company: "EduManage Client",
      content: "Alex's EduManage platform transformed how we handle student data and parent communication. The intuitive design and robust features have saved our staff countless hours.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Michael Torres",
      role: "CTO",
      company: "EdTech Innovations",
      content: "Working with Alex was exceptional. His technical expertise and product vision helped us build a scalable platform that exceeded our expectations.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ],
  contact: {
    email: "alex@alexchen.dev",
    linkedin: "https://linkedin.com/in/alexchen-dev",
    github: "https://github.com/alexchen",
    twitter: "https://twitter.com/alexchen_dev"
  }
};

export default portfolioData;