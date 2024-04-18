import React, { useCallback, useState, useEffect } from "react";
import { IUserList } from "../../interfaces/IIUserList";
import styles from "./UserEdit.module.css";
import { apiURL } from "@/Constants";
import { showErrorToast, showSuccessToast } from "@/app/lib/toastUtils";

interface UserListProps {
  languageValues: { userList: { [key: string]: string } };
  Roles_idRole: number;
}

const UserList: React.FC<UserListProps> = ({
  languageValues,
  Roles_idRole,
}) => {
  const [userListData, setUserListData] = useState<IUserList[]>([]);

  const fetchUserList = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/users/${Roles_idRole}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
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
  }, [Roles_idRole]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const handleUpdateUser = async (user: IUserList) => {
    try {
      const { email, Roles_idRole: userTypeId } = user;
      console.log("userTypeId", userTypeId);
      console.log("Selected user", user);
      const response = await fetch(
        `${apiURL}/users/updatePermissions/${user.Roles_idRole}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email, userTypeId }),
        }
      );
      console.log("body", JSON.stringify({ email, userTypeId }));
      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      fetchUserList();
      const responseData = await response.json();
      if (responseData.message === `User permissions updated`) {
        showSuccessToast("User updated successfully", {
          autoClose: 1000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorToast("Failed to update user", {
        autoClose: 1000,
        position: "bottom-right",
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserListData([
      { ...userListData[0], name: e.target.value },
      ...userListData.slice(1),
    ]);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserListData([
      { ...userListData[0], email: e.target.value },
      ...userListData.slice(1),
    ]);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserListData([
      {
        ...userListData[0],
        Roles_idRole: parseInt(e.target.value, 10),
      },
      ...userListData.slice(1),
    ]);
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
            onChange={handleNameChange}
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
            onChange={handleEmailChange}
          />
        </div>
        <div className={styles.elementContainer}>
          <label htmlFor="role">{languageValues.userList.role}</label>
          <select
            value={userListData.length > 0 ? userListData[0].Roles_idRole : ""}
            onChange={handleRoleChange}
          >
            <option value={1}>Administrator</option>
            <option value={2}>Internal Client</option>
            <option value={3}>External Client</option>
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
