import api from "../api/axios";
import React, { useEffect, useState } from "react";
import { FaSearch, FaUsers, FaEllipsisV, FaPlus } from "react-icons/fa";

import Sidebar from "../Components/Chat/Sidebar";
import GroupChatWindow from "../Components/Chat/GroupChatWindow";
import GroupEmpty from "../Components/Chat/GroupEmpty";
import CreateGroup from "../Components/Chat/CreateGroup";
import "../style/Groups.css";
import ConversationList from "../Components/Chat/ConversationList";

const Groups = () => {

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [createGroupOpen, setCreateGroupOpen] =
        useState(false);

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/groups");
                console.log("GROUPS RESPONSE:", response.data);
                setGroups(response.data?.groups || []);

            } catch (error) {
                console.log("GET GROUPS ERROR:", error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load groups"
                )
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();

    }, []);

    if (createGroupOpen) {
        return (
            <div className="messages-page">
                <div className="messages-layout">
                    <Sidebar />
                    <CreateGroup
                        onClose={() => setCreateGroupOpen(false)}
                        onGroupCreated={(newGroup) => {
                            if (newGroup) {
                                setGroups((prev) => [
                                    newGroup,
                                    ...prev,
                                ]);
                            }
                            setCreateGroupOpen(false);
                        }}
                    />
                    <GroupEmpty />
                </div>
            </div>
        );
    }
    const filteredGroups = groups.filter((group) =>
        group.name .toLowerCase() .includes(search.toLowerCase())
    );
    return (

        <div className="messages-page">
            <div className="messages-layout">
                <Sidebar />
                <ConversationList type="group"  selectedChat={selectedGroup} setSelectedChat={setSelectedGroup} />
                {selectedGroup ? (
                    <GroupChatWindow  selectedGroup={selectedGroup} onCloseChat={() => setSelectedGroup(null)} />
                ) : (
                    <GroupEmpty />
                )}
            </div>
        </div>
    );
};


export default Groups;