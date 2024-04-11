import React, { useCallback, useState, useEffect } from "react";
import { IUserList } from "../../interfaces/IIUserList";
import styles from "./UserEdit.module.css";
import { apiURL } from "@/Constants";

interface UserListProps {
  languageValues: { userList: { [key: string]: string } };
  userId: number;
}

const UserList: React.FC<UserListProps> = ({ languageValues, userId }) => {
  const [userListData, setUserListData] = useState<IUserList[]>([]);

  const fetchUserList = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user list");
      }
      const data: IUserList[] = await response.json();
      setUserListData(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const handleUpdateUser = async (user: IUserList) => {
    try {
      const response = await fetch(`${apiURL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      fetchUserList();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topContainer}>
        <h2>{languageValues.userList.editUser}</h2>
        <div className={styles.elementContainer}>
          <label htmlFor="name">{languageValues.userList.name}</label>
          <input
            type="text"
            value={userListData.length > 0 ? userListData[0].name : "Name 0"}
            onChange={(e) =>
              setUserListData([{ ...userListData[0], name: e.target.value }])
            }
          />
        </div>
        <div className={styles.elementContainer}>
          <label htmlFor="email">{languageValues.userList.email}</label>
          <input
            type="text"
            value={
              userListData.length > 0
                ? userListData[0].email
                : "random0@gmailcom"
            }
            onChange={(e) =>
              setUserListData([{ ...userListData[0], email: e.target.value }])
            }
          />
        </div>
        <div className={styles.elementContainer}>
          <label htmlFor="role">{languageValues.userList.role}</label>
          <select
            value={userListData.length > 0 ? userListData[0].role : ""}
            onChange={(e) =>
              setUserListData([{ ...userListData[0], role: e.target.value }])
            }
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="internal">Internal Client</option>
            <option value="external">External Client</option>
          </select>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <button
          className={styles.buttonSave}
          onClick={() => handleUpdateUser(userListData[0])}
        >
          {languageValues.userList.saveButton}
        </button>
        <button className={styles.buttonCancel} onClick={() => fetchUserList()}>
          {languageValues.userList.cancelButton}
        </button>
      </div>
    </div>
  );
};

export default UserList;
