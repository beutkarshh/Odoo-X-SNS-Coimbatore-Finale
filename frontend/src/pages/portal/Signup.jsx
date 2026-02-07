import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import authService from '../../lib/services/authService.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { AlertCircle, CheckCircle, Clock, User, Users } from 'lucide-react';
import { Role } from '../../data/constants.js';

export default function PortalSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer', // 'customer' or 'internal'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.userType === 'internal') {
      // For internal staff, show message that this feature requires admin approval
      // Note: This would need a separate endpoint for requesting internal access
      setError('Internal staff registration requires administrator approval. Please contact your admin.');
      setIsLoading(false);
      return;
    } else {
      // Register customer via API
      const result = await authService.register(
        formData.name,
        formData.email,
        formData.password
      );

      if (result.success) {
        // Auto-login after successful registration
        const loginResult = await login(formData.email, formData.password);
        
        if (loginResult.success) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/portal/dashboard');
          }, 1500);
        } else {
          // Registration successful but login failed (shouldn't happen)
          setSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    }

    setIsLoading(false);
  };

  if (pendingApproval) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full">
              <Clock className="w-8 h-8 text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Request Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Your internal user registration request has been submitted to the administrator.
            </p>
            <div className="p-4 bg-muted/50 rounded-md mb-6">
              <p className="text-sm text-foreground font-medium">Waiting for Admin Approval</p>
              <p className="text-xs text-muted-foreground mt-1">
                You will be able to login once your request is approved by an administrator.
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Account Created!</h2>
            <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign up to start managing your subscriptions
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <Label className="form-label mb-3 block">Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleUserTypeChange('customer')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'customer'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <User className={`w-6 h-6 mx-auto mb-2 ${formData.userType === 'customer' ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-medium ${formData.userType === 'customer' ? 'text-primary' : 'text-foreground'}`}>
                  Customer
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage subscriptions
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('internal')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'internal'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Users className={`w-6 h-6 mx-auto mb-2 ${formData.userType === 'internal' ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-medium ${formData.userType === 'internal' ? 'text-primary' : 'text-foreground'}`}>
                  Internal Staff
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires approval
                </p>
              </button>
            </div>
          </div>

          {formData.userType === 'internal' && (
            <div className="mb-6 p-3 bg-info/10 border border-info/20 rounded-md text-sm text-info">
              <p className="font-medium">Internal Staff Registration</p>
              <p className="text-xs mt-1 opacity-80">
                Your request will be sent to an administrator for approval before you can access the system.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="form-label">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="form-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="form-label">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="form-label">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : formData.userType === 'internal' ? 'Submit Request' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
