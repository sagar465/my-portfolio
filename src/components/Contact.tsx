import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Linkedin, Github, Twitter, Send, MapPin, Globe, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContactProps {
  contact: {
    email: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    portfolio?: string;
  };
}

export function Contact({ contact }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Method 1: Web3Forms (Free, no signup needed)
  const sendEmailWithWeb3Forms = async (data: typeof formData) => {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_KEY', // Get free key from web3forms.com
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        to: 'sagar.varma8@gmail.com',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    return response.json();
  };

  // Method 2: EmailJS (Free tier available)
  const sendEmailWithEmailJS = async (data: typeof formData) => {
    // You can uncomment this when you set up EmailJS
    // import emailjs from '@emailjs/browser';
    
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      to_email: 'sagar.varma8@gmail.com',
    };

    // Uncomment when EmailJS is configured:
    // return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY');
    throw new Error('EmailJS not configured - set up at emailjs.com');
  };

  // Method 3: Netlify Forms (if hosted on Netlify)
  const sendEmailWithNetlify = async (data: typeof formData) => {
    const formData = new FormData();
    formData.append('form-name', 'contact');
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('message', data.message);

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to send email via Netlify');
    }
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try multiple methods in order of preference
      
      // Method 1: Try Web3Forms (most reliable, no setup needed)
      try {
        await sendEmailWithWeb3Forms(formData);
        toast.success("Message sent successfully! I'll get back to you within 24 hours.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        return;
      } catch (web3Error) {
        console.log('Web3Forms failed, trying EmailJS...', web3Error);
      }

      // Method 2: Try EmailJS (if configured)
      try {
        await sendEmailWithEmailJS(formData);
        toast.success("Message sent successfully! I'll get back to you within 24 hours.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        return;
      } catch (emailjsError) {
        console.log('EmailJS failed, trying Netlify...', emailjsError);
      }

      // Method 3: Try Netlify Forms (if on Netlify)
      try {
        await sendEmailWithNetlify(formData);
        toast.success("Message sent successfully! I'll get back to you within 24 hours.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        return;
      } catch (netlifyError) {
        console.log('Netlify failed, falling back to mailto...', netlifyError);
      }

      // Fallback Method: Direct mailto (opens user's email client)
      const mailtoUrl = `mailto:sagar.varma8@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      
      window.open(mailtoUrl, '_self');
      
      toast.success("Opening your email client with pre-filled message. Please send it to complete your message!");
      setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      console.error('All email methods failed:', error);
      toast.error("Unable to send message. Please contact me directly at sagar.varma8@gmail.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build social links dynamically based on available data
  const allPossibleLinks = [
    {
      name: 'Email',
      href: contact.email ? `mailto:${contact.email}` : null,
      icon: Mail,
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'LinkedIn',
      href: contact.linkedin || null,
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'GitHub',
      href: contact.github || null,
      icon: Github,
      color: 'from-gray-700 to-gray-900'
    },
    {
      name: 'Twitter',
      href: contact.twitter || null,
      icon: Twitter,
      color: 'from-sky-400 to-sky-600'
    },
    {
      name: 'Website',
      href: contact.website || null,
      icon: Globe,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Portfolio',
      href: contact.portfolio || null,
      icon: User,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Filter out links that don't have a href value
  const socialLinks = allPossibleLinks.filter(link => link.href);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-border/60 dark:border-border/70">
          <CardContent className="p-8">
            <h3 className="text-2xl font-medium mb-6">Send me a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What would you like to discuss?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell me about your project or idea..."
                  rows={5}
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        {/* Location & Availability */}
        <Card className="border-border/60 dark:border-border/70">
          <CardContent className="p-8">
            <h3 className="text-2xl font-medium mb-6">Let's connect</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>St Louis, MO</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span>Available for new opportunities</span>
              </div>
            </div>

            <p className="text-foreground/70 leading-relaxed mb-6">
              I'm always interested in hearing about new projects, opportunities, 
              and collaborations. Whether you're a startup looking to build your 
              MVP or an established company wanting to scale your platform, let's discuss 
              how we can work together.
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Usually responds within 24 hours</span>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Card className="border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {link.name}
                    </span>
                  </CardContent>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}