import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Bell, Moon, Sun, Shield, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function UserProfile() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: true,
    updateFrequency: '3',
  });

  const handleSave = () => {
    toast.success('Settings Saved', {
      description: 'Your preferences have been updated successfully',
    });
  };

  return (
    <div className="space-y-6">
      {/* User info */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-white mb-6">Profile Information</h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-white mb-1">{user?.name}</p>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0a0e27] rounded-xl border border-gray-800">
            <div>
              <p className="text-white mb-1">Email Notifications</p>
              <p className="text-gray-400">Receive alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, emailNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0a0e27] rounded-xl border border-gray-800">
            <div>
              <p className="text-white mb-1">Push Notifications</p>
              <p className="text-gray-400">Receive browser notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, pushNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-gray-300 mb-2">Update Frequency</label>
            <select
              value={preferences.updateFrequency}
              onChange={(e) =>
                setPreferences({ ...preferences, updateFrequency: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
            >
              <option value="1">1 second (fast)</option>
              <option value="3">3 seconds (default)</option>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds (slow)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security settings */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security
        </h3>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-[#0a0e27] rounded-xl border border-gray-800 hover:bg-gray-800/50 transition">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-white">Change Password</p>
                <p className="text-gray-400">Update your account password</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-lg shadow-blue-500/25"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}