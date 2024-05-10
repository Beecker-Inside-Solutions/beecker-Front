import React, { useCallback, useState, useEffect } from "react";
import { IUserList } from "@/app/interfaces/IIUserList";
import styles from "./UserEdit.module.css";
import { apiURL } from "@/Constants";
import { showErrorToast, showSuccessToast } from "@/app/lib/toastUtils";
import Swal from "sweetalert2";

interface UserListProps {
  languageValues: { userList: { [key: string]: string } };
  Roles_idRole: number;
}

const UserList: React.FC<UserListProps> = ({
  languageValues,
  Roles_idRole,
}) => {
  const [userListData, setUserListData] = useState<IUserList[]>([]);
  const [selectedType, setSelectedType] = useState<number>(1); // Ensure this is a valid and existing role ID.

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
      if (data.length > 0) {
        setSelectedType(data[0].Roles_idRole); // Set initial role based on the first user data fetched
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      showErrorToast("Failed to fetch user list");
    }
  }, [Roles_idRole]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const handleAddNotification = async (user: IUserList) => {
    try {
      const response = await fetch(`${apiURL}/notifications/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: "User modification",
          description: `User ${user.name} has been modified`,
          isActive: true,
          Users_idUsers: user.idUsers,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add notification");
      }
      showSuccessToast(`⚠️ User: ${user.name} has been updated successfully.`);
    } catch (error) {
      console.error("Error adding notification:", error);
      showErrorToast("Failed to add notification");
    }
  };

  const handleUpdateUser = async (user: IUserList) => {
    console.log("Selected Type for Update:", selectedType); // Debugging line
    try {
      const { email, idUsers } = user;
      const response = await fetch(
        `${apiURL}/users/updatePermissions/${idUsers}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email, userTypeId: selectedType }),
        }
      );
      console.log(
        "API Request Body:",
        JSON.stringify({ email, userTypeId: selectedType })
      ); // Further debugging
      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const responseData = await response.json();
      if (responseData.message === "User permissions updated") {
        handleAddNotification(user);
        showSuccessToast("User updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorToast("Failed to update user");
    }
  };
  const handleUserChange = (index: number, changes: Partial<IUserList>) => {
    setUserListData((current) =>
      current.map((user, idx) =>
        idx === index ? { ...user, ...changes } : user
      )
    );
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topContainer}>
        <h2>{languageValues.userList.editUser}</h2>
        <div className={styles.elementContainer}>
          <label htmlFor="name">{languageValues.userList.name}</label>
          <p>{userListData[0]?.name}</p>
        </div>
        <div className={styles.elementContainer}>
          <label htmlFor="email">{languageValues.userList.email}</label>
          <input
            type="text"
            value={userListData[0]?.email || ""}
            onChange={(e) => handleUserChange(0, { email: e.target.value })}
          />
        </div>
        <div className={styles.elementContainer}>
          <label htmlFor="role">{languageValues.userList.role}</label>
          <select
            value={selectedType}
            onChange={(e) => {
              const newType = parseInt(e.target.value, 10); // Ensure correct parsing
              console.log("New selected type:", newType); // Debugging line
              setSelectedType(newType);
            }}
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
          onClick={() => userListData[0] && handleUpdateUser(userListData[0])}
        >
          {languageValues.userList.saveButton}
        </button>
      </div>
    </div>
  );
};

export default UserList;
