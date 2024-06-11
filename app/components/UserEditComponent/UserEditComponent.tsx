import React, { useCallback, useState, useEffect, ChangeEvent } from "react";
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
  const [selectedType, setSelectedType] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<IUserList>>({});

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
        setSelectedType(data[0].Roles_idRole);
        setFormData(data[0]);
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

  const handleInputChange = (field: keyof IUserList, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUserChange = (
    index: number,
    changes: Partial<IUserList>
  ): void => {
    setUserListData((current) =>
      current.map((user, idx) =>
        idx === index ? { ...user, ...changes } : user
      )
    );
  };

  const handleSave = () => {
    if (formData && userListData.length > 0) {
      handleUpdateUser({ ...userListData[0], ...formData });
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topContainer}>
        <h2>{languageValues.userList.editUser}</h2>
        <div className={styles.elementContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="name">{languageValues.userList.name}:</label>
          </div>
          <div className={styles.valueContainer}></div>
          <p>{formData.name}</p>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="email">{languageValues.userList.email}:</label>
          </div>
          <div className={styles.valueContainer}>
            <input
              type="text"
              value={formData.email || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange("email", e.target.value)
              }
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="role">{languageValues.userList.role}:</label>
          </div>
          <div className={styles.valueContainer}>
            <select
              value={selectedType}
              onChange={(e) => {
                const newType = parseInt(e.target.value, 10);
                setSelectedType(newType);
                handleInputChange("Roles_idRole", newType);
              }}
              className={styles.select}
            >
              <option value={1}>{languageValues.userList.administrator}</option>
              <option value={2}>{languageValues.userList.internal}</option>
              <option value={3}>{languageValues.userList.external}</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <button className={styles.buttonSave} onClick={handleSave}>
          {languageValues.userList.saveButton}
        </button>
      </div>
    </div>
  );
};

export default UserList;
