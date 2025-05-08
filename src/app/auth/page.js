'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const googleMapsApiKey = 'AIzaSyCmnN-Gpg27gAf4VrtDbITWbnOFBx8ZTp8';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'admin@admin.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      alert('Login successful!');
      router.push('/posts');
    } else {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        const user = users.find((user) => user.email === email && user.email === password);
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userId', user.id);
          alert('Login successful!');
          router.push('/posts');
        } else {
          setError('Invalid email or password');
        }
      } catch (err) {
        console.error('Error during login', err);
        setError('An error occurred, please try again later');
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const schema = {
      firstName: formData.firstName.trim() === '' ? 'First name is required' : '',
      lastName: formData.lastName.trim() === '' ? 'Last name is required' : '',
      email: formData.email.includes('@') ? '' : 'Invalid email address',
      phone: formData.phone.length < 10 ? 'Phone number must be at least 10 characters' : '',
      address: formData.address.trim() === '' ? 'Address is required' : '',
    };

    setErrors(schema);

    if (Object.values(schema).every((msg) => msg === '')) {
      setIsRegistering(false);
    }
  };

  const handleAddressChange = (address) => {
    setFormData({ ...formData, address });
  };

  return (
    <div className="px-4 py-8 sm:p-10 flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 
        bg-white/10 backdrop-blur-lg backdrop-saturate-150 
        rounded-lg border border-white/30 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-6 text-white">
          {isRegistering ? 'Register' : 'Login'}
        </h1>

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-white">Address</label>
              {googleMapsApiKey ? (
                <LoadScript
                  googleMapsApiKey={googleMapsApiKey}
                  libraries={['places']}
                >
                  <GoogleMap
                    mapContainerStyle={{ height: '300px', width: '100%' }}
                    zoom={10}
                    center={{ lat: 0, lng: 0 }}
                  >
                    <Autocomplete>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="border border-gray-300 p-3 w-full rounded-lg bg-white bg-opacity-80"
                        placeholder="Select your address"
                        onBlur={(e) => handleAddressChange(e.target.value)}
                      />
                    </Autocomplete>
                  </GoogleMap>
                </LoadScript>
              ) : (
                <p className="text-sm text-red-500">Map is unavailable. Please try again later.</p>
              )}
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Register
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-white">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegistering(false)}
                className="text-indigo-300 hover:text-indigo-400 transition-colors"
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{' '}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-indigo-300 hover:text-indigo-400 transition-colors"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
