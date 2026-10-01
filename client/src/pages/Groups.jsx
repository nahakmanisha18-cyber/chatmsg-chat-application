import api from "../api/axios";
import React, { useEffect, useState } from "react";

import Sidebar from "../Components/Chat/Sidebar";
import GroupChatWindow from "../Components/Chat/GroupChatWindow";
import GroupEmpty from "../Components/Chat/GroupEmpty";
import CreateGroup from "../Components/Chat/CreateGroup";
import ConversationList from "../Components/Chat/ConversationList";

import "../style/Groups.css";

const Groups = () => {

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);

    const [groups, setGroups] = useState([]);

    useEffect(() => {

        const fetchGroups = async () => {

            try {
                const response = await api.get("/groups");
                console.log("GROUPS RESPONSE:", response.data);
                setGroups(response.data?.groups || []);

            } catch (error) {

                console.log("GET GROUPS ERROR:", error);

            }
        };

        fetchGroups();

    }, []);

    if (createGroupOpen) {

        return (
            <div className="messages-page">
                <div className="messages-layout">

                    <Sidebar />
                    <ConversationList type="group" selectedChat={selectedGroup} setSelectedChat={setSelectedGroup} setCreateGroupOpen={setCreateGroupOpen} />
                    <CreateGroup onClose={() => setCreateGroupOpen(false)}
                        onGroupCreated={(newGroup) => {
                            console.log("NEW GROUP:", newGroup);
                            if (newGroup) {
                                setGroups((prev) => [newGroup, ...prev]);
                            }
                            setCreateGroupOpen(false);
                        }}
                    />
                </div>

            </div>
        );
    }

    return (

        <div className="messages-page">

            <div className="messages-layout">

                <Sidebar />

                <ConversationList type="group" selectedChat={selectedGroup} setSelectedChat={setSelectedGroup} setCreateGroupOpen={setCreateGroupOpen} />

                {selectedGroup ? (
                    <GroupChatWindow selectedGroup={selectedGroup} onCloseChat={() => setSelectedGroup(null)}/>
                ) : (
                    <GroupEmpty />
                )}

            </div>

        </div>
    );
};

export default Groups;