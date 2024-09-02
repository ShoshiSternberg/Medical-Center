import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { getUsers } from '../../../../clientServices/UserService';

function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.ID}>
            <td>{index + 1}</td>
            <td>{user.Name}</td>
            <td>{user.Email}</td>
            <td>{user.Phone}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UsersTable;
