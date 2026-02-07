import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { 
  Users, CreditCard, FileText, Shield, ArrowRight, Package, 
  CheckCircle, TrendingUp, Clock, Zap, BarChart3, Lock,
  Sparkles, Target, RefreshCw, Bell
} from 'lucide-react';
import { useState } from 'react';

function FeatureCard({ icon, title, description, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-4 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label, icon }) {
  return (
    <div className="text-center p-6 bg-primary/5 rounded-lg border border-border">
      <div className="flex justify-center mb-3 text-primary">
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ProcessStep({ number, title, description, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {number}
        </div>
        {!isLast && <div className="w-0.5 h-full bg-primary/50 mt-2"></div>}
      </div>
      <div className="pb-8 flex-1">
        <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('admin');

  const roleFeatures = {
    admin: [
      'Full system control and configuration',
      'Manage all products, plans, and pricing',
      'User management and role assignment',
      'Complete subscription lifecycle control',
      'Advanced reporting and analytics'
    ],
    internal: [
      'Process subscription workflows',
      'Generate and manage invoices',
      'Handle customer subscriptions',
      'Access operational dashboards',
      'Process payments and renewals'
    ],
    customer: [
      'Self-service subscription management',
      'View and download invoices',
      'Update profile and preferences',
      'Track subscription status',
      'Access customer portal 24/7'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="SubsManager" className="w-10 h-10" />
            <span className="text-xl font-bold text-primary">
              SubsManager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5 hover:text-primary">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 shadow-md">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Manage Subscriptions
            <span className="block mt-2 text-primary">
              Like an Enterprise
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            A powerful ERP-style platform for complete subscription lifecycle management. 
            Handle products, plans, subscriptions, invoices, and payments with enterprise-grade 
            role-based access control.
          </p>
          
          <div className="flex items-center justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg text-base px-8">
                Get Started
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            <StatCard value="100%" label="Automated Billing" icon={<Zap size={24} />} />
            <StatCard value="3" label="User Roles" icon={<Users size={24} />} />
            <StatCard value="24/7" label="Portal Access" icon={<Clock size={24} />} />
            <StatCard value="∞" label="Subscriptions" icon={<TrendingUp size={24} />} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Subscriptions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features designed for subscription-based businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Package size={28} />}
              title="Product & Plan Management"
              description="Create unlimited products with flexible pricing. Define subscription plans with custom billing periods, trial periods, and renewal options."
              delay={0}
            />
            <FeatureCard
              icon={<RefreshCw size={28} />}
              title="Complete Lifecycle Workflow"
              description="Track subscriptions from Draft → Quotation → Confirmed → Active → Closed with enforced state transitions and business rules."
              delay={100}
            />
            <FeatureCard
              icon={<CreditCard size={28} />}
              title="Smart Invoice Management"
              description="Automated invoice generation with status tracking. Handle payments, refunds, and reconciliation seamlessly."
              delay={200}
            />
            <FeatureCard
              icon={<Shield size={28} />}
              title="Role-Based Security"
              description="Three distinct roles (Admin, Internal, Customer) with granular permissions ensuring data security and workflow integrity."
              delay={300}
            />
            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="Advanced Reporting"
              description="Real-time analytics and insights. Track MRR, ARR, churn rates, and customer lifetime value with powerful dashboards."
              delay={400}
            />
            <FeatureCard
              icon={<Bell size={28} />}
              title="Automated Notifications"
              description="Keep customers informed with automated emails for renewals, payments, invoices, and subscription status changes."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple workflow to get your subscription business running
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <ProcessStep 
              number="1"
              title="Create Products & Plans"
              description="Define your products and create flexible subscription plans with custom pricing, billing periods, and trial options."
            />
            <ProcessStep 
              number="2"
              title="Onboard Customers"
              description="Customers sign up, choose plans, and get instant access to their personalized portal to manage subscriptions."
            />
            <ProcessStep 
              number="3"
              title="Automate Billing"
              description="System automatically generates invoices, processes payments, and sends notifications for renewals and updates."
            />
            <ProcessStep 
              number="4"
              title="Track & Grow"
              description="Monitor subscription metrics, analyze revenue trends, and make data-driven decisions to grow your business."
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* Role-Based Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Every Role
            </h2>
            <p className="text-lg text-muted-foreground">
              Tailored features for admins, staff, and customers
            </p>
          </div>
          
          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <Lock size={18} className="inline mr-2" />
              Admin
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'internal'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <Users size={18} className="inline mr-2" />
              Internal Staff
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'customer'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <Target size={18} className="inline mr-2" />
              Customer
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              {activeTab === 'admin' && <><Lock size={24} className="text-primary" /> Administrator Capabilities</>}
              {activeTab === 'internal' && <><Users size={24} className="text-primary" /> Internal Staff Features</>}
              {activeTab === 'customer' && <><Target size={24} className="text-primary" /> Customer Portal</>}
            </h3>
            <ul className="space-y-3">
              {roleFeatures[activeTab].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Get Started Section - Refined */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Started Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join SubsManager and streamline your subscription business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* New User Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-card border border-border rounded-xl p-8 text-center h-full flex flex-col hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">New User?</h3>
                <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                  Create an account to start managing your subscriptions or join as internal staff.
                </p>
                <Link to="/signup" className="mt-auto">
                  <Button className="w-full bg-primary hover:bg-primary/90 shadow-md text-base py-6">
                    Create Account
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Existing User Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-primary/15 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-card border border-border rounded-xl p-8 text-center h-full flex flex-col hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Shield size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Existing User?</h3>
                <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                  Sign in to access your dashboard - works for all user types.
                </p>
                <Link to="/login" className="mt-auto">
                  <Button 
                    className="w-full border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-base py-6" 
                    variant="outline"
                  >
                    Sign In
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="SubsManager" className="w-8 h-8" />
              <span className="text-lg font-bold text-primary">
                SubsManager
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Enterprise-grade subscription management platform built for modern businesses
            </p>
            <p className="text-xs text-muted-foreground">
              © 2026 SubsManager. Built with React, Tailwind CSS, and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
