import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState()
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()
    const [loading, setLoading] = useState(true)

    const toast = useToast()

    const fetchChats = async () => {
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get("/api/chat", config)
            // console.log(data);
            setChats(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats();
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="rgba(255, 255, 255, 0.1)"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
            backdropFilter="blur(10px)"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            border="3px solid rgba(255, 255, 255, 0.3)"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "23px", md: "25px" }}
                fontFamily="poppins"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        d="flex"
                        fontSize={{ base: "10px", md: "13px", lg: "15px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="rgba(255, 255, 255, 0.1)"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
                backdropFilter="blur(10px)"
                boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                border="3px solid rgba(255, 255, 255, 0.3)"
            >
                {loading ? (
                    <ChatLoading />
                ) : (
                    chats ? (
                        <Stack overflowY="scroll">
                            {chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender._id === user._id ? "You" : chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Text>No chats available</Text>
                    )
                )
                }
            </Box>
        </Box>
    );
}

export default MyChats
