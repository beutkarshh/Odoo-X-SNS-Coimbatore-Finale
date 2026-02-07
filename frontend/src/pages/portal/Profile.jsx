import { useState } from 'react';
import { Layout } from '../../components/Layout/Layout.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function PortalProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout type="portal">
      <PageHeader title="My Profile" />

      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Account Information</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Account Role</Label>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {user?.role || 'Customer'}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      company: user?.company || '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>

        <div className="bg-card border border-border rounded-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
          <Button variant="outline">Change Password</Button>
        </div>

        <div className="bg-card border border-border rounded-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </Layout>
  );
}
