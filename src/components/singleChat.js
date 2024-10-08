import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import "./styles.css"
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animation/typing.json'

const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {


    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYmid slice"
        }
    }

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const toast = useToast()

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            // console.log(data)
            setLoading(false)

            socket.emit("join chat", selectedChat._id)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    }

    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat
    }, [selectedChat])

    console.log(notification);


    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // Give notification..
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const { data } = await axios.post(`/api/message`, {
                    content: newMessage,
                    chatId: selectedChat
                }, config)

                // console.log(data)
                socket.emit("new message", data)
                setMessages([...messages, data])
            } catch (error) {
                Toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
        }
    }



    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        //typing indicator logic..
        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="poppins"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    ><IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="rgba(255, 255, 255, 0.4)"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                        border="3px solid rgba(255, 255, 255, 0.3)"
                        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                    >

                        {/* Messages Here */}
                        <div className='messages'>
                            <ScrollableChat messages={messages} />
                        </div>
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto" />
                        ) : (
                            <div>
                                <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                                    {isTyping ? <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }} /> : <></>}
                                    <Input
                                        variant="filled"
                                        bg="#E0E0E0"
                                        placeholder="Enter a message.."
                                        value={newMessage}
                                        onChange={typingHandler}
                                        border="3px solid rgba(255, 255, 255, 0.3)"
                                        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                                        focusBorderColor='#38B2AC'
                                    />
                                </FormControl>
                            </div>
                        )}

                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="poppins">
                        Click on a user to start chatting...
                    </Text>
                </Box>
            )
            }
        </>
    )
}
export default SingleChat
