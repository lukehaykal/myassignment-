'use client'; // ensures this is a client component

import { useEffect, useState } from 'react';
import { User } from './types/user';

export default function OnlineStatusManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserId, setNewUserId] = useState('');

  // Fetch users only on client
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`/api/users/`);
        if (res.ok) {
          const data = await res.json();
          // Map to consistent User type
          const mappedUsers: User[] = data.map((user: any) => ({
            id: user.id,
            name: user.name,
            lineStatus: user.lineStatus,
          }));
          setUsers(mappedUsers);
        } else {
          console.log('No data returned');
        }
      } catch (err) {
        console.log('Error fetching users', err);
      }
    };

    fetchAll();
  }, []);

  // Toggle online/offline status
  const toggleStatus = async (id: number) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;

    const newStatus = current.lineStatus === 'online' ? 'offline' : 'online';

    const res = await fetch(`/api/users?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: current.name, lineStatus: newStatus }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, lineStatus: newStatus } : u))
      );
    }
  };

  // Add a new user
  const addUser = async () => {
    if (!newUserId) return;

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUserId, lineStatus: 'offline' }),
    });

    if (res.ok) {
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setNewUserId('');
    } else {
      console.log('Failed to add user');
    }
  };

  // Delete a user
  const deleteID = async (id: number) => {
    const res = await fetch(`/api/users?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      console.log('Delete failed');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Presence (Online/Offline)</h2>

      {/* Input to add a new user */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="Enter user ID"
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button
          onClick={addUser}
          style={{ padding: '0.5rem', backgroundColor: 'lightblue' }}
        >
          Add User
        </button>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{user.name}</strong> —{' '}
            <span
              style={{
                color: user.lineStatus === 'online' ? 'green' : 'gray',
                fontWeight: 'bold',
              }}
            >
              {user.lineStatus}
            </span>
            <button
              onClick={() => toggleStatus(user.id)}
              style={{ color: 'blue', marginLeft: '1rem' }}
            >
              Toggle
            </button>
            <button
              onClick={() => deleteID(user.id)}
              style={{ color: 'red', marginLeft: '1rem' }}
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
