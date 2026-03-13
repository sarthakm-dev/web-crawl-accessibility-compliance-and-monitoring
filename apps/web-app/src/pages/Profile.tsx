import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type UserType } from '../../../../packages/shared-types/user.types';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch {
        toast.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-red-500">Failed to load profile</div>;
  }

  const role = user.roles?.[0] ?? 'User';

  return (
    <div className="md:flex-1 flex flex-col items-center md:items-start min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 md:p-8 p-3">
      <div className="mb-3 md:ml-[15%] ml-[8%]">
        <h1 className="text-3xl mb-1 font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 text-md">
          View your account information and access level
        </p>
      </div>

      <Card className="rounded-2xl md:w-160 md:h-100 w-80  px-2 md:ml-[15%] ml-[8%] flex items-center justify-center shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex flex-col justify-center md:flex md:flex-row md:w-160 md:h-100 md:p-4  md:justify-around md:gap-5 items-center">
            <div className="flex flex-col items-center p-10 md:items-start gap-4">
              <Avatar className="md:h-20 md:w-20 bg-blue-500 text-white font-semibold text-xl">
                <AvatarFallback>
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <Button
                variant="destructive"
                className="mt-4 w-full md:w-auto hover:bg-red-500"
                onClick={async () => {
                  try {
                    await api.post('/api/auth/logout');
                  } catch (err) {
                    toast.error('Logout failed:' + err);
                  } finally {
                    useAuthStore.getState().clearUser();
                    navigate('/');
                  }
                }}
              >
                Logout
              </Button>
            </div>
            {/* Profile Card */}
            <div className="md:space-y-6 space-y-2 p-12">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800">
                  {role.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <Badge className="bg-green-100 text-green-700">
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
