import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

export default function Home() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getData = async () => {
    const url = `${API_URL}/rating`;
    const response = await fetch(url);
    const fetched = await response.json();
    setData(fetched);
  };

  const updateUserRating = async (username) => {
    const url = `${API_URL}/user/${username}/rating`;
    const response = await fetch(url, { method: 'PUT' });
    return response.status === 200;
  };

  const handleUsernameChange = async (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = async (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/user`;
    const targetUsername = username;
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        username: targetUsername,
        password,
      })
    });
    if (response.status === 200) {
      await updateUserRating(targetUsername);
      setUsername('');
      setPassword('');
      getData();
    } else if (response.status === 400) {
      window.alert('Username exists');
    } else {
      window.alert('Error');
    }
  };

  const handleDelete = async (usernameToDelete) => {
    const url = `${API_URL}/user`;
    const passwordInput = prompt('Please type in password');
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        username: usernameToDelete,
        password: passwordInput,
      })
    });
    if (response.status === 200) {
      getData();
    } else {
      window.alert('Invalid password');
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sort by Rating - Leetcode Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
        <Image src="/LeetCode_logo_black.png" alt="Leetcode logo" width="64" height="64" /><br/>
        Vanilla Coding Leaderboard
        </h1>

        <span className={styles.updateDesc}>(Updated every day 23:00 UTC)</span>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>username</th>
              <th>rating</th>
              <th>top percentage</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(row => <tr key={row.username}>
                <td><a href={`https://leetcode.com/${row.username}`} target="_blank">{row.username}</a></td>
                <td>{Math.round(row.rating)}</td>
                <td>{(row.top_percentage || 0).toFixed(2)}%</td>
                <td><button onClick={() => handleDelete(row.username)}>x</button></td>
              </tr>)
            }
          </tbody>
        </table>

        <hr/>
        <div>
          <form onSubmit={handleSubmit}>
            <h3>Add a user</h3>
            <div>
              <label>
                Username:
                <input type='text' value={username} onChange={handleUsernameChange} />
              </label>
            </div>
            <div>
              <label>
                Password (for deletion):
                <input type='text' value={password} onChange={handlePasswordChange} />
              </label>
            </div>
            <input type='submit' />
          </form>
        </div>
      </main>
    </div>
  )
}
