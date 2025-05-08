'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/auth');
    } else {
      fetchUsers();
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>

      {/* User list styled boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="cursor-pointer p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        ))}
      </div>

      {/* Modal for selected user */}
      {selectedUser && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedUser.name} Profile</h2>
            <p className="mb-4 text-gray-700">Email: {selectedUser.email}</p>
            <p className="mb-4 text-gray-700">
              Address: {selectedUser.address.street}, {selectedUser.address.city}
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <iframe
                src={`https://www.google.com/maps?q=${selectedUser.address.lat},${selectedUser.address.lng}&z=15&output=embed`}
                width="100%"
                height="300"
                className="border-none rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
