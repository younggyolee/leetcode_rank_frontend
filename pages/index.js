import Head from 'next/head'
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getData = async () => {
    const url = `${API_URL}/rating/`;
    const response = await fetch(url);
    const fetched = await response.json();
    setData(fetched);
  };

  const handleUsernameChange = async (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = async (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/user/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        username,
        password,
      })
    });
    if (response.status === 200) {
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
    const url = `${API_URL}/user/`;
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
    <div className="container">
      <Head>
        <title>Leetcode Ranking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Leetcode Ranking
        </h1>

        <table>
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
                <td>{row.top_percentage.toFixed(2)}%</td>
                <td><button onClick={() => handleDelete(row.username)}>x</button></td>
              </tr>)
            }
          </tbody>
        </table>

        <div>
          <h2>Add a user</h2>
          <form onSubmit={handleSubmit}>
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
