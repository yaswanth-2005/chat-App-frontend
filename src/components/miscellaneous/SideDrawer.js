import { Button } from "@chakra-ui/button";
import { Badge } from '@chakra-ui/react'
import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import axios from 'axios'
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { onOpen, onClose, isOpen } = useDisclosure()
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
    const history = useHistory()
    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push("/")
    }
    const toast = useToast()

    useEffect(() => {
        if (!search) {
            setSearchResult([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);


    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post("/api/chat", { userId }, config)
            // console.log(data)
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            // console.log(chats)
            setSelectedChat(data)
            setLoadingChat(false)
            onClose();

        } catch (error) {
            console.error(error.message)
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="rgba(255, 255, 255, 0.1)"
                w="100%"
                p="5px 10px"
                borderWidth="2px"
                borderRadius="10px"
                fontFamily="poppins"
                backdropFilter="blur(10px)"
                boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                border="3px solid rgba(255, 255, 255, 0.3)"

            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="poppins">
                    Chandu's Chat App
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1} position="relative">
                            <Box position="relative">
                                {notification.length > 0 && (
                                    <Badge
                                        colorScheme="red"
                                        borderRadius="full"
                                        position="absolute"
                                        top="-1"
                                        right="-2"
                                        fontSize="0.5em"
                                        px={2}
                                        py={1}
                                        zIndex="1"
                                    >
                                        {notification.length}
                                    </Badge>
                                )}
                                <BellIcon fontSize="2xl" m={1} />
                            </Box>
                        </MenuButton>

                        <MenuList pl={2} pr={2}>
                            {!notification.length && "No New messages."}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat)
                                        setNotification(notification.filter((n) => n !== notif))
                                    }}
                                >
                                    {
                                        notif.chat.isGroupChat
                                            ? `New Message in ${notif.chat.chatName}`
                                            : `New Message from ${getSender(user, notif.chat.users)}`
                                    }

                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="transparent" rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>{" "}
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )
                        }

                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    );
}

export default SideDrawer
