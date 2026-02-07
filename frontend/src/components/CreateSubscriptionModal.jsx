import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './Modal.jsx';
import { Button } from './ui/Button.jsx';
import { userService } from '../lib/services/userService.js';
import { planService } from '../lib/services/planService.js';
import { subscriptionService } from '../lib/services/subscriptionService.js';
import { Loader2, UserPlus, Users, ChevronRight, AlertCircle } from 'lucide-react';

export function CreateSubscriptionModal({ open, onOpenChange, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Customer, 2: Plan, 3: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Customer state
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Form state
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', password: '' });
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState('');

  // Load customers and plans on mount
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [customersRes, plansRes] = await Promise.all([
        userService.getCustomers(),
        planService.getAll()
      ]);
      
      if (customersRes.success) {
        setCustomers(customersRes.data);
      }
      if (plansRes.success) {
        // Filter only active plans
        const activePlans = Array.isArray(plansRes.data) 
          ? plansRes.data.filter(p => p.isActive !== false)
          : [];
        setPlans(activePlans);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setError('');
    setIsNewCustomer(false);
    setSelectedCustomerId('');
    setNewCustomer({ name: '', email: '', password: '' });
    setSelectedPlanId('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setExpirationDate('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCustomer(prev => ({ ...prev, password }));
  };

  const validateStep1 = () => {
    if (isNewCustomer) {
      if (!newCustomer.name.trim()) {
        setError('Customer name is required');
        return false;
      }
      if (!newCustomer.email.trim() || !newCustomer.email.includes('@')) {
        setError('Valid email is required');
        return false;
      }
      if (!newCustomer.password || newCustomer.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    } else {
      if (!selectedCustomerId) {
        setError('Please select a customer');
        return false;
      }
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!selectedPlanId) {
      setError('Please select a plan');
      return false;
    }
    if (!startDate) {
      setError('Start date is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let customerId = selectedCustomerId;

      // Create new customer if needed
      if (isNewCustomer) {
        const customerRes = await userService.createCustomer({
          name: newCustomer.name.trim(),
          email: newCustomer.email.trim().toLowerCase(),
          password: newCustomer.password
        });

        if (!customerRes.success) {
          throw new Error(customerRes.message || 'Failed to create customer');
        }
        customerId = customerRes.data.id;
      }

      // Get selected plan details
      const selectedPlan = plans.find(p => p.id === parseInt(selectedPlanId));
      if (!selectedPlan) {
        throw new Error('Selected plan not found');
      }

      // Create subscription
      const subscriptionData = {
        customerId: parseInt(customerId),
        planId: parseInt(selectedPlanId),
        startDate: new Date(startDate).toISOString(),
        expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null,
        lines: [
          {
            productId: selectedPlan.productId || selectedPlan.product?.id,
            quantity: 1,
            unitPrice: selectedPlan.price
          }
        ]
      };

      const result = await subscriptionService.create(subscriptionData);

      if (!result.success) {
        throw new Error(result.message || 'Failed to create subscription');
      }

      // Success!
      handleClose();
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === parseInt(selectedCustomerId));
  const selectedPlan = plans.find(p => p.id === parseInt(selectedPlanId));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? 'Select Customer' : step === 2 ? 'Select Plan' : 'Review & Create'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step
                    ? 'bg-primary text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Step 1: Customer Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsNewCustomer(false); setError(''); }}
                    className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                      !isNewCustomer
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Users className="w-5 h-5 mb-2" />
                    <div className="font-medium">Existing Customer</div>
                    <div className="text-xs text-muted-foreground">Select from registered customers</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsNewCustomer(true); setError(''); }}
                    className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                      isNewCustomer
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <UserPlus className="w-5 h-5 mb-2" />
                    <div className="font-medium">New Customer</div>
                    <div className="text-xs text-muted-foreground">Create a new customer account</div>
                  </button>
                </div>

                {!isNewCustomer ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Customer</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">-- Select a customer --</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </option>
                      ))}
                    </select>
                    {customers.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        No customers found. Create a new customer instead.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Customer Name *</label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@company.com"
                        className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCustomer.password}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Min 6 characters"
                          className="flex-1 p-2 border border-border rounded-md bg-background text-foreground"
                        />
                        <Button type="button" variant="outline" onClick={generatePassword}>
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Share this password with the customer for their first login
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Plan Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Plan *</label>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {plans.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No active plans available
                      </p>
                    ) : (
                      plans.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlanId(plan.id.toString())}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            selectedPlanId === plan.id.toString()
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {plan.product?.name || 'No product'} • {plan.billingPeriod}
                              </div>
                            </div>
                            <div className="text-lg font-bold text-primary">
                              ₹{Number(plan.price).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      min={startDate}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm uppercase text-muted-foreground">Subscription Summary</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Customer</div>
                      <div className="font-medium">
                        {isNewCustomer ? newCustomer.name : selectedCustomer?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isNewCustomer ? newCustomer.email : selectedCustomer?.email}
                      </div>
                      {isNewCustomer && (
                        <div className="text-xs text-green-600 mt-1">✓ New account will be created</div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground">Plan</div>
                      <div className="font-medium">{selectedPlan?.name}</div>
                      <div className="text-sm text-primary font-semibold">
                        ₹{Number(selectedPlan?.price || 0).toLocaleString('en-IN')}/{selectedPlan?.billingPeriod?.toLowerCase()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                    <div>
                      <div className="text-xs text-muted-foreground">Start Date</div>
                      <div className="font-medium">{new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">End Date</div>
                      <div className="font-medium">
                        {expirationDate 
                          ? new Date(expirationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Not set'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">Initial Status</div>
                    <div className="inline-block mt-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">
                      DRAFT
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can change the status after creation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} disabled={loadingData}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Subscription'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
