import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaSearch, FaUser, FaCheck, FaArrowRight } from "react-icons/fa";
import api from "../../api/axios";


const CreateGroup = ({ onClose, onGroupCreated }) => {

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [step, setStep] = useState(1);

    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] =
        useState("");


    const currentUser =
        JSON.parse(localStorage.getItem("user"));

    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId || "";
    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get("/users");
                const userList = response.data?.users || response.data?.data || [];
                setUsers(
                    userList.filter(
                        (user) => user._id !== currentUserId
                    )
                );

            } catch (error) {
                console.log("GET USERS ERROR:", error);
                setError(error.response?.data?.message || "Failed to load users");

            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, [currentUserId]);

    const toggleUser = (user) => {
        setSelectedUsers((prev) => {
            const alreadySelected =
                prev.some(
                    (item) => item._id === user._id
                );
            if (alreadySelected) {
                return prev.filter(
                    (item) => item._id !== user._id
                );

            }

            return [...prev, user];

        });

    };

    const filteredUsers = users.filter((user) => {
        const value = search.toLowerCase();
        return (
            user.fullName?.toLowerCase().includes(value) ||
            user.mobileNumber?.toLowerCase().includes(value)
        );

    });


    const handleGroupImage = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;
        setGroupImage(file);
        setGroupImagePreview(
            URL.createObjectURL(file)
        );

    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            setError("Please enter group name");
            return;
        }

        if (selectedUsers.length === 0) {
            setError("Please select at least one member");
            return;
        }

        try {

            setError("");
            const formData = new FormData();
            formData.append("name", groupName.trim());

            formData.append(
                "members",
                JSON.stringify(
                    selectedUsers.map(
                        (user) => user._id
                    )
                )
            );

            if (groupImage) {
                formData.append(
                    "groupImage",
                    groupImage
                );
            }

            const response = await api.post("/groups", formData);
            console.log("GROUP CREATED:", response.data);
            const newGroup = response.data?.data || response.data?.group;
            if (onGroupCreated) {
                onGroupCreated(newGroup);
            }
            onClose();

        } catch (error) {
            console.log("CREATE GROUP ERROR:", error);
            setError(error.response?.data?.message || "Failed to create group");
        }

    };


    if (step === 1) {

        return (

            <div className="create-group-page">
                <div className="create-group-header">
                    <button
                        type="button"
                        onClick={onClose}
                        className="create-group-back"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h2>  Add group members </h2>
                        <span>
                            {selectedUsers.length}
                            {" "}
                            selected
                        </span>
                    </div>
                </div>


                <div className="create-group-search">
                    <FaSearch />

                    <input type="text" value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        } placeholder="Search name, number or @username"
                    />

                </div>


                <div className="create-group-users">
                    {loading ? (
                        <div className="group-loading">
                            Loading users...
                        </div>
                    ) : error ? (
                        <div className="group-error">
                            {error}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="group-empty">
                            No users found
                        </div>
                    ) : (
                        filteredUsers.map(
                            (user) => {
                                const selected = selectedUsers.some((item) => item._id === user._id);
                                return (

                                    <div key={user._id} className={`group-user-item ${selected ? "selected" : ""}`}  onClick={() => toggleUser(user) }>
                                        <div className="group-user-avatar">
                                            {user.profileImage ? (
                                                <img src={  user.profileImage  } alt={  user.fullName }  />
                                            ) : (
                                                <FaUser />
                                            )}
                                        </div>

                                        <div className="group-user-info">
                                            <h3>{ user.fullName}</h3>
                                            <span>{ user.mobileNumber}</span>
                                        </div>
                                        <div
                                            className={`group-select-circle ${selected? "checked": ""}`}>
                                            {selected && (
                                                <FaCheck />
                                            )}
                                        </div>

                                    </div>
                                );

                            }
                        )

                    )}

                </div>
                <div className="create-group-footer">

                    <span>
                        {selectedUsers.length}
                        {" "}
                        member
                        {selectedUsers.length !== 1
                            ? "s"
                            : ""}
                    </span>
                    <button
                        type="button"
                        disabled={
                            selectedUsers.length === 0
                        }
                        onClick={() =>
                            setStep(2)
                        }
                    >
                        Next
                       <FaArrowRight />
                    </button>
                </div>

            </div>

        );

    }

    return (

        <div className="create-group-page">
            <div className="create-group-header">
                <button type="button" onClick={() => setStep(1) } className="create-group-back">
                    <FaArrowLeft />
                </button>
                <div>
                    <h2>  New group  </h2>
                    <span>
                        {selectedUsers.length}
                        {" "}
                        members
                    </span>
                </div>
            </div>


            <div className="group-details">
                <label className="group-image-upload">
                    {groupImagePreview ? (
                        <img src={ groupImagePreview } alt="Group" />
                    ) : (
                        <FaUser />
                    )}

                    <input type="file" accept="image/*" onChange={handleGroupImage}/>
                </label>

                <input
                    type="text"
                    className="group-name-input"
                    value={groupName}
                    onChange={(e) =>
                        setGroupName(
                            e.target.value
                        )
                    }
                    placeholder="Group name"
                    maxLength={50}
                />
                {error && (

                    <p className="group-error">
                        {error}
                    </p>

                )}

                <div className="selected-members">
                    <h3>Members </h3>

                    {selectedUsers.map(
                        (user) => (
                            <div key={user._id} className="selected-member">
                                <div className="group-user-avatar">
                                    {user.profileImage ? (
                                        <img  src={  user.profileImage } alt={ user.fullName  }  />
                                    ) : (
                                        <FaUser />
                                    )}
                                </div>
                                <span>  {  user.fullName } </span>
                            </div>

                        )
                    )}

                </div>
                <button type="button" className="create-group-button" onClick={handleCreateGroup}>
                    Create Group
                </button>

            </div>

        </div>

    );
};

export default CreateGroup;