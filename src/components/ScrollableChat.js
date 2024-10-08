import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../Context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {

    const { user } = ChatState()

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="12px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                    <span style={{
                        backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                        // borderRadius: "20px",
                        // padding: "10px 20px",
                        // marginBottom: "08px",
                        // marginRight: "08px",
                        // maxWidth: "75%",
                        // // border: "2px solid rgba(255, 255, 255, 0.3)",
                        // // boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px",
                        // // boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        // boxShadow: " 0 7px 15px 0 rgba(0, 0, 0, .12), 0 1px 4px 0 rgba(0, 0, 0, .10)",
                        // marginLeft: isSameSenderMargin(messages, m, i, user._id),
                        // marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,

                        // backdropFilter: "blur(10px)",  // Blur effect for glassmorphism
                        borderRadius: "20px",  // Rounded corners for a soft look
                        padding: "10px 20px",  // Adjusted padding for better spacing
                        marginBottom: "8px",  // Space between messages
                        marginRight: "8px",
                        maxWidth: "75%",  // Limiting the width to avoid stretching too far
                        border: "1px solid rgba(255, 255, 255, 0.18)",  // Thin border for subtle definition
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",  // Subtle shadow for depth
                        marginLeft: isSameSenderMargin(messages, m, i, user._id),  // Dynamic margin for alignment
                        marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                        color: "black",  // White text to contrast with the translucent background

                    }}>{m.content}</span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
